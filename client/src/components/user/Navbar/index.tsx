import * as React from "react";
import {
    NavLink,
    RouteComponentProps, withRouter
} from 'react-router-dom';
import { AppState } from '../../../Redux/app.store';
import { connect } from "react-redux";
import { DefaultButton, Callout, Dialog, DialogType } from 'office-ui-fabric-react';
import RL from './../RL';
import { store } from '../../../app';
import { IUserState } from '../../../Redux/models';
import AuthService from '../../../services/authService/index';
import Actions from '../../../Redux/Actions/actions';
import ReduxService from "../../../Redux/service";
import { IDialogPropss } from "../../../models/models";

interface IState {
    isProfileClicked: boolean;
    isUser: boolean;
    isLoginDialogEnabled: boolean;
    LoggedInUser: any;
    isLoggoutClik: boolean;
    DialogProps: IDialogPropss;
}

interface IProps extends RouteComponentProps {
    User: IUserState;
    afterLanguageChange?: () => void;
}

class Navbar extends React.Component<IProps, IState> {
    private _menuButtonElement = React.createRef<HTMLImageElement>();
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);

        this.authService = new AuthService();
        var language = localStorage.getItem('language');
        if (language === undefined || language === null) {
            localStorage.setItem('language', 'en');
        }

        this.state = {
            isProfileClicked: false,
            isUser: (this.authService.isLogged() ? true : false),
            isLoginDialogEnabled: false,
            LoggedInUser: this.authService.isLoggedIn(),
            isLoggoutClik: false,
            DialogProps: { show: false, message: '' }
        }
        this._onProfileClick = this._onProfileClick.bind(this);
        this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
        this._enableLoginDialog = this._enableLoginDialog.bind(this);
        this._loginCancel = this._loginCancel.bind(this);
        this._logOut = this._logOut.bind(this);
        this._onPathClick = this._onPathClick.bind(this);
        this._navigateTo = this._navigateTo.bind(this);
        this._closeAlertDialog = this._closeAlertDialog.bind(this);
        store.dispatch(Actions.addUser(this.authService.isLoggedIn()));

    }

    _loginCancel() {
        this.setState({
            isLoginDialogEnabled: false
        });
    }

    _onProfileClick() {
        this.setState({
            isProfileClicked: true
        });
    }

    _onCalloutDismiss() {
        this.setState({
            isProfileClicked: false
        });
    }

    private _enableLoginDialog() {
        this.setState({
            isLoginDialogEnabled: true
        });
    }


    public _navigateTo(navigateTo: string) {
        this.props.history.push(navigateTo);
    }

    public _logOut() {
        this.setState({
            isLoggoutClik: true
        });
        this.authService.LogOut();
    }

    UNSAFE_componentWillReceiveProps(newProps: IProps) {
        let isProfileClicked = false;
        let isLogoutClick = false;
        if (this.state.isLoggoutClik && newProps.User.User === null) {
            isProfileClicked = false;
            isLogoutClick = false;
        }
        this.setState({
            isLoginDialogEnabled: false,
            isUser: ((newProps.User.User && (newProps.User.User.firstName !== '')) ? true : false),
            LoggedInUser: ((newProps.User.User && (newProps.User.User.firstName !== '')) ? newProps.User.User : null),
            isProfileClicked: isProfileClicked,
            isLoggoutClik: isLogoutClick
        });
    }


    private _onPathClick(path: string) {
        if (this.state.isUser) {
            this.props.history.push(path);
        } else {
            this.setState({
                DialogProps: { show: true, message: "Please login" }
            });
        }
    }

    private _closeAlertDialog() {
        this.setState({
            DialogProps: { show: false, message: '' },
        });

    }
    public render(): JSX.Element {
        return (
            <>
                <div className="sp-topnav">
                    <div className="sp-nav-container nav-items">
                        <NavLink exact className="home-lin" to="/">
                            <img src={'http://localhost:7777/uploads/static_files/logo_new.png'} className="sp-logo" />
                        </NavLink>
                        <NavLink exact className="home-link" to="/">
                            Share_care
                        </NavLink>
                        <div className="nav-items1">
                            <span onClick={() => { this._onPathClick('/stories') }}>
                                Stories
                        </span>
                            <span onClick={() => { this._onPathClick('/help') }}>
                                Help
                            </span>
                            <span onClick={() => { this._onPathClick('/corona') }}>
                                All about corona
                            </span>
                        </div>
                        <div className="sp-topnav-right" >
                            {(this.state.isUser && this.state.LoggedInUser) && <>
                                <p onClick={this._onProfileClick} className="user-name sp-pointer">{this.state.LoggedInUser.firstName}</p>
                                <img className="profile-pict sp-pointer" src={`http://localhost:7777${this.state.LoggedInUser.imagePath}`} ref={this._menuButtonElement} onClick={this._onProfileClick} />
                            </>
                            }
                            {!this.state.isUser &&
                                <DefaultButton onClick={this._enableLoginDialog} className="sp-btn-login" text="Login" />
                            }
                        </div>
                        {this.state.isProfileClicked && (
                            <Callout
                                role="alertdialog"
                                gapSpace={0}
                                target={this._menuButtonElement.current}
                                onDismiss={this._onCalloutDismiss}
                                directionalHint={6}
                                setInitialFocus={true}
                                isBeakVisible={false}
                            >
                                <div className="user-actions">
                                    <p onClick={() => this._navigateTo('/myprofile')}>My profile</p>
                                    <hr />
                                    <p onClick={this._logOut}>Log out <i className="ms-Icon ms-Icon--PowerButton" aria-hidden="true"></i></p>
                                </div>
                            </Callout>
                        )}
                    </div>
                </div>
                {this.state.isLoginDialogEnabled && <RL isLoginDialogEnabled={this.state.isLoginDialogEnabled} afterLogin={this._loginCancel} />}

                <Dialog
                    hidden={!this.state.DialogProps.show}
                    onDismiss={this._closeAlertDialog}
                    dialogContentProps={{
                        type: DialogType.normal,

                    }}
                    modalProps={{
                        styles: { main: { maxWidth: 450, textAlign: "center" } },
                        isBlocking: true
                    }}
                >
                    <p>{this.state.DialogProps.message}</p>
                    <DefaultButton className="sp-btn-login" onClick={this._closeAlertDialog} text="Ok" />
                </Dialog>
            </>
        );

    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default withRouter(connect(
    mapStateToProps,
)(Navbar));