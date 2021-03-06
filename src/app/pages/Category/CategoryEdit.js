import React from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/categoryActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form } from 'react-bootstrap';
import {GeneralParamterEditApi} from '../commonConstants/ApiConstants'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export class CategoryEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            isLoading: false,
            description: '',
            dbid: -1,
            title: ''
        }
        this.closeClick = this.closeClick.bind(this);
        this.titleKeyUp = this.titleKeyUp.bind(this);
        this.descriptionKeyUp = this.descriptionKeyUp.bind(this);
        this.save = this.save.bind(this);

        this.titleInputRef = React.createRef();
        this.descriptionRef = React.createRef();
    }
    closeClick() {
        // if(this.state.isLoading)
        //     return;
        this.props.hideFunction();
    }
    showSideBar() {
        // setTimeout(() => {
        //     this.setState({isLoading: false});
        //     this.titleInputRef.current.focus();
        // }, 1500);
        this.titleInputRef.current.focus();

        let frame = 20;
        let duration = SideBarConfig.animationDuration;
        let width = SideBarConfig.width;
        let step = width / duration * frame;
        let left = this.state.leftSideBar;
        let timer;
        timer = setInterval(() => {
            if (left >= 0) {
                this.setState({ leftSideBar: 0 });
                clearInterval(timer);
                return;
            }
            left += step;
            this.setState({ leftSideBar: left });
        }, frame);
    }
    hideSideBar() {
        // setTimeout(() => {
        //     this.setState({ isLoading: true })
        // }, 500);

        let frame = 20;
        let duration = SideBarConfig.animationDuration;
        let width = SideBarConfig.width;
        let step = width / duration * frame;
        let left = this.state.leftSideBar;
        let timer;
        timer = setInterval(() => {
            if (left <= -width) {
                this.setState({ leftSideBar: -width });
                clearInterval(timer);
                return;
            }
            left -= step;
            this.setState({ leftSideBar: left });
        }, frame);
    }
    notifySuccess = () => toast('???????? ???????? ???? ?????????? ' + this.state.dbid + ' ???? ???????????? ???????????? ????.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (erorMessage) => toast(erorMessage, { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = () => toast('???? ?????? ???????????? ???????? ???????? ???? ?????????? ' + this.state.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    save() {
        // if(this.state.isLoading)
        //     return;
        if(!this.validate())
            return;
        axios.post(GeneralParamterEditApi, { ID: this.state.dbid, Title: this.state.title, Description: this.state.description })
            .then(res => {
                console.log(res.data);
                if(res.data.hasError===false){
                    this.notifySuccess(res.data.errorMessage);
                    this.props.edited();
                }else{
                    this.notifyError(res.data.errorMessage);
                }


            })
            .catch(error => {
                // console.log(error);
                this.notifyError();
            });
            this.props.hideFunction();
            this.notifyInfo();

        // this.setState({ isLoading: true });
    }
    titleKeyUp(e) {
        this.setState({ title: e.target.value });
    }
    descriptionKeyUp(e) {
        this.setState({ description: e.target.value });
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.Show_Hide_Edit.type == 'Show_edit') {
            this.showSideBar();
            this.titleInputRef.current.focus();
        }
        else if (nextprops.Show_Hide_Edit.type == 'Hide_edit') {
            this.hideSideBar();
        }
        this.titleInputRef.current.value = nextprops.Show_Hide_Edit.obj.title == undefined ? '' : nextprops.Show_Hide_Edit.obj.title;
        this.descriptionRef.current.value = nextprops.Show_Hide_Edit.obj.description == undefined ? '' : nextprops.Show_Hide_Edit.obj.description;
        if (!this.props.Is_Edited && nextprops.Show_Hide_Edit.type != 'Hide_edit') {
            this.setState({
                description: nextprops.Show_Hide_Edit.obj.description,
                dbid: parseInt(nextprops.Show_Hide_Edit.obj.id),
                title: nextprops.Show_Hide_Edit.obj.title
            });
        }
    }
    notifyNotValidateTitle = () => toast('?????????? ???????? ???????? ??????.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    validate(){
        let hasError = false;
        if(this.titleInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle();
        }
        return !hasError;
    }
    render() {
        return (
            <div className='category-add-container' style={{ left: this.state.leftSideBar + 'px', width: SideBarConfig.width + 'px' }}>
                <div className='category-add-header' style={{ gridTemplateColumns: (SideBarConfig.width / 2) + 'px ' + (SideBarConfig.width / 2) + 'px' }}>
                    <div className='category-add-close-btn-container'>
                        <button className='category-add-close-btn' onClick={this.closeClick}>x</button>
                    </div>
                    <div className='category-add-header-text'>???????????? ???????? ????????</div>
                </div>
                <div className='category-add-body'>
                    <div style={{ /*display: this.state.isLoading ? 'none' : 'block'*/ }}>
                        <Form.Label className='custom-label bold'>??????????</Form.Label>
                        <Form.Control onKeyUp={this.titleKeyUp} ref={this.titleInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        <Form.Label className='custom-label marg-t-20 bold'>??????????????</Form.Label>
                        <Form.Control onKeyUp={this.descriptionKeyUp} ref={this.descriptionRef} className='form-control-custom' as="textarea" rows="4" />
                    </div>
                    {/* <div className='pre-loader-container' style={{ display: !this.state.isLoading ? 'none' : 'flex' }}>
                        <Preloader
                            use={Oval}
                            size={50}
                            strokeWidth={8}
                            strokeColor="#8950FC"
                            duration={1000}
                        />
                    </div> */}
                </div>
                <div className='category-add-footer'>
                    <div className='btn-custom btn-custom-save' onClick={this.save}>??????????</div>
                    <div className='btn-custom btn-custom-cancel' onClick={this.closeClick}>????????????</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state => {
    return {
        Show_Hide_Edit: state.category.Show_Hide_Edit,
        Is_Edited: state.category.Is_Edited
    };
});
const mapDispatchToProps = (dispatch) => ({
    // showFunction: () => dispatch(Show_edit()),
    hideFunction: () => dispatch(Hide_edit()),
    edited: () => dispatch(Is_edited())
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit);