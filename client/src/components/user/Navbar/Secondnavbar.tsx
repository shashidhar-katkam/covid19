import * as React from "react";
import {
    NavLink,
    RouteComponentProps, withRouter
} from 'react-router-dom';
import { AppState } from '../../../Redux/app.store';
import { connect } from "react-redux";
import { store } from '../../../app';
import { IUserState } from '../../../Redux/models';
import AuthService from '../../../services/authService/index';
import Actions from '../../../Redux/Actions/actions';
import { UserType } from '../../../constants/constants';

interface IState {
    isUser: boolean;
    LoggedInUser: any;
    lastScrollTop: number;
    navbarShowOnScroll: boolean;
}

interface IProps extends RouteComponentProps {
    User: IUserState;
}

class Secondnavbar extends React.Component<IProps, IState> {
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.authService = new AuthService();
        this.state = {
            isUser: (this.authService.isLogged() ? true : false),
            LoggedInUser: this.authService.isLoggedIn(),
            lastScrollTop: 0,
            navbarShowOnScroll: false
        }
        this._onScrollEvent = this._onScrollEvent.bind(this);
    }


    UNSAFE_componentWillReceiveProps(newProps: IProps) {
        this.setState({
            isUser: ((newProps.User.User && (newProps.User.User.firstName !== '')) ? true : false),
            LoggedInUser: ((newProps.User.User && (newProps.User.User.firstName !== '')) ? newProps.User.User : null),
        });
    }

    componentDidMount() {
        window.addEventListener('scroll', this._onScrollEvent);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this._onScrollEvent, { capture: false });
    }

    _onScrollEvent() {
        var lastScrollTop = this.state.lastScrollTop;
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
            if (this.state.navbarShowOnScroll) {
                this.setState({
                    navbarShowOnScroll: false
                });
            }
        } else {
            if (!this.state.navbarShowOnScroll) {
                this.setState({
                    navbarShowOnScroll: true
                });
            }
        }
        lastScrollTop = st <= 0 ? 0 : st;
        this.setState({
            lastScrollTop: lastScrollTop
        });
    }


    getNavItems() {
        return <>
            <NavLink activeClassName="active" to="/cat/news">
                {this.props.User.staticConstants.Constants.news}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/telangana">
                {this.props.User.staticConstants.Constants.telangana}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/india">
                {this.props.User.staticConstants.Constants.india}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/polls">
                {this.props.User.staticConstants.Constants.polls}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/curruption">
                {this.props.User.staticConstants.Constants.curruption}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/info">
                {this.props.User.staticConstants.Constants.info}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/article">
                {this.props.User.staticConstants.Constants.article}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/movie">
                {this.props.User.staticConstants.Constants.movie}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/sports">
                {this.props.User.staticConstants.Constants.sports}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/business">
                {this.props.User.staticConstants.Constants.business}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/trending">
                {this.props.User.staticConstants.Constants.trending}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/mustwatch">
                {this.props.User.staticConstants.Constants.mustwatch}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/timepass">
                {this.props.User.staticConstants.Constants.timepass}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/crime">
                {this.props.User.staticConstants.Constants.crime}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/jobs">
                {this.props.User.staticConstants.Constants.jobs}
            </NavLink>
            <NavLink activeClassName="active" to="/cat/corona">
                {this.props.User.staticConstants.Constants.corona}
            </NavLink>
            <NavLink activeClassName="active" to="/about-us">
                {this.props.User.staticConstants.Constants.aboutUs}
            </NavLink>

            {(this.state.isUser && this.state.LoggedInUser && this.state.LoggedInUser.userType && (this.state.LoggedInUser.userType === UserType.Admin || this.state.LoggedInUser.userType === UserType.SuperAdmin)) &&
                <NavLink activeClassName="active" to="/admin">
                    {this.props.User.staticConstants.Constants.admin}
                </NavLink>
            }
        </>;
    }
    public render(): JSX.Element {
        return (
            <>
                <div className={`second-nav1-w ms-hiddenSm `}>
                    <div className="sp-container">
                        <div className={`second-nav1`} >
                            {this.getNavItems()}
                        </div>
                    </div>
                </div>
                <div className={`second-nav ms-hiddenMdUp  ${this.state.navbarShowOnScroll ? 'shownavbar' : ''}`} >
                    {this.getNavItems()}
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
)(Secondnavbar));