import React,{useEffect,useState} from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/usersActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {AdminUserUpdateUserApi,AdminUserGetUserRoleApi} from '../commonConstants/apiUrls';
import { fr } from 'date-fns/locale';
import validator from 'validator';
import DropDown from '../component/UI/DropDown';
import { NumberToWords } from "persian-tools2";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';

export function UsersEdit(props) {
    const dispatch = useDispatch();
    const reduxProps = useSelector(state=>state.users);
    const [leftSideBar,setLeftSideBar] = React.useState(-SideBarConfig.width);
    const [selectedRole,setSelectedRole]=useState([]);
    const [selectedRoleID,setSelectedRoleID]=useState([]);
    const [model,setModel] = useState({
        userName:'',
        email:'',
        password:'',
        id:''
    });
   function emailOnBlur(){
        var email = model.email;
        if(email!==''){
            if(!validator.isEmail(email)){
                this.notifyError("فرمت ایمیل صحیح نمی باشد.")
                return false;
            }
        }
        return true;
    }
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
   const notifySuccess = () => toast('کاربر با شناسه ' + model.id + ' با موفقیت ویرایش شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
   const notifyError = (error) => toast( error , { duration: toastConfig.duration, style: toastConfig.errorStyle });
   const notifyInfo = () => toast('در حال ویرایش کاربر با شناسه ' + model.id + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
   const notifyNotValidateTitle = () => toast('عنوان وارد نشده است.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
   function passwordOnBlur(){
        var password = model.password;
        if(password===undefined||password===''){
            notifyError("کلمه عبور الزامی می باشد.");
            return false;
        }

        return true;
    }
    function onChangeUserRole(e){
        setSelectedRole(e);
        if(e!=null){
            var tmpArray=[];
            e.map((item,index)=>{
                tmpArray.push(item.value);
            });
            setSelectedRoleID(tmpArray);
        }else{
            setSelectedRoleID([]);
        }
      }
   function save() {
        if(!validate())
            return;
            var data = {
                UserName:model.userName,
                Email:model.email,
                Password:model.password,
                LstRoleId:selectedRoleID,
                Id:model.id
            }
        axios.post(AdminUserUpdateUserApi, data)
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
                email:item.email,
                userName:item.userName,
                id:item.id
            });
            
            var data ={
                id:item.id
            }
            axios.post(AdminUserGetUserRoleApi,data).then((response)=>{
                if(response.data.hasError===false){
                    var tmpRole=[];
                    var tmpRolesID=[];
                    response.data.roles.map((item,index)=>{
                          tmpRole.push({label:item.name,value:item.id});
                          tmpRolesID.push(item.id);
                    });
                    setSelectedRole(tmpRole);
                    setSelectedRoleID(tmpRolesID);
                }
            }).catch((error)=>{

            })
        }
        else if (reduxProps.Show_Hide_Edit.type == 'Hide_edit')
            hideSideBar();
    },[reduxProps])
   function validate(){
    let hasError = false;
    if(passwordOnBlur()===false){
        hasError =true;
    }
    if(model.userName===''){
        notifyError("نام کاربر الزامی می باشد.")
        return false;
    }
    if(model.email===''){
        notifyError("ایمیل الزامی می باشد.");
        return false;
    }
    if(emailOnBlur()===false){
        hasError=true;
    }
    return !hasError;
    }
        return (
            <div className='category-add-container' style={{ left: leftSideBar + 'px', width: SideBarConfig.width + 'px' }}>
                <div className='category-add-header' style={{ gridTemplateColumns: (SideBarConfig.width / 2) + 'px ' + (SideBarConfig.width / 2) + 'px' }}>
                    <div className='category-add-close-btn-container'>
                        <button className='category-add-close-btn' onClick={closeClick}>x</button>
                    </div>
                    <div className='category-add-header-text'>ویرایش کاربر</div>
                </div>
                    <div className='category-add-body'>
                    <Form.Label className='custom-label bold'>نام کاربری</Form.Label>
                    <Form.Control  className='form-control-custom' value={model.userName} type="Name" aria-required={true} onChange={(e)=>setModel({...model,userName:e.target.value})} />

                    <Form.Label className='custom-label bold'>ایمیل</Form.Label>
                    <Form.Control  className='form-control-custom' type="Name" value={model.email} onBlur={emailOnBlur} aria-required={true} onChange={(e)=>setModel({...model,email:e.target.value})}/>
                    
                    <Form.Label className='custom-label bold' onChange={(e)=>setModel({...model,userName:e.target.value})}>نقش کاربر</Form.Label>
                    <Select
                            value={selectedRole}
                            onChange={onChangeUserRole}
                            isRtl={true}
                            isSearchable={true}
                            closeMenuOnSelect={false}
                            isMulti
                            options={props.rolesSource}/>
                    <Form.Label className='custom-label bold'>کلمه عبور</Form.Label>
                    <Form.Control className='form-control-custom' value={model.password} onChange={(e)=>setModel({...model,password:e.target.value})} type="Password" aria-required={true} />

                    </div>
                <div className='category-add-footer'>
                    <div className='btn-custom btn-custom-save' onClick={save}>ذخیره</div>
                    <div className='btn-custom btn-custom-cancel' onClick={closeClick}>انصراف</div>
                </div>
            </div>
        );
}

const mapStateToProps = (state => {
    return {
        Show_Hide_Edit: state.users.Show_Hide_Edit,
        Is_Edited: state.users.Is_Edited
    };
});
const mapDispatchToProps = (dispatch) => ({
    hideFunction: () => dispatch(Hide_edit()),
    edited: () => dispatch(Is_edited())
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersEdit);