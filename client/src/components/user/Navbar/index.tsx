import * as React from "react";
import {
    NavLink,
    RouteComponentProps, withRouter
} from 'react-router-dom';
import { AppState } from '../../../Redux/app.store';
import { connect } from "react-redux";
import { DefaultButton, Callout } from 'office-ui-fabric-react';
import RL from './../RL';
import { store } from '../../../app';
import { IUserState } from '../../../Redux/models';
import AuthService from '../../../services/authService/index';
import Actions from '../../../Redux/Actions/actions';
import ReduxService from "../../../Redux/service";

interface IState {
    isProfileClicked: boolean;
    isUser: boolean;
    isLoginDialogEnabled: boolean;
    LoggedInUser: any;
    isLoggoutClik: boolean;
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
        }
        this._onProfileClick = this._onProfileClick.bind(this);
        this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
        this._enableLoginDialog = this._enableLoginDialog.bind(this);
        this._loginCancel = this._loginCancel.bind(this);
        this._logOut = this._logOut.bind(this);
        this._navigateTo = this._navigateTo.bind(this);
        this._onLanguageClick = this._onLanguageClick.bind(this);
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

    private _onLanguageClick() {
        let language = localStorage.getItem('language');
        let lan = language && language === 'te' ? 'en' : 'te';
        localStorage.setItem('language', lan);
        ReduxService.changeLanguage(lan);
        this.props.history.push('/');
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

    public render(): JSX.Element {
        return (
            <>
                <div className="sp-topnav">
                    <div className="sp-nav-container nav-items">
                        <NavLink exact className="home-lin" title="The power of journalist" to="/">
                            {/* {this.props.User.staticConstants.Constants.home} */}
                            <img src={'http://localhost:7777/uploads/static_files/Logo.jpg'} className="sp-logo" />
                        </NavLink>
                        <NavLink exact className="home-link" title="The power of journalist" to="/">
                            {this.props.User.staticConstants.Constants.home}
                        </NavLink>
                        {/* <p className="sp-logotext">{this.props.User.staticConstants.Constants.home}</p> */}
                        {/* <p>sdfdsf</p> */}
                        <div className="sp-topnav-right" >
                            {/* <DefaultButton onClick={this._onLanguageClick} className="sp-btn-login sp-float-left sp-mr10" text={this.props.User.staticConstants.Constants.changeTo} /> */}
                            {(this.state.isUser && this.state.LoggedInUser) && <>
                                <p onClick={this._onProfileClick} className="user-name sp-pointer">{this.state.LoggedInUser.firstName}</p>
                                <img className="profile-pict sp-pointer" src={`http://localhost:7777${this.state.LoggedInUser.imagePath}`} ref={this._menuButtonElement} onClick={this._onProfileClick} />
                            </>
                            }
                            {!this.state.isUser &&
                                <DefaultButton onClick={this._enableLoginDialog} className="sp-btn-login" text={this.props.User.staticConstants.Constants.login} />
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
                                    <p onClick={() => this._navigateTo('/myprofile')}>{this.props.User.staticConstants.Constants.myProfile}</p>
                                    <p onClick={() => this._navigateTo('/dashboard')}>{this.props.User.staticConstants.Constants.dashboard}</p>
                                    <hr />
                                    <p onClick={this._logOut}>{this.props.User.staticConstants.Constants.logout} <i className="ms-Icon ms-Icon--PowerButton" aria-hidden="true"></i></p>
                                </div>
                            </Callout>
                        )}
                    </div>
                </div>
                {this.state.isLoginDialogEnabled && <RL isLoginDialogEnabled={this.state.isLoginDialogEnabled} afterLogin={this._loginCancel} />}
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