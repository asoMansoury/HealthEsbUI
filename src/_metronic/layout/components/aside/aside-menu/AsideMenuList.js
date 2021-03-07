/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {stockroomManagePath
    ,categoryPath
    ,balancestocManagePath
    ,usersPath
    ,processDefinitionPath
    ,processPath
    ,processListPath
    ,flowProcessAddPath
    ,flowProcessListPath
    ,CostCateogryPath
    ,CostListPath
} from '../../../../../app/pages/commonConstants/RouteConstant';
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";
export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
        ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
        : "";
  };

  return (
      <>
        {/* begin::Menu Nav */}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/* begin::section */}
          <li className="menu-section ">
            <h4 className="menu-text">منو کاری</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
          {/* end:: section */}
          <li
              className={`menu-item ${getMenuItemActive({categoryPath})}`}
              aria-haspopup="true">
              <NavLink className="menu-link" to={categoryPath}>
                  <span className="svg-icon menu-icon">
                      <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
                  </span>
                  <span className="menu-text">دسته بندی ها</span>
              </NavLink>
          </li>
            
                        {/* Inputs */}
            {/*begin::2 Level*/}
            <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                    "/google-material/inputs", true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
            >
                <NavLink className="menu-link menu-toggle" to="/google-material/inputs">
                <i className="menu-bullet menu-bullet-dot">
                    <span/>
                </i>
                <span className="menu-text">فرایند</span>
                <i className="menu-arrow"/>
                </NavLink>
                <div className="menu-submenu ">
                <i className="menu-arrow"/>
                <ul className="menu-subnav">
  

                    {/*begin::3 Level*/}
                    <li
                        className={`menu-item ${getMenuItemActive({processPath})}`}
                        aria-haspopup="true">
                        <NavLink className="menu-link" to={processPath}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
                            </span>
                            <span className="menu-text">تعریف فرایند</span>
                        </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                        className={`menu-item ${getMenuItemActive({processListPath})}`}
                        aria-haspopup="true">
                        <NavLink className="menu-link" to={processListPath}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
                            </span>
                            <span className="menu-text">مدیریت فرایندها</span>
                        </NavLink>
                    </li>
                    {/*end::3 Level*/}
                </ul>
                </div>
            </li>
            {/*end::2 Level*/}



            <li
              className={`menu-item ${getMenuItemActive({usersPath})}`}
              aria-haspopup="true">
              <NavLink className="menu-link" to={usersPath}>
                  <span className="svg-icon menu-icon">
                      <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
                  </span>
                  <span className="menu-text">کاربران</span>
              </NavLink>
          </li>
          {/*end::1 Level*/}
        </ul>

        {/* end::Menu Nav */}
      </>
  );
}
