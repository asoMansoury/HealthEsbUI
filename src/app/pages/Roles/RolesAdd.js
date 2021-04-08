import React, { useEffect,useState } from 'react';
import { Show_add,Is_added } from '../_redux/Actions/usersActions';
import { Hide_add } from '../_redux/Actions/usersActions';
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {AdminUserCreateRolesApi} from '../commonConstants/apiUrls';
import axios from 'axios';
import validator from 'validator'
import DropDown from '../component/UI/DropDown';
import { NumberToWords } from "persian-tools2";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import checkRequests from '../component/ErrroHandling';
export function RolesAdd(props){
    const dispatch = useDispatch();
    const reduxProps = useSelector(state=>state.users);
    const [leftSideBar,setLeftSideBar] = React.useState(-SideBarConfig.width);
    const [selectedRole,setSelectedRole]=useState([]);
    const [selectedRoleID,setSelectedRoleID]=useState([]);
    const [model,setModel] = useState({
        name:''
    });
    function closeClick() {
        dispatch(Hide_add());
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

    useEffect(()=>{
        if (reduxProps.Show_Hide_Add == 'Show_add') {
            showSideBar();
        }
        else if (reduxProps.Show_Hide_Add == 'Hide_add')
            hideSideBar();
    },[reduxProps])

    const notifySuccess = (title) => toast('نقش ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = (title) => toast('در حال افزودن نقش  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const notifyNotValidateTitle = (errorTitle) => toast(errorTitle, { duration: toastConfig.duration, style: toastConfig.errorStyle });

   function save() {
        if(!validate())
            return;
        var data = {
            name:model.name,
        }
        axios.post(AdminUserCreateRolesApi, data)
            .then(res => {
                if(res.data.hasError==false){
                    notifySuccess(model.userName);
                    dispatch(Is_added());
                }else{
                  notifyError(res.data.errorMessage);
                }
            })
            .catch(error => {
                notifyError(error);
            });
        dispatch(Hide_add());
        notifyInfo(model.name);
    }
    
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
                <div className='category-add-header-text'>افزودن نقش</div>
            </div>
            <div className='category-add-body'>                
                <Form.Label className='custom-label bold'>نام نقش</Form.Label>
                <Form.Control  className='form-control-custom' type="Name" aria-required={true} onChange={(e)=>setModel({...model,name:e.target.value})} />
            </div>
            <div className='category-add-footer'>
                <div className='btn-custom btn-custom-save' onClick={save}>ذخیره</div>
                <div className='btn-custom btn-custom-cancel' onClick={closeClick}>انصراف</div>
            </div>
        </div>
    );
}

export default checkRequests(RolesAdd,axios);