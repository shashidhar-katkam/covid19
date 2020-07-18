import * as React from "react";
import {
    RouteComponentProps, withRouter
} from 'react-router-dom';
import './styles.scss';
import NewsService from '../../Service';
import {  ISavedStory, StoryModel } from '../../../../models/models';
import { socket } from '../../../../app';
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../Redux/models";
import { Shimmer3 } from "../../../common/Loading/Shimmers";
import { debug } from "console";
import Donations from "../Donations";
import CreateStory from "./CreateStory";
import UserInfo from "../../../common/UserInfo";
import Sources from "../mainNews/Sources";
import Comment from '../../../common/Comment';
import Navbar from "../../Navbar";
const ShowMoreText = require('react-show-more-text');

interface IState {
    allNews: ISavedStory[];
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

class Stories extends React.Component<IProps, IState> {
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

    private generateString(strings: string[]) {
        debugger;
        let dd = "";
        strings.forEach((a: string, index: number) => {
            if (index !== strings.length - 1) {
                dd += a + ' ,';
            } else {
                dd += a + '.'
            }
        });
        return dd;
    }

    private infoBind(filesInfo: ISavedStory[]) {
        console.log(filesInfo);
        let temp;
        if (filesInfo) {
            temp = filesInfo.map((news: ISavedStory) => {
                return <div id={news._id}>
                    <div className="main-contai c-style1" key={news._id}>
                        <UserInfo DateTime={news.DateTime} User={news.User} onUserClick={this._onUserClick} ></UserInfo>

                        <div className="story-details">
                            <p className="sp-no-pm"> <b>Symptoms: </b> </p>
                            <ShowMoreText
                                lines={4}
                                more="read more"
                                less="read less"
                                anchorClass='show-more-link'
                                expanded={false}
                                keepNewLines={true}
                            >
                                {news.Symptoms}
                            </ShowMoreText>
                            <p className="sp-no-pm"> <b>Diseases: </b></p>
                            <ShowMoreText
                                lines={4}
                                more="read more"
                                less="read less"
                                anchorClass='show-more-link'
                                expanded={false}
                                keepNewLines={true}
                            >
                                {this.generateString(news.Diceases)}
                            </ShowMoreText>

                            <p className="sp-no-pm"><b>Treatment:</b></p>
                            <ShowMoreText
                                lines={4}
                                more="read more"
                                less="read less"
                                anchorClass='show-more-link'
                                expanded={false}
                                keepNewLines={true}
                            >
                                {news.Treatment}
                            </ShowMoreText>
                            <p className="sp-no-pm"><b>Suggestions: </b></p>
                            <ShowMoreText
                                lines={4}
                                more="read more"
                                less="read less"
                                anchorClass='show-more-link'
                                expanded={false}
                                keepNewLines={true}
                            >
                                {news.MoreToSay}
                            </ShowMoreText>
                        </div>
                        <div className="sp-clearFix msg-body" >

                            {news.Files.length > 0 && <Sources Sources={news.Files} />}
                        </div>

                        <hr className="sp-hr" />
                        <Comment RefId={news._id} />
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
            this.newsService.getStories({ skip: 0 }).then((res: any) => {
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
        this.newsService.getStories({ skip: 0 }).then((res: any) => {
            debugger;
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
                let allNews: ISavedStory[] = this.state.allNews;
                let tempNews: ISavedStory[] = [];
                allNews.forEach((news: ISavedStory) => {
                    if (news._id === newsInfo._id) {
                        if (newsInfo.Show) {
                            tempNews = [...tempNews, new StoryModel(newsInfo)]
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
                let allNews: ISavedStory[] = this.state.allNews;
                let tempNews: ISavedStory[] = [];
                allNews.forEach((news: ISavedStory) => {
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
            this.newsService.getStories({ skip: this.state.skip, filter: { DateTime: this.state.DateTime } }).then((res: any) => {
                if (res.status) {
                    let data: [] = res.data;
                    if (data.length > 0) {
                        let allre: ISavedStory[] = this.state.allNews;
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
                                    <div className="compose-co c-style1" >
                                        <CreateStory />
                                    </div>
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
)(Stories));