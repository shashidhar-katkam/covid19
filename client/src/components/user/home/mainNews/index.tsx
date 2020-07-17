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
    allNews: INewsInfoC[];
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

class MainNews extends React.Component<IProps, IState> {
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

    private infoBind(filesInfo: INewsInfoC[]) {
        console.log(filesInfo);
        let temp;
        if (filesInfo) {
            temp = filesInfo.map((news: INewsInfoC) => {
                return <div id={news._id}><Analysis news={news} /> </div>
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
            this.newsService.getAllNewsForUser({ skip: 0 }).then((res: any) => {
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
        this.setState({ isLoading: true });
        this.newsService.getAllNewsForUser({ skip: this.state.skip }).then((res: any) => {
            console.log(res);
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
                let allNews: INewsInfoC[] = this.state.allNews;
                let tempNews: INewsInfoC[] = [];
                allNews.forEach((news: INewsInfoC) => {
                    if (news._id === newsInfo._id) {
                        if (newsInfo.Show) {
                            tempNews = [...tempNews, new MainNewsModel(newsInfo)]
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
                let allNews: INewsInfoC[] = this.state.allNews;
                let tempNews: INewsInfoC[] = [];
                allNews.forEach((news: INewsInfoC) => {
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
            this.newsService.getLatestNews({ skip: this.state.skip, filter: { DateTime: this.state.DateTime } }).then((res: any) => {
                if (res.status) {
                    let data: [] = res.data;
                    if (data.length > 0) {
                        let allre: INewsInfoC[] = this.state.allNews;
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
                <div className="main-container-wrapper">
                    <Actions />
                    <Donations />
                    <ImageCarousel />
                    {(this.state.allNews && this.infoBind(this.state.allNews))}
                    {this.state.isLoading && <>
                        <div className="shimmer-main-w"> <Shimmer3 /> </div>
                        <div className="shimmer-main-w"> <Shimmer3 /> </div> </>}
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
)(MainNews));