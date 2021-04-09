import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector,useDispatch } from "react-redux";
import {Layout} from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";

export function Routes() {
    const tokenObject = useSelector(state=>state.tokenReducer.TokenObject);
    return (
        <HashRouter basename="/">
        <Switch>
            {tokenObject.Token===''? (
                /*Render auth page when user at `/auth` and not authorized.*/
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                /*Otherwise redirect to root page (`/`)*/
                <Layout>
                    <BasePage/>
                </Layout>
            )}

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
        </HashRouter>
    );
}
