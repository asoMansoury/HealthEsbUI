import React, { useEffect,useState } from 'react';
import { Show_add } from '../_redux/Actions/usersActions';
import { Hide_add } from '../_redux/Actions/usersActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import {AdminUserCreateUserApi} from '../commonConstants/apiUrls';
import axios from 'axios';
import { Is_added } from '../_redux/Actions/usersActions';
import validator from 'validator'
import DropDown from '../component/UI/DropDown';
import { NumberToWords } from "persian-tools2";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import checkRequests from '../component/ErrroHandling';

export function UsersAdd(props){
    const dispatch = useDispatch();
    const reduxProps = useSelector(state=>state.users);
    const [leftSideBar,setLeftSideBar] = React.useState(-SideBarConfig.width);
    const [selectedRole,setSelectedRole]=useState([]);
    const [selectedRoleID,setSelectedRoleID]=useState([]);
    const [model,setModel] = useState({
        userName:'',
        email:'',
        password:''
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

    function emailOnBlur(){
        var email = model.email;
        if(email!==''){
            if(!validator.isEmail(email))
            {
                notifyError("فرمت ایمیل صحیح نمی باشد.")
                return false;
            }
        }
        return true;
    }


    function passwordOnBlur(){
        var password = model.password;
        if(password===''){
            notifyError("کلمه عبور الزامی می باشد.");
            return false;
        }

        return true;
    }

    useEffect(()=>{
        if (reduxProps.Show_Hide_Add == 'Show_add') {
            showSideBar();
        }
        else if (reduxProps.Show_Hide_Add == 'Hide_add')
            hideSideBar();
    },[reduxProps])

    const notifySuccess = (title) => toast('کاربر ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = (title) => toast('در حال افزودن کاربر  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const notifyNotValidateTitle = (errorTitle) => toast(errorTitle, { duration: toastConfig.duration, style: toastConfig.errorStyle });

   function save() {
        if(!validate())
            return;
        var data = {
            UserName:model.userName,
            Email:model.email,
            Password:model.password,
            LstRoleId:selectedRoleID,
        }
        axios.post(AdminUserCreateUserApi, data)
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
        notifyInfo(model.userName);
    }
    
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
                <div className='category-add-header-text'>افزودن کاربر</div>
            </div>
            <div className='category-add-body'>                
                <Form.Label className='custom-label bold'>نام کاربری</Form.Label>
                <Form.Control  className='form-control-custom' type="Name" aria-required={true} onChange={(e)=>setModel({...model,userName:e.target.value})} />

                <Form.Label className='custom-label bold'>ایمیل</Form.Label>
                <Form.Control  className='form-control-custom' type="Name" onBlur={emailOnBlur} aria-required={true} onChange={(e)=>setModel({...model,email:e.target.value})}/>
                
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
                <Form.Control className='form-control-custom' onChange={(e)=>setModel({...model,password:e.target.value})} type="Password" aria-required={true} />

            </div>
            <div className='category-add-footer'>
                <div className='btn-custom btn-custom-save' onClick={save}>ذخیره</div>
                <div className='btn-custom btn-custom-cancel' onClick={closeClick}>انصراف</div>
            </div>
        </div>
    );
}

export default checkRequests(UsersAdd,axios);