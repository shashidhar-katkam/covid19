import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import NewsService from '../user/Service';
import './styles.scss';
import AuthService from "../../services/authService";
import CommentInfo from './CommentPoster';
import { connect } from "react-redux";
import { AppState } from "../../Redux/app.store";
import { IUserState } from "../../Redux/models";
import { socket } from '../../app';
import { IUserC, IDialogPropss } from "../../models/models";
import { Dialog, DialogType, DefaultButton } from "office-ui-fabric-react";
import Shimmer1, { Shimmer2 } from "./Loading/Shimmers";

interface IAnswer {
    Answer: string;
    AnsweredBy: IUserC;

}

interface IQA {
    _id: string;
    QAskedBy: IUserC;
    Question: string;
    DateTime: string;
    Answers: IAnswer;

}


interface IState {

    comment: string;
    commentErr: string;
    showComments: boolean;
    RefId: string;
    isLoggedInUser: boolean;
    skip: number;
    isLoading: boolean;
    comments: IQA[];
    User: IUserState;
    hideMoreCommentsButton: boolean;
    dialogProps: IDialogPropss
}

interface IProps {
    User: IUserState;
    //isLoggedInUser: boolean;
    RefId: string;
}

class QA extends React.Component<IProps, IState> {
    private newsService: NewsService;

    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.authService = new AuthService();

        this.state = {
            comment: '',
            commentErr: '',
            showComments: false,
            RefId: this.props.RefId,
            isLoggedInUser: this.authService.isLoggedIn(),
            skip: 0,
            comments: [],
            isLoading: false,
            User: this.props.User,
            hideMoreCommentsButton: false,
            dialogProps: { show: false, message: '' }

        }

        this.newsService = new NewsService();
        this._inputChangeHandle = this._inputChangeHandle.bind(this);
        this.showComments = this.showComments.bind(this);
        this.getMoreComments = this.getMoreComments.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
    }

    public _inputChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            comment: event.target.value,
        });
    }

    private showComments() {
        this.setState({
            showComments: !this.state.showComments,
            isLoading: true
        });

        this.newsService.getQAsByRefId(
            { skip: this.state.skip, filter: { RefId: this.state.RefId } })
            .then((res: any) => {
                if (res.status) {
                    let comments: IQA[] = res.data;
                    let allComments: IQA[] = this.state.comments;
                    if (comments.length > 0) {
                        comments.forEach((comment: IQA) => {
                            allComments = [...allComments, comment];
                        });
                        this.setState({
                            comments: allComments,
                            skip: this.state.skip + comments.length,
                            hideMoreCommentsButton: comments.length < 10 ? true : false,
                            isLoading: false
                        });
                    } else {
                        this.setState({ isLoading: false });
                    }
                }
                else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
    }

    private _onKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (event.keyCode === 13) {
            if (this.state.User.User) {
                this.newsService.saveQuestion({ RefId: this.state.RefId, Question: this.state.comment }).then((res) => {
                    if (res.status) {
                        this.setState({
                            comment: '',
                        });
                    }
                    else if (res.statuscode == 401) {
                        this.setState({
                            dialogProps: { show: true, message: 'Please login to ask question.' }
                        });
                    }
                });
            }
            else {
                this.setState({
                    dialogProps: { show: true, message: 'Please login to ask question.' }
                });

                this.authService.LogOut1();
            }
        }
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({
            isLoggedInUser: this.authService.isLoggedIn(),
            User: newProps.User
        });
    }

    getMoreComments() {
        this.setState({
            isLoading: true
        });

        this.newsService.getQAsByRefId(
            { skip: this.state.skip, filter: { RefId: this.state.RefId } })
            .then((res: any) => {
                if (res.status) {
                    let comments: IQA[] = res.data;
                    let allComments: IQA[] = this.state.comments;
                    if (comments.length > 0) {
                        comments.forEach((comment: IQA) => {
                            allComments = [...allComments, comment];
                        })
                        this.setState({
                            comments: allComments,
                            skip: this.state.skip + comments.length,
                            hideMoreCommentsButton: comments.length < 10 ? true : false,
                            isLoading: false
                        });
                    }
                    else {
                        this.setState({
                            isLoading: false,
                            hideMoreCommentsButton: true
                        });
                    }
                } else {
                    this.setState({ isLoading: false })
                }
            })
    }
    private _closeDialog() {
        this.setState({
            dialogProps: { show: false, message: '' }
        });
    }

    componentDidMount() {
        socket.on(`Questions_${this.state.RefId}`, (data: any) => {
            if (data && (data.RefId === this.state.RefId)) {
                let ddd: IQA[] = this.state.comments;
                ddd.unshift({ QAskedBy: data.QAskedBy, Question: data.Question, Answers: data.Answers, _id: '', DateTime: data.DateTime });
                this.setState({
                    comments: ddd,
                    skip: this.state.skip + 1
                });
            }
        });
    }

    public render(): JSX.Element {
        return (
            <div className="comments-container">

                <div className="sp-m10 button-div">
                    <p className="sp-float-right comment-p" onClick={this.showComments}>
                        {this.props.User.staticConstants.Constants.questions}
                    </p>
                </div>
                {this.state.showComments && <>
                    {/* {this.state.isLoggedInUser ?
                        <> */}
                    <div className="ms-Grid comment-info2" dir="ltr">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col sp-1 profile-pic2-c">
                                <img className="profile-pic2 sp-pointer" src={`http://localhost:7777${this.state.User.User ? this.state.User.User.imagePath : '/uploads/static_files/avatar_2x.png'}`} alt="dd" />
                            </div>
                            <div className="ms-Grid-col sp-9 comment-details">
                                <input
                                    className="comment-in"
                                    value={this.state.comment}
                                    placeholder={this.props.User.staticConstants.Constants.askQuestion}
                                    name="Title"
                                    onKeyDown={this._onKeyDown}
                                    onChange={(event: any) => this._inputChangeHandle(event)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* </>

                        :
                        <div className="login-warning-c">
                            <span className="login-warning sp-danger">{this.props.User.staticConstants.Constants.pleaseLoginToAskQuestion}</span>
                        </div>
                    } */}

                    {this.state.comments.length > 0 ?
                        <div className="all-comments">
                            {this.state.comments.map((info: IQA) => {
                                return <CommentInfo User={info.QAskedBy} Comment={info.Question} DateTime={info.DateTime} />
                            })}
                            {!this.state.hideMoreCommentsButton &&
                                <p className="view-more" onClick={this.getMoreComments}>{this.props.User.staticConstants.Constants.viewMoreQuestions}</p>}
                        </div> :
                        <div>
                            {!this.state.isLoading && <p className="view-more sp-ml10">{this.props.User.staticConstants.Constants.beFirstOneToAskQuestion}</p>}
                        </div>
                    }
                    {/* {this.state.isLoading && <> <Shimmer1 />  <br /><Shimmer1 /> </>} */}
                </>

                }
                <Dialog
                    hidden={!this.state.dialogProps.show}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,

                    }}
                    modalProps={{
                        styles: { main: { maxWidth: 450, textAlign: "center" } },
                        isBlocking: true
                    }}
                >
                    <p>{this.state.dialogProps.message}</p>
                    <DefaultButton className="sp-btn-login" onClick={this._closeDialog} text="Ok" />
                </Dialog>


            </div>
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(QA);