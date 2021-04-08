import React from 'react';
import UsersList from './UsersList';
import UsersAdd from './UsersAdd';
import UsersEdit from './UsersEdit';
import axios from 'axios';
import {AdminUserGetRolesApi} from '../commonConstants/apiUrls';
import checkRequests from '../component/ErrroHandling';

export class UsersPage extends React.Component {
    constructor(){
        super();
        this.state = {
            rolesSource:[]
        }
        this.fillDropDownsData = this.fillDropDownsData.bind(this);
        this.fillDropDownsData();
    }

    fillDropDownsData(){
        let api= AdminUserGetRolesApi;
        const roleTempArray=[];
        axios.post(api,{}).then((res)=>{
            if(res.data.hasError==false){
                res.data.roles.map((item,index)=>{
                    var obj ={
                        label:item.name,
                        value:item.id
                      };
                      roleTempArray.push(obj);
                })
                this.setState({...this.state,
                    rolesSource:roleTempArray
                });
            }
        }).catch((error)=>{
            
        })
    }


    render() {
            return (
                <>
                    <UsersList></UsersList>
                    <UsersAdd
                        rolesSource={this.state.rolesSource}
                    ></UsersAdd>
                    <UsersEdit
                        rolesSource={this.state.rolesSource}
                    ></UsersEdit>
                </>
            );
    }
}

export default checkRequests(UsersPage,axios);