import React, {Suspense, lazy} from "react";
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

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/products/Categories"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path={PrescriptionBarcodeDetailesPath} component={PrescriptionBarcodeDetailes}></ContentRoute>
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
            </Switch>
        </Suspense>
    );
}
