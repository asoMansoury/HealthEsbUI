import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import deleteImage from '../pulseDesignImages/delete.svg';
import { Is_deleted_group } from '../_redux/Actions/usersActions';
import { connect } from "react-redux";
import { API_URL, toastConfig } from '../Config';
import axios from 'axios';
import toast from 'react-hot-toast';
import {AdminUserRemoveByIdsApi} from '../commonConstants/ApiConstants';

function UsersModalDeleteGroup(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const notifySuccess = () => toast('عملیات حذف گروهی با موفقیت انجام شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = () => toast('عملیات حذف گروهی با خطا مواجه شد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = () => toast('در حال حذف گروهی کاربران ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const deleteBtn = () => {
        let input = props.selected.map(x => parseInt(x));
        axios.put(AdminUserRemoveByIdsApi, { ids: input })
            .then(res => {
                notifySuccess();
                props.deletedGroup();
            })
            .catch(error => {
                notifyError();
            });
        setShow(false);
        notifyInfo();
    }

    return (
        <>
            <div onClick={handleShow} className='delete-all pointer bold'>
                حذف تمام موارد
          </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>
                            پیام سیستم
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        props.selected.length == 1 ?
                            (<span className='description-modal'>
                                {props.selected.length} کاربر حذف میشود. تایید میکنید؟
                            </span>)
                            :
                            (<span className='description-modal'>
                                {props.selected.length} کاربر حذف میشوند. تایید میکنید؟
                            </span>)
                    }
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

const mapStateToProps = (state => {
    return {

    };
});
const mapDispatchToProps = (dispatch) => ({
    deletedGroup: () => dispatch(Is_deleted_group())
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersModalDeleteGroup);