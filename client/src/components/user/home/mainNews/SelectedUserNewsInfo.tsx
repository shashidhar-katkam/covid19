import * as React from "react";
import Sources from '../../../common/Templates/Sources';
import { INewsInfoC, MainNewsModel, Type } from '../../../../models/models';
import { match, withRouter } from "react-router-dom";
import Profile from './Profile';
import NewsService from '../../Service';
import './styles.scss';
import NewsTD from "../../../common/newsTD";
import Comment from '../../../common/Comment';
import { socket } from "../../../../app";
import Navbar from "../../Navbar";
import Secondnavbar from '../../Navbar/Secondnavbar';
import Polls from "../../../common/Polls";
import QA from "../../../common/QA";
import { connect } from "react-redux";
import { AppState } from "../../../../Redux/app.store";
import { IUserState } from "../../../../Redux/models";
const ShowMoreText = require('react-show-more-text');
interface IState {
    routeId: string;
    isLoading: boolean;
    allNews: INewsInfoC[];
    currentScrollPosition: number;
    skip: number;
    isLoadNext: boolean;
    previousNews: INewsInfoC[];
    stopRequests: boolean;
}

interface IDetailParams {
    id: string;
}
interface IProps {
    match?: match<IDetailParams>;
    User: IUserState;
}

class SelectedUserNewsInfo extends React.Component<IProps, IState> {
    private service: NewsService;
    private language: string;
    ddd = localStorage.getItem('language');
    constructor(props: IProps) {
        super(props);
        let routeInfo: any = this.props.match;
        this.state = {
            routeId: routeInfo.params.id,
            isLoading: false,
            allNews: [],
            currentScrollPosition: 0,
            skip: 0,
            isLoadNext: false,
            previousNews: [],
            stopRequests: false

        }
        this.language = this.ddd ? this.ddd : 'en';
        this.service = new NewsService();
        this._onScrollEvent = this._onScrollEvent.bind(this);
    }


    componentDidMount() {
        this.setState({
            isLoading: true
        });
        this.service.getNewsbyUserId({ id: this.state.routeId, skip: this.state.skip }).then((res: any) => {
            if (res && res.status && res.data) {
                this.setState({
                    allNews: res.data,
                    isLoading: false,
                    currentScrollPosition: window.scrollY,
                    skip: res.data.length
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });

        socket.on("NewsUpdated", (data: any) => {
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
        if (window.pageYOffset > totalHeight - 1300 && !this.state.isLoadNext && !this.state.stopRequests) {
            this.setState({
                isLoadNext: true
            });

            this.service.getNewsbyUserId({ _id: this.state.routeId, skip: this.state.skip }).then((res: any) => {
                let allre: any[] = this.state.allNews;

                if (res && res.status && res.data) {
                    let data: [] = res.data;
                    data.forEach((d: any) => {
                        allre = [...allre, d];
                    });
                    if (allre.length > 100) {

                        allre.splice(0, 10);
                    }
                    this.setState({
                        allNews: allre,
                        currentScrollPosition: window.scrollY,
                        skip: this.state.skip + res.data.length,
                        isLoadNext: false,
                        stopRequests: true
                    });
                } else {
                    this.setState({
                        isLoadNext: false,
                        stopRequests: true
                    });
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

    private infoBind(filesInfo: INewsInfoC[]) {
        let temp;
        if (filesInfo) {
            temp = filesInfo.map((news: INewsInfoC) => {
                return <div className="main-contai c-style1 sp-pt10" key={news._id}>
                    <div className="sp-clearFix msg-body" >
                        <NewsTD Title={news.Title} Description={news.Description} Source={news.Source} />
                        {news.Files.length > 0 && <Sources Sources={news.Files} />}
                    </div>
                    <div className="analaysis">
                        {news.Analysis1 !== null && news.Analysis1 !== undefined && news.Analysis1 !== '' &&
                            <>
                                <p className="an-heading">{this.props.User.staticConstants.Constants.analysis1}:</p>
                                <div className="an-text">
                                    <ShowMoreText
                                        lines={1}
                                        more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                        anchorClass='show-more-link'
                                        expanded={false}
                                        keepNewLines={true}
                                    >
                                        {news.Analysis1}
                                    </ShowMoreText>
                                </div>
                            </>}
                        {news.Analysis2 !== null && news.Analysis2 !== undefined && news.Analysis2 !== '' &&
                            <>
                                <p className="an-heading">{this.props.User.staticConstants.Constants.analysis2}:</p>
                                <div className="an-text">
                                    <ShowMoreText
                                        lines={1}
                                        more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                        anchorClass='show-more-link'
                                        expanded={false}
                                        keepNewLines={true}
                                    >
                                        {news.Analysis2}
                                    </ShowMoreText>
                                </div>
                            </>}
                        {news.Analysis3 !== null && news.Analysis3 !== undefined && news.Analysis3 !== '' &&
                            <>
                                <p className="an-heading">{this.props.User.staticConstants.Constants.analysis3}:</p>
                                <div className="an-text">
                                    <ShowMoreText
                                        lines={1}
                                        more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                        anchorClass='show-more-link'
                                        expanded={false}
                                        keepNewLines={true}
                                    >
                                        {news.Analysis3}
                                    </ShowMoreText>
                                </div>
                            </>}
                    </div>

                    {
                        news.Type === Type.Comments && <>
                            <hr className="sp-hr" />
                            <Comment RefId={this.language == 'en' ? news._id : news.ENRefId} />
                        </>
                    }
                    {
                        news.Type === Type.Polls && <>
                            <hr className="sp-hr" />
                            <Polls RefId={this.language == 'en' ? news._id : news.ENRefId} />
                        </>
                    }
                    {
                        news.Type === Type.Questions && <>
                            <hr className="sp-hr" />
                            <QA RefId={this.language == 'en' ? news._id : news.ENRefId} />
                        </>
                    }
                </div>
            });
        } else {
            temp = <p>no records</p>;
        }
        return temp;
    }

    render(): JSX.Element {
        return (
            <>
                <Navbar />
                {/* <Secondnavbar /> */}
                <div className="sp-container main-container " >
                    <div className="ms-Grid" dir="ltr">
                        <div className="ms-Grid-row selectedUserInfo" >
                            <div className="ms-Grid-col ms-sm12 ms-md4 ms-lg4-5 p-section" >
                                <div style={{ width: '100%', alignContent: 'center' }}>
                                    {this.state.routeId &&
                                        <Profile userId={this.state.routeId} />}
                                </div>
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md8 ms-lg7-5" >
                                <div className="main-container-wrapper">
                                    {this.state.allNews && this.state.allNews.length > 0 &&
                                        this.infoBind(this.state.allNews)
                                    }
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
)(SelectedUserNewsInfo));