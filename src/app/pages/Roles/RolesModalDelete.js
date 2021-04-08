import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import deleteImage from '../pulseDesignImages/delete.svg';
import { Is_deleted_one } from '../_redux/Actions/usersActions';
import { useDispatch, useSelector } from "react-redux";
import { API_URL, toastConfig } from '../Config';
import axios from 'axios';
import toast from 'react-hot-toast';
import {AdminUserRemoveByIdsApi} from '../commonConstants/ApiConstants';
import checkRequests from '../component/ErrroHandling';

function UsersModalDelete(props) {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const notifySuccess = () => toast('کاربر با شناسه ' + props.dbid + ' با موفقیت حذف شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = () => toast('عملیات حذف کاربر با شناسه ' + props.dbid + ' با خطا مواجه شد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = () => toast('در حال حذف کاربر با شناسه ' + props.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const deleteBtn = () => {
        axios.put(AdminUserRemoveByIdsApi, { ids: [parseInt(props.dbid)] })
            .then(res => {
                if(res.data.hasError==false){
                    notifySuccess();
                    dispatch(Is_deleted_one());
                }else{
                    notifyError();
                }

            })
            .catch(error => {
                notifyError();
            });
        setShow(false);
        notifyInfo();
    }

    return (
        <>
            <div onClick={handleShow} className="delete-img-con btn-for-select"><img className='delete-img btn-for-select' src={deleteImage} /></div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>
                            پیام سیستم
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span className='description-modal'>
                        کاربر {props.name} با شناسه {props.dbid} حذف میشود. تایید میکنید؟
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        انصراف
                    </Button>
                    <Button variant="primary" onClick={deleteBtn}>
                        تایید
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default checkRequests(UsersModalDelete,axios);