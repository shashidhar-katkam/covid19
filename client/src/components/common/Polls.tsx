import * as React from "react";
import NewsService from '../user/Service';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import AuthService from "../../services/authService";
import { connect } from "react-redux";
import { AppState } from "../../Redux/app.store";
import { IUserState } from "../../Redux/models";
import { socket } from '../../app';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import './styles.scss';
import ProgressBar from "react-bootstrap/ProgressBar";
import { FacepileBase } from "office-ui-fabric-react";
import Shimmer1 from "./Loading/Shimmers";

interface IPollInfo {
    text: string;
    isPolled: boolean;
    pollCount: number;
    poll: number
}

interface IPoll {
    Option1: string;
    Option2: string;
    Option3: string;
    Option4: string;
    Option1Poll: number;
    Option2Poll: number;
    Option3Poll: number;
    Option4Poll: number;

}

interface IState {

    comment: string;
    commentErr: string;
    showPolls: boolean;
    RefId: string;
    isLoggedInUser: boolean;
    skip: number;
    isLoading: boolean;
    User: IUserState;
    Polls: any;
    PollResults: IPoll;
    isPollAnswered: boolean;
    showWarning: boolean;
    warningmsg: string;
    PollOptions: IChoiceGroupOption[];
    PollOptions1: IPollInfo[];
    PollsInfo: any;
    totalPollsCount: number;

}

interface IProps {
    User: IUserState;
    //isLoggedInUser: boolean;
    RefId: string;
}

class Polls extends React.Component<IProps, IState> {
    private newsService: NewsService;

    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.authService = new AuthService();

        this.state = {
            comment: '',
            commentErr: '',
            showPolls: false,
            RefId: this.props.RefId,
            isLoggedInUser: this.authService.isLoggedIn(),
            skip: 0,
            isLoading: false,
            User: this.props.User,
            Polls: null,
            PollResults: {
                Option1: '', Option2: '', Option3: '', Option4: '',
                Option1Poll: 0, Option2Poll: 0, Option3Poll: 0, Option4Poll: 0
            },
            isPollAnswered: false,
            showWarning: false,
            warningmsg: '',
            PollOptions: [],
            PollOptions1: [],
            PollsInfo: null,
            totalPollsCount: 0,
        }

        this.newsService = new NewsService();
        this._submitPoll = this._submitPoll.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({
            isLoggedInUser: this.authService.isLoggedIn(),
            User: newProps.User
        });
    }

    private getPollsInfo(data: any): IPoll {
        return {
            Option1: data.Option1 ? data.Option1 : '',
            Option2: data.Option2 ? data.Option2 : '',
            Option3: data.Option3 ? data.Option3 : '',
            Option4: data.Option4 ? data.Option4 : '',
            Option1Poll: data.Option1Poll,
            Option2Poll: data.Option2Poll,
            Option3Poll: data.Option3Poll,
            Option4Poll: data.Option4Poll
        }
    }

    private getPollsInfo2(data: any, isPollAnswered: boolean, poll: number): any {
        let options: IPollInfo[] = [];
        let totalPollsCount = this.state.totalPollsCount;
        if (data) {
            if (data.Option1) {
                options = [...options,
                {
                    text: this.props.User.language === 'en' ? data.Option1 : data.Option1T, isPolled: isPollAnswered, pollCount: data.Option1Poll, poll: poll
                }];
                totalPollsCount += data.Option1Poll;
            }
            if (data.Option2) {
                options = [...options,
                {
                    text: this.props.User.language === 'en' ? data.Option2 : data.Option2T, isPolled: isPollAnswered, pollCount: data.Option2Poll, poll: poll
                }];
                totalPollsCount += data.Option2Poll;
            }
            if (data.Option3) {
                options = [...options,
                {
                    text: this.props.User.language === 'en' ? data.Option3 : data.Option3T, isPolled: isPollAnswered, pollCount: data.Option3Poll, poll: poll
                }];
                totalPollsCount += data.Option3Poll;
            }
            if (data.Option4) {
                options = [...options,
                {
                    text: this.props.User.language === 'en' ? data.Option4 : data.Option4T, isPolled: isPollAnswered, pollCount: data.Option4Poll, poll: poll
                }];
                totalPollsCount += data.Option4Poll;
            }
        }
        return { options: options, totalPollsCount: totalPollsCount };
    }

    componentDidMount() {

        this.setState({ isLoading: true });
        this.newsService.getPollOptionsByRefId({ id: this.state.RefId }).then((res: any) => {

            if (res.status && res.data.length > 0) {
                let pollsOptions = res.data[0];
                this.newsService.checkIsUserIsPolled({ id: this.state.RefId }).then((res1: any) => {
                    if (res1.status) {
                        let tempObj = this.getPollsInfo2(pollsOptions, res1.data.answeredPoll, res1.data.Poll);
                        this.setState({
                            Polls: this.getPollsInfo(pollsOptions),
                            isPollAnswered: res1.data.answeredPoll,
                            PollOptions1: tempObj.options,
                            totalPollsCount: tempObj.totalPollsCount,
                            isLoading: false
                        });
                    } else if (!res1.status && res1.statuscode === 401) {
                        let tempObj1 = this.getPollsInfo2(pollsOptions, false, 0);
                        this.setState({
                            Polls: this.getPollsInfo(pollsOptions),
                            PollOptions1: tempObj1.options,
                            totalPollsCount: tempObj1.totalPollsCount,
                            isLoggedInUser: false,
                            isLoading: false
                        });
                    }
                });
            } else {

                this.setState({
                    isLoading: false
                });
            }
        });

        socket.on(`Polls_${this.state.RefId}`, (data: any) => {
            let str = data.option;
            var res = Number(str.substring(6, 7));
            if (data && (data.RefId === this.state.RefId)) {
                let pollOptions1 = this.state.PollOptions1.map((pollInfo: IPollInfo, index: number) => {
                    if (res === index + 1) {
                        pollInfo.pollCount += 1;
                    }
                    return pollInfo;
                });

                this.setState({
                    PollOptions1: pollOptions1,
                    totalPollsCount: this.state.totalPollsCount + 1
                });
            }
        });
    }

    componentDidUpdate() {
    }

    private _closeDialog() {
        this.setState({
            showWarning: false,
            warningmsg: ''
        });
    }

    private _submitPoll(pollOption: number, pollText: string) {
        if (this.state.isLoggedInUser && !this.state.isPollAnswered) {
            this.newsService.SavePollResults({ RefId: this.state.RefId, Poll: pollOption }).then((res: any) => {
                if (res.status) {
                    this.setState({
                        isPollAnswered: true,
                    });
                } else if (res.statuscode === 401) {
                    this.setState({
                        isLoggedInUser: false,
                        showWarning: true,
                        warningmsg: this.props.User.staticConstants.Constants.sessionExpired
                    });
                    this.authService.LogOut1();
                }
            });
        } else {
            this.setState({
                showWarning: true,
                warningmsg: this.props.User.staticConstants.Constants.pollsLoginWarningMsg
            });
        }
    }

    render(): JSX.Element {
        return (
            <div className="comments-container sp-m10">
                <>
                    {this.state.isLoading ? <Shimmer1 /> : <>
                        {this.state.isPollAnswered ? <>
                            {this.state.PollOptions1.length > 0 &&
                                this.state.PollOptions1.map((r: IPollInfo, index: number) => {
                                    return <div id={r.text}>
                                        <p className="sp-mb0 sp-mt10">{r.text} <span className="sp-timestamp"> ( {Math.round((r.pollCount / this.state.totalPollsCount) * 100)}%) </span> </p>
                                        <ProgressBar now={Math.round((r.pollCount / this.state.totalPollsCount) * 100)} animated={false} />
                                    </div>
                                })
                            }
                        </> : <>
                                {this.state.PollOptions1.length > 0 &&
                                    this.state.PollOptions1.map((r: IPollInfo, index: number) => {
                                        return <div className="ms-Grid poll-otion" dir="ltr" id={r.text} >
                                            <div className="ms-Grid-row" onClick={() => this._submitPoll(index + 1, r.text)} >
                                                <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1" >
                                                    <span className="poll-ot1">
                                                        <i className={`ms-Icon checkb ms-Icon--${r.poll === index + 1 ? 'CheckboxCompositeReversed' : 'CheckMark'}`} aria-hidden="true"></i>
                                                    </span>
                                                </div>
                                                <div className="ms-Grid-col ms-sm11 ms-md11 ms-lg11" >
                                                    <p className="poll-text">{`${r.text}`} </p>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </>}
                    </>}
                </>
                {
                    !this.state.isLoggedInUser && <div className="login-warning-c">
                        <span className="login-warning sp-danger">{this.props.User.staticConstants.Constants.pollsLoginWarningMsg}</span>
                    </div>
                }
                <Dialog
                    hidden={!this.state.showWarning}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                    }}
                    modalProps={{
                        styles: { main: { maxWidth: 450, textAlign: "center" } },
                        isBlocking: true
                    }}
                >
                    <p>{this.state.warningmsg}</p>
                    <DefaultButton className="sp-btn-login" onClick={this._closeDialog} text="Ok" />
                </Dialog>

            </div >
        );
    }

}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(Polls);