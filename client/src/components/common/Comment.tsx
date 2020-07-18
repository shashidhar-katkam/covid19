import * as React from "react";
import NewsService from '../user/Service';
import AuthService from "../../services/authService";
import CommentInfo from './CommentPoster';
import { IComment, IDialogPropss } from "../../models/models";
import { connect } from "react-redux";
import { AppState } from "../../Redux/app.store";
import { IUserState } from "../../Redux/models";
import { socket } from '../../app';
import { DialogType, Dialog, DefaultButton } from "office-ui-fabric-react";
import './styles.scss';

interface ICommentForm {
    comment: string;
    commentErr: string;
}

interface IState {
    commentForm: ICommentForm
    showComments: boolean;
    RefId: string;
    isLoggedInUser: boolean;
    skip: number;
    isLoading: boolean;
    comments: IComment[];
    User: IUserState;
    hideMoreCommentsButton: boolean;
    dialogProps: IDialogPropss
}

interface IProps {
    User: IUserState;
    RefId: string;
}

class Comment extends React.Component<IProps, IState> {
    private newsService: NewsService;
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.authService = new AuthService();

        this.state = {
            commentForm: { comment: '', commentErr: '' },
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
        this._showComments = this._showComments.bind(this);
        this._getMoreComments = this._getMoreComments.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
    }

    private _closeDialog() {
        this.setState({
            dialogProps: { show: false, message: '' }
        });
    }
    public _inputChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            commentForm: { ...this.state.commentForm, comment: event.target.value },
        });
    }

    private _showComments() {
        this.setState({
            showComments: !this.state.showComments,
            isLoading: true
        });

        this.newsService.getCommentsByRef(
            { skip: this.state.skip, filter: { RefId: this.state.RefId } })
            .then((res: any) => {
                if (res.status) {
                    let comments: IComment[] = res.data;
                    let allComments: IComment[] = this.state.comments;
                    if (comments.length > 0) {
                        comments.forEach((comment: IComment) => {
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
                this.newsService.postComment(
                    {
                        RefId: this.state.RefId,
                        comment: this.state.commentForm.comment
                    }
                ).then((res) => {
                    if (res.status) {
                        this.setState({
                            commentForm: {
                                ...this.state.commentForm,
                                comment: '',
                                commentErr: ''
                            }
                        });
                    } else if (res.statuscode == 401) {
                        this.setState({
                            dialogProps: { show: true, message: 'Please login to comment.' }
                        });
                        this.authService.LogOut1();
                    }
                });
            } else {
                this.setState({
                    dialogProps: { show: true, message: 'Please login to comment.' }
                });
            }
        }
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({
            isLoggedInUser: this.authService.isLoggedIn(),
            User: newProps.User
        });
    }

    _getMoreComments() {
        this.setState({
            isLoading: true
        });

        this.newsService.getCommentsByRef(
            { skip: this.state.skip, filter: { RefId: this.state.RefId } })
            .then((res: any) => {
                if (res.status) {
                    let comments: IComment[] = res.data;
                    let allComments: IComment[] = this.state.comments;
                    if (comments.length > 0) {
                        comments.forEach((comment: IComment) => {
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
                    this.setState({
                        isLoading: false
                    });
                }
            });
    }

    componentDidMount() {
        socket.on(`Comments_${this.state.RefId}`, (data: any) => {
            if (data && (data.RefId === this.state.RefId)) {
                let ddd: IComment[] = this.state.comments;
                ddd.unshift({ CommetPoster: data.CommetPoster, Comment: data.Comment, _id: '', DateTime: data.DateTime });
                this.setState({
                    comments: ddd,
                    skip: this.state.skip + 1,
                    hideMoreCommentsButton: this.state.hideMoreCommentsButton
                });
            }
        });
    }

    render(): JSX.Element {
        return (
            <div className="comments-container">
                <div className="sp-m10 button-div">
                    <p className="sp-float-right comment-p" onClick={this._showComments}>
                        Comments
                    </p>
                </div>
                {this.state.showComments && <>
                    <div className="ms-Grid comment-info2" dir="ltr">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col sp-1 profile-pic2-c">
                                <img className="profile-pic2 sp-pointer" src={`${this.state.User.User ? this.state.User.User.imagePath : '/uploads/static_files/avatar_2x.png'}`} alt="dd" />
                            </div>
                            <div className="ms-Grid-col sp-9 comment-details">
                                <input
                                    className="comment-in"
                                    value={this.state.commentForm.comment}
                                    placeholder="Write a comment."
                                    name="Title"
                                    onKeyDown={this._onKeyDown}
                                    onChange={(event: any) => this._inputChangeHandle(event)}
                                />
                            </div>
                        </div>
                    </div>
                    {this.state.comments.length > 0 ?
                        <div className="all-comments">
                            {this.state.comments.map((info: IComment) => {
                                return <CommentInfo User={info.CommetPoster} Comment={info.Comment} DateTime={info.DateTime} key={info._id} />
                            })}
                            {!this.state.hideMoreCommentsButton &&
                                <p className="view-more" onClick={this._getMoreComments}>View more comments.</p>}
                        </div> :
                        <>
                            {!this.state.isLoading && <p className="sp-ml10 view-more">Be the first one to comment.</p>}
                        </>
                    }
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
)(Comment);