import * as React from "react";
import {
  NavLink,
  Switch, RouteComponentProps, withRouter
} from 'react-router-dom';
import './styles.scss';
import { AppState } from '../../Redux/app.store';
import { connect } from "react-redux";
import { IUserState } from '../../Redux/models';
import PrivateRoute from '../common/PrivateRoute/index';
import HelpSection from './helpSection';
import Registration from "./Registration";
import AllUserNews from "./userSection";
import AdminSection from "./adminSection";
import StaticConsants from '../../constants/staticConstants';
import Navbar from "../user/Navbar/index";
import Secondnavbar from '../user/Navbar/Secondnavbar';

interface IState {
  isProfileClicked: boolean;
  isUser: boolean;
  isLoginDialogEnabled: boolean;
  LoggedInUser: any;
  isLoggoutClik: boolean;
}

interface IProps extends RouteComponentProps {
  User: IUserState;
}

class AdminApp extends React.Component<IProps, IState> {

  public render(): JSX.Element {
    return (
      <>
        <Navbar />
        {/* <Secondnavbar /> */}
        <div className="ms-Grid admin-container" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2 left-navbar">
              {this.props.User && this.props.User.User && this.props.User.User.userType && StaticConsants.getURLsByUserType(this.props.User.User.userType).map((item: any) => {
                if (item) {
                  return <div className="admin-sidenav-item">
                    <NavLink activeClassName="active" to={item.url}>
                      {item.name}
                    </NavLink>
                    {item && item.links && item.links.map((subItem: any) => {
                      return <div className="admin-sidenav-item-1">
                        <NavLink activeClassName="active" to={subItem.url}>
                          {subItem.name}
                        </NavLink>
                        {subItem.links && subItem.links.map((subItem2: any) => {
                          return <div className="admin-sidenav-item-2">
                            <NavLink activeClassName="active" to={subItem2.url}>
                              {subItem2.name}
                            </NavLink>
                          </div>
                        })}
                      </div>
                    })}
                  </div>
                }
              })}
            </div>
            <div className="ms-Grid-col ms-sm10 ms-md10 ms-lg10 right-container">
              <Switch>
                <PrivateRoute path="/admin/users/news/all">
                  <AllUserNews />
                </PrivateRoute>
                <PrivateRoute path="/admin/users/newusers">
                  <Registration />
                </PrivateRoute>
                <PrivateRoute path="/admin/news/all">
                  <AdminSection />
                </PrivateRoute>
                <PrivateRoute path="/admin/users/help/requests">
                  <HelpSection />
                </PrivateRoute>
                {/* <PrivateRoute path="/admin/qa">
                  <QA />
                </PrivateRoute> */}
              </Switch>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState): AppState => ({
  User: state.User,
});

export default withRouter(connect(
  mapStateToProps,
)(AdminApp));