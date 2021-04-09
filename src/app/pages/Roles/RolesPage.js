import React from 'react';
import RolesList from './RolesList';
import RolesAdd from './RolesAdd';
import RolesEdit from './RolesEdit';
import axios from 'axios';
import {AdminUserGetRolesApi} from '../commonConstants/apiUrls';

export class RolesPage extends React.Component {
    constructor(){
        super();
    }

    fillDropDownsData(){
    }


    render() {
            return (
                <>
                    <RolesList></RolesList>
                    <RolesAdd></RolesAdd>
                    <RolesEdit></RolesEdit>
                </>
            );
    }
}

export default RolesPage;