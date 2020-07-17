import * as React from "react";
import {
  Route,
  Switch} from 'react-router-dom';
import Home from './home/index';
import './styles.scss';
import PrivateRoute from '../common/PrivateRoute/index';
import AdminApp from '../admin/index';
import NewsInfo from "./newsComponent";
import SelectedUserNewsInfo from './home/mainNews/SelectedUserNewsInfo';
import MyProfile from './myProfile';
import NotFound from '../common/NotFound';
import MyDashboard from "./myDashboard";
import CatIndex from "./home/CatIndex";
import PrivacyC from "./Privacy/Privacy";
import TermsAndConditions from "./Privacy/Terms";
import AboutUs from "./Privacy/AboutUs/index";
import ContactUs from "./Privacy/ContactUs";


class UserApp extends React.Component {

  componentDidMount() {
    let loadingE: any = document.getElementById('loading');
    loadingE.style.display = "none";
  }

  public render(): JSX.Element {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/newsi/:id" component={NewsInfo} />
        <Route path="/cat/:filter" component={CatIndex} />
        <Route path="/user/:id" component={SelectedUserNewsInfo} />
        <Route path="/privacy" component={PrivacyC} />
        <Route path="/terms" component={TermsAndConditions} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/contact-us" component={ContactUs} />
        <PrivateRoute path="/dashboard">
          <MyDashboard />
        </PrivateRoute>
        <PrivateRoute path="/myprofile">
          <MyProfile />
        </PrivateRoute>
        <PrivateRoute path="/admin">
          <AdminApp />
        </PrivateRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    );
  }
}

export default UserApp;