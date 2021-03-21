import React, {Suspense, lazy,useEffect} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import {DashboardPage} from "./pages/DashboardPage";
import {CategoryPage} from "./pages/Category/CategoryPage";
import {categoryPath
  ,usersPath
  ,processPath
  ,processEditPath
  ,processListPath
  ,ProcessPDFPath
  ,PrescriptionBarcodeDetailesPath
} from './pages/commonConstants/RouteConstant';
import UsersPage from './pages/Users/UsersPage';
import ProcessAdd from './pages/ProcessPage/ProcessAdd';
import ProcessPageList from './pages/ProcessPage/ProcessPageList';
import ProcessEdit from './pages/ProcessPage/ProcessPageEdit';
import ProcessPDF from './pages/ProcessPage/Components/ProcessPDF';
import PrescriptionBarcodeDetailes from './pages/Prescription/PrescriptionBarcodeDetailes';
import {spring, AnimatedSwitch } from 'react-router-transition';
const testLaze = React.lazy(()=>import('./pages/Prescription/PrescriptionBarcodeDetailes'));
const TouralProcesPage = lazy(()=>
  import("./modules/TouralPages/TouralProcessPage")
)
const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  useEffect(()=>{
    document.getElementsByClassName('container')[0].style.margin = 0;
    document.getElementsByClassName('container')[0].style.width = '100%';
    document.getElementsByClassName('container')[0].style.paddingLeft = 0;
    document.getElementsByClassName('container')[0].style.maxWidth = '1850px';
  },[]);
  // we need to map the `scale` prop we define below
    // to the transform style property
    function mapStyles(styles) {
      return {
        opacity: styles.opacity,
        transform: `scale(${styles.scale})`,
      };
    }

// wrap the `spring` helper to use a bouncy config
      function bounce(val) {
        return spring(val, {
          stiffness: 330,
          damping: 22,
        });
      }

// child matches will...
    const bounceTransition = {
      // start in a transparent, upscaled state
      atEnter: {
        opacity: 0,
        scale: 1.2,
      },
      // leave in a transparent, downscaled state
      atLeave: {
        opacity: bounce(0),
        scale: bounce(0.8),
      },
      // and rest at an opaque, normally-scaled state
      atActive: {
        opacity: bounce(1),
        scale: bounce(1),
      },
    };

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
              <AnimatedSwitch
                  atEnter={bounceTransition.atEnter}
                  atLeave={bounceTransition.atLeave}
                  atActive={bounceTransition.atActive}
                  mapStyles={mapStyles}
                  className="route-wrapper"
                >
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/products/Categories"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path={PrescriptionBarcodeDetailesPath} component={PrescriptionBarcodeDetailes}></ContentRoute>
                {/* <ContentRoute path={PrescriptionBarcodeDetailesPath} render={()=>
                  <Suspense fallback={<p>...loading</p>}>
                    <testLaze></testLaze>
                  </Suspense>
                }></ContentRoute> */}
                <ContentRoute path={categoryPath} component={CategoryPage} />
                <ContentRoute path={usersPath} component={UsersPage}></ContentRoute>

                <ContentRoute path={processPath} component={ProcessAdd}></ContentRoute>
                <ContentRoute path={processListPath} component={ProcessPageList}></ContentRoute>
                <ContentRoute path={processEditPath} component={ProcessEdit}></ContentRoute>
                <ContentRoute path={ProcessPDFPath} component={ProcessPDF}></ContentRoute>
      
                
                <Route path="/google-material" component={GoogleMaterialPage}/>
                <Route path="/react-bootstrap" component={ReactBootstrapPage}/>
                <Route path="/e-commerce" component={ECommercePage}/>
                <Redirect to="error/error-v1"/>
            </AnimatedSwitch>
        </Suspense>
    );
}
