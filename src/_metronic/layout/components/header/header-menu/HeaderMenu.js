/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { shallowEqual, useSelector,useDispatch } from "react-redux";
import {processListPath
        ,rolesPath
        ,usersPath
        ,PrescriptionBarcodeDetailesPath
    } from '../../../../../app/pages/commonConstants/RouteConstant';
import {AuthManagmentController,PrescriptionBarcodeController,PrescriptionController} from '../../../../../app/pages/commonConstants/ClaimsConstant';
export function HeaderMenu({ layoutProps }) {
    const tokenObject = useSelector(state=>state.tokenReducer.TokenObject.userInfo.claims);
    const location = useLocation();
    const getMenuItemActive = (url) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    }
    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>

                        {/*end::1 Level*/}
                        {/*begin::1 Level*/}
               {
                   tokenObject.find(z=>z.controllerEntityID==AuthManagmentController)!==undefined?
               <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/')}`}>
                <NavLink className="menu-link menu-toggle" to="/">
                    <span className="menu-text">بخش امنیت</span>
                    <i className="menu-arrow"></i>
                </NavLink>
                <div className="menu-submenu menu-submenu-classic menu-submenu-left">

                <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                <ul className="menu-subnav">
                        {/*begin::2 Level*/}
                        <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(usersPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link" to={usersPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-left-panel-1.svg")} />
                                </span>
                                <span className="menu-text">
                                     مدیریت کاربران
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}
                                                {/*begin::2 Level*/}
                                                <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(rolesPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link" to={rolesPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-left-panel-1.svg")} />
                                </span>
                                <span className="menu-text">
                                     مدیریت نقش ها
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}
                    </ul>
                </div>

                </div>
            </li>
                 :<></>
                }
            {/*end::1 Level*/}
            {/*begin::1 Level*/}
            {
                tokenObject.find(z=>z.controllerEntityID==PrescriptionBarcodeController)!==undefined?
            <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/')}`} style={{padding:'0px !important'}}>
                <NavLink className="menu-link menu-toggle" to="/">
                    <span className="menu-text">سازمان غذا و دارو</span>
                    <i className="menu-arrow"></i>
                </NavLink>
                <div className="menu-submenu menu-submenu-classic menu-submenu-left">

                    <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                        <ul className="menu-subnav">
                            {/*begin::2 Level*/}
                            <li
                                className={`menu-item menu-item-submenu ${getMenuItemActive(PrescriptionBarcodeDetailesPath)}`}
                                data-menu-toggle="hover"
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link" to={PrescriptionBarcodeDetailesPath}>
                                    <span className="svg-icon menu-icon">
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-left-panel-1.svg")} />
                                    </span>
                                    <span className="menu-text">
                                        تاریخچه درخواست های ارسالی
                                    </span>
                                </NavLink>
                            </li>
                            {/*end::2 Level*/}
                        </ul>
                    </div>
                </div>
            </li>
            :<></>
            }
        </ul>
        {/*end::Header Nav*/}
    </div>;
}
