import * as React from "react";
import {
    RouteComponentProps, withRouter
} from 'react-router-dom';
import './styles.scss';
import NewsService from '../../Service';
import { ISaveHelpCovid, HelpCovidModel } from '../../../../models/models';
import { socket } from '../../../../app';
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../Redux/models";
import { Shimmer3 } from "../../../common/Loading/Shimmers";
import RaiseHelp from './raiseHelp';
import Navbar from "../../Navbar";
interface IState {
    allNews: ISaveHelpCovid[];
    isLoading: boolean;
    currentScrollPosition: number;
    skip: number;
    isLoadNext: boolean;
    DateTime: any;
    stopRequests: boolean;
}

interface IProps extends RouteComponentProps {
    User: IUserState;
}

class Help extends React.Component<IProps, IState> {
    private newsService: NewsService;
    private language: string;
    ddd = localStorage.getItem('language');
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            allNews: [],
            currentScrollPosition: 0,
            skip: 0,
            isLoadNext: false,
            DateTime: null,
            stopRequests: false
        }
        this.newsService = new NewsService();
        this.language = this.ddd ? this.ddd : 'en';
        this._onUserClick = this._onUserClick.bind(this);
        this._onScrollEvent = this._onScrollEvent.bind(this);
    }

    private _onUserClick(id: string) {
        if (id !== null) {
            this.props.history.push(`/user/${id}`);
        }
    }

    private infoBind(filesInfo: ISaveHelpCovid[]) {
        console.log(filesInfo);
        let temp;
        if (filesInfo) {
            temp = filesInfo.map((news: ISaveHelpCovid) => {
                return <div id={news._id}>
                    <div className="main-contai c-style1" key={news._id}>
                        <div className="sp-clearFix help-body" >
                            <p className="sp-no-pm"> <b>{news.name} has asked for </b></p>
                            <p className="sp-no-pm">{news.problem}</p>
                        </div>
                        <hr className="sp-hr" />
                        <p className="sp-no-pm sp-ml10">Contact Details</p>
                        <p className="help-name"><b></b> {news.name}</p>
                        <p className="help-name"><b></b> {news.expect}</p>
                    </div>

                </div>
            });
        } else {
            temp = <p>no records</p>;
        }
        return temp;
    }

    componentWillReceiveProps(newProps: IProps) {
        if (this.language !== newProps.User.language) {
            this.setState({ isLoading: true });
            this.language = newProps.User.language;
            this.newsService.getHelpRequests1({ skip: 0 }).then((res: any) => {
                if (res.status) {
                    let data = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        currentScrollPosition: window.scrollY,
                        skip: data.length,
                        DateTime: res.data.length > 0 ? res.data[0].DateTime : ''
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            });
        }
    }
    componentDidMount() {

        window.scrollTo(0, 0);
        
        this.setState({ isLoading: true });
        this.newsService.getHelpRequests1({ skip: this.state.skip }).then((res: any) => {
            console.log(res);
            debugger;
            if (res.status) {
                let data = res.data;
                this.setState({
                    allNews: data,
                    isLoading: false,
                    currentScrollPosition: window.scrollY,
                    skip: data.length,
                    DateTime: res.data.length > 0 ? res.data[0].DateTime : ''
                });
            } else {
                this.setState({ isLoading: false });
            }
        });

        socket.on("NewsUpdated", (data: any) => {
            debugger;
            if (this.language === 'en') {
                let newsInfo: any = data.English;
                let allNews: ISaveHelpCovid[] = this.state.allNews;
                let tempNews: ISaveHelpCovid[] = [];
                allNews.forEach((news: ISaveHelpCovid) => {
                    if (news._id === newsInfo._id) {
                        if (newsInfo.Show) {
                            tempNews = [...tempNews, new HelpCovidModel(newsInfo)]
                        }
                    } else {
                        tempNews = [...tempNews, news];
                    }
                });
                this.setState({
                    allNews: tempNews
                });
            } else if (this.language === 'te') {
                let newsInfo: any = data.Telugu;
                let allNews: ISaveHelpCovid[] = this.state.allNews;
                let tempNews: ISaveHelpCovid[] = [];
                allNews.forEach((news: ISaveHelpCovid) => {
                    if (news._id === newsInfo._id) {
                        if (newsInfo.Show) {
                            tempNews = [...tempNews, newsInfo]
                        }
                    } else {
                        tempNews = [...tempNews, news];
                    }
                });
                this.setState({
                    allNews: tempNews
                });
            }
        });
    }

    _onScrollEvent() {
        const totalHeight = document.documentElement.scrollHeight;
        if (window.pageYOffset > totalHeight - 1300 && !this.state.isLoading && !this.state.stopRequests) {
            this.setState({
                isLoading: true
            });
            this.newsService.getHelpRequests1({ skip: this.state.skip, filter: { DateTime: this.state.DateTime } }).then((res: any) => {
                if (res.status) {
                    let data: [] = res.data;
                    if (data.length > 0) {
                        let allre: ISaveHelpCovid[] = this.state.allNews;
                        data.forEach((d: any) => {
                            allre = [...allre, d];
                        });
                        if (allre.length > 100) {

                            allre.splice(0, 10);
                        }
                        this.setState((prevState: IState) => {
                            return {
                                allNews: allre,
                                currentScrollPosition: window.scrollY,
                                skip: data.length > 0 ? prevState.skip + data.length : prevState.skip,
                                isLoading: false,
                                DateTime: prevState.DateTime < res.data[0].DateTime ? res.data[0].DateTime : prevState.DateTime
                            }
                        });
                    } else {
                        this.setState({ isLoading: false, stopRequests: true });
                    }
                } else {
                    this.setState({ isLoading: false, stopRequests: true });
                }
            });
        }
    }

    componentDidUpdate() {
        window.addEventListener('scroll', this._onScrollEvent);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this._onScrollEvent, { capture: false });
    }

    render(): JSX.Element {
        return (
            <>
                <Navbar />
                <div className="sp-main-wrapper">
                    <div className="ms-Grid" dir="ltr">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm12 ms-md8 ">
                                <div className="main-container-wrapper">
                                    <RaiseHelp />
                                    {(this.state.allNews && this.infoBind(this.state.allNews))}
                                    {this.state.isLoading && <>
                                        <div className="shimmer-main-w"> <Shimmer3 /> </div>
                                        <div className="shimmer-main-w"> <Shimmer3 /> </div> </>}
                                </div>
                            </div>
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
)(Help));