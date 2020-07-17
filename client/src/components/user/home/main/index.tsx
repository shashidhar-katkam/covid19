import * as React from "react";
import {
    RouteComponentProps, withRouter
} from 'react-router-dom';
import './styles.scss';
import NewsService from '../../Service';
import { INewsInfoC, MainNewsModel } from '../../../../models/models';
import Actions from "../compose";
import { socket } from '../../../../app';
import ImageCarousel from "../templates/ImageCarousel";
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../Redux/models";
import { Shimmer3 } from "../../../common/Loading/Shimmers";
import Analysis from "../templates/Analysis";
import { debug } from "console";
import Donations from "../Donations";

interface IState {

}

interface IProps extends RouteComponentProps {
    User: IUserState;
}

class Main extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {

        }
        this.newsService = new NewsService();

    }


    render(): JSX.Element {
        return (
            <>
                <div className="main-container-wrapper">

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
)(Main));