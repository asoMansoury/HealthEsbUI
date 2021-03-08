/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {PrescriptionBarcodeDetailesPath
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
                <span className="menu-text">سازمان غذا و دارو</span>
                <i className="menu-arrow"/>
                </NavLink>
                <div className="menu-submenu ">
                <i className="menu-arrow"/>
                <ul className="menu-subnav">
  

                    {/*begin::3 Level*/}
                    <li
                        className={`menu-item ${getMenuItemActive({PrescriptionBarcodeDetailesPath})}`}
                        aria-haspopup="true">
                        <NavLink className="menu-link" to={PrescriptionBarcodeDetailesPath}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
                            </span>
                            <span className="menu-text">اصالت دارو</span>
                        </NavLink>
                    </li>
                    {/*end::3 Level*/}
                </ul>
                </div>
            </li>
            {/*end::2 Level*/}
        </ul>

        {/* end::Menu Nav */}
      </>
  );
}
