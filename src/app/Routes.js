import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector,useDispatch } from "react-redux";
import {Layout} from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
export function Routes() {
    const tokenObject = useSelector(state=>state.tokenReducer.TokenObject);
    const {isAuthorized} = useSelector(
        ({tokenReducer})=>({
                token:tokenReducer
            }),
        ({auth}) => ({
            isAuthorized: auth.user != null,
        }),
        shallowEqual
    );
    return (
        <Switch>
                <Layout>
                    <BasePage/>
                </Layout>
            {/* {tokenObject.isAuthorized===false? ( */}
                {/* <Route> */}
                    {/* <AuthPage /> */}
                {/* </Route> */}
            {/* ) : ( */}
                {/* <Layout> */}
                    {/* <BasePage/> */}
                {/* </Layout> */}
            {/* )} */}

            <Route path="/error" component={ErrorsPage}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/auth/login" component={AuthPage}></Route>
            {/* <Route path="/auth/login" exact 
                render={() => {
                    return (
                        tokenObject.isAuthorized ?
                        <Redirect to="/auth/login" /> :
                        <Redirect to="/logout" /> 
                    )
                }}
            ></Route> */}
            
        </Switch>
    );
}
