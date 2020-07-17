import * as React from "react";
import {
    RouteComponentProps, withRouter
} from 'react-router-dom';
import NewsTD from '../../../common/newsTD';
import NewsService from '../../Service';
import { INewsInfoC,  Type } from '../../../../models/models';
import UserInfo from '../../../common/UserInfo';
import Comment from '../../../common/Comment';
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../Redux/models";
import Polls from "../../../common/Polls";
import QA from "../../../common/QA";
import Sources from "../mainNews/Sources";
const ShowMoreText = require('react-show-more-text');

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
    news: INewsInfoC;
}

class Analysis extends React.Component<IProps, IState> {
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
    }

    private _onUserClick(id: string) {
        if (id !== null) {
            this.props.history.push(`/user/${id}`);
        }
    }
    render(): JSX.Element {
        return (
            <div className="main-contai c-style1" key={this.props.news._id}>
                <UserInfo DateTime={this.props.news.DateTime} User={this.props.news.User} onUserClick={this._onUserClick} ></UserInfo>
                <div className="sp-clearFix msg-body" >
                    <NewsTD Title={this.props.news.Title} Description={this.props.news.Description} Source={this.props.news.Source} />
                    {this.props.news.Files.length > 0 && <Sources Sources={this.props.news.Files} />}
                </div>
                <div className="analaysis">
                    {this.props.news.Analysis1 !== null && this.props.news.Analysis1 !== undefined && this.props.news.Analysis1 !== '' &&
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
                                    {this.props.news.Analysis1}
                                </ShowMoreText>
                            </div>
                        </>}
                    {this.props.news.Analysis2 !== null && this.props.news.Analysis2 !== undefined && this.props.news.Analysis2 !== '' &&
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
                                    {this.props.news.Analysis2}
                                </ShowMoreText>
                            </div>
                        </>}
                    {this.props.news.Analysis3 !== null && this.props.news.Analysis3 !== undefined && this.props.news.Analysis3 !== '' &&
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
                                    {this.props.news.Analysis3}
                                </ShowMoreText>
                            </div>
                        </>}

                </div>
                {
                    this.props.news.Type === Type.Comments && <>
                        <hr className="sp-hr" />
                        <Comment RefId={this.language == 'en' ? this.props.news._id : this.props.news.ENRefId} />
                    </>
                }
                {
                    this.props.news.Type === Type.Polls && <>
                        <hr className="sp-hr" />
                        <Polls RefId={this.language == 'en' ? this.props.news._id : this.props.news.ENRefId} />
                    </>
                }
                {
                    this.props.news.Type === Type.Questions && <>
                        <hr className="sp-hr" />
                        <QA RefId={this.language == 'en' ? this.props.news._id : this.props.news.ENRefId} />
                    </>
                }
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default withRouter(connect(
    mapStateToProps,
)(Analysis));