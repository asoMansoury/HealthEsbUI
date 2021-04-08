import React,{useEffect,useState} from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/usersActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {AdminUserUpdateRolesApi} from '../commonConstants/apiUrls';
import { fr } from 'date-fns/locale';
import validator from 'validator';
import DropDown from '../component/UI/DropDown';
import { NumberToWords } from "persian-tools2";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import checkRequests from '../component/ErrroHandling';
export function RolesEdit(props) {
    const dispatch = useDispatch();
    const reduxProps = useSelector(state=>state.users);
    const [leftSideBar,setLeftSideBar] = React.useState(-SideBarConfig.width);
    const [selectedRole,setSelectedRole]=useState([]);
    const [selectedRoleID,setSelectedRoleID]=useState([]);
    const [model,setModel] = useState({
        name:'',
        id:''
    });
    function closeClick() {
        dispatch(Hide_edit());
    }
    function showSideBar() {
        let frame = 20;
        let duration = SideBarConfig.animationDuration;
        let width = SideBarConfig.width;
        let step = width / duration * frame;
        let left = leftSideBar;
        let timer;
        timer = setInterval(() => {
            if (left >= 0) {
                setLeftSideBar(0);
                clearInterval(timer);
                return;
            }
            left += step;
            setLeftSideBar(left);
        }, frame);
    }
    function hideSideBar() {
        let frame = 20;
        let duration = SideBarConfig.animationDuration;
        let width = SideBarConfig.width;
        let step = width / duration * frame;
        let left = leftSideBar;
        let timer;
        timer = setInterval(() => {
            if (left <= -width) {
                setLeftSideBar(-width);
                clearInterval(timer);
                return;
            }
            left -= step;
            setLeftSideBar(left);
        }, frame);
    }
   const notifySuccess = () => toast('نقش با شناسه ' + model.id + ' با موفقیت ویرایش شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
   const notifyError = (error) => toast( error , { duration: toastConfig.duration, style: toastConfig.errorStyle });
   const notifyInfo = () => toast('در حال ویرایش نقش با شناسه ' + model.id + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
   const notifyNotValidateTitle = () => toast('عنوان وارد نشده است.', { duration: toastConfig.duration, style: toastConfig.errorStyle });

   function save() {
        if(!validate())
            return;
        var data = {
            name:model.name,
            Id:model.id
        }
        axios.post(AdminUserUpdateRolesApi, data)
            .then(res => {
                if(res.data.hasError==false){
                  notifySuccess();
                  dispatch(Is_edited());
                }else{
                  notifyError(res.data.errorMessage);
                }
            })
            .catch(error => {
                notifyError();
            });
        dispatch(Hide_edit());
        notifyInfo();
    }
    
    useEffect(()=>{
        if (reduxProps.Show_Hide_Edit.type == 'Show_edit')  {
            showSideBar();
            var item = reduxProps.Show_Hide_Edit.obj.row;
            setModel({
                name:item.name,
                id:item.id
            });

        }
        else if (reduxProps.Show_Hide_Edit.type == 'Hide_edit')
            hideSideBar();
    },[reduxProps])
   
    function validate(){
    let hasError = false;
    if(model.name===''){
        notifyError("نام نقش الزامی می باشد.")
        return false;
    }
    return !hasError;
    }
        return (
            <div className='category-add-container' style={{ left: leftSideBar + 'px', width: SideBarConfig.width + 'px' }}>
                <div className='category-add-header' style={{ gridTemplateColumns: (SideBarConfig.width / 2) + 'px ' + (SideBarConfig.width / 2) + 'px' }}>
                    <div className='category-add-close-btn-container'>
                        <button className='category-add-close-btn' onClick={closeClick}>x</button>
                    </div>
                    <div className='category-add-header-text'>ویرایش نقش</div>
                </div>
                    <div className='category-add-body'>
                    <Form.Label className='custom-label bold'>نام نقش</Form.Label>
                    <Form.Control  className='form-control-custom' value={model.name} type="Name" aria-required={true} onChange={(e)=>setModel({...model,name:e.target.value})} />
                    </div>
                <div className='category-add-footer'>
                    <div className='btn-custom btn-custom-save' onClick={save}>ذخیره</div>
                    <div className='btn-custom btn-custom-cancel' onClick={closeClick}>انصراف</div>
                </div>
            </div>
        );
}
export default checkRequests(RolesEdit,axios) ;