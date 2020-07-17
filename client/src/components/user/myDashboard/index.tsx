import * as React from "react";
import './styles.scss';
import { UserType } from '../../../constants/constants';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import CreateNews from './createNews';
import { connect } from "react-redux";
import { AppState } from "../../../Redux/app.store";
import { IUserState } from "../../../Redux/models";
import RequestAccess from "./RequestAccess";
import MyNews from "./myNews";
import MyHelpRequets from "./myHelpRequests";
import Navbar from "../Navbar";

interface IState {
}

interface IProps {
    User: IUserState;
}

class MyDashboard extends React.Component<IProps, IState> {
    
    public render(): JSX.Element {
        return (
            <>
            <Navbar />
            <div className="my-dashboard">
                <div>
                    <Pivot aria-label="Basic Pivot Example" >
                        <PivotItem
                            headerText="Dashboard"
                            headerButtonProps={{
                                'data-order': 1,
                                'data-title': 'My Files Title',
                            }}
                        >
                            <MyNews />
                        </PivotItem>
                        <PivotItem
                            headerText="HelpRequets"
                            headerButtonProps={{
                                'data-order': 1,
                                'data-title': 'My Files Title',
                            }}
                        >
                            <MyHelpRequets />
                        </PivotItem>
                        {(this.props.User.User.userType === UserType.SelfAdmin || this.props.User.User.userType === UserType.Normal) &&
                            <PivotItem headerText="Create News" >
                                {this.props.User.User.userType === UserType.SelfAdmin ?
                                    <CreateNews></CreateNews> : <RequestAccess></RequestAccess>
                                }
                            </PivotItem>
                        }
                    </Pivot>
                </div>
            </div>
       </>
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(MyDashboard);