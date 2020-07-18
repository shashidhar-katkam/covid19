import * as React from "react";
import {
  Route,
  Switch
} from 'react-router-dom';
import Home from './home/index';
import './styles.scss';
import PrivateRoute from '../common/PrivateRoute/index';
import MyProfile from './myProfile';
import NotFound from '../common/NotFound';
import Stories from './../user/home/stories';
import Help from './../user/home/help';

class UserApp extends React.Component {

  componentDidMount() {
    let loadingE: any = document.getElementById('loading');
    loadingE.style.display = "none";
  }

  public render(): JSX.Element {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/stories">
          <Stories />
        </PrivateRoute>
        <PrivateRoute path="/myprofile">
          <MyProfile />
        </PrivateRoute>
        <PrivateRoute path="/help">
          <Help />
        </PrivateRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    );
  }
}

export default UserApp;