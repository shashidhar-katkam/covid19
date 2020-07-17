import * as React from "react";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { connect } from "react-redux";
import Util from "../../../util";
import { IDialogPropss } from "../../../models/models";
import { IUserState } from "../../../Redux/models";
import { AppState } from "../../../Redux/app.store";
import NewsService from "../Service";


interface INeedHelp {
    name: string;
    email: string;
    anyRef: any;
    query: string;
}

interface INeedHelpErr {
    nameErr: string;
    emailErr: string;
    queryErr: string;
}


interface IState {
    isLoading: boolean;
    DialogProps: IDialogPropss;
    showDialog: boolean;
    anyRef: any;
    needHelp: INeedHelp;
    needHelpErr: INeedHelpErr;
    User: any;
}

interface IProps {
    User: IUserState;
    afterCancel: Function;
    showDialog: boolean;
    name?: string;
    email?: string;
    anyRef?: any;
}

class NeedHelp extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            DialogProps: { show: false, message: '' },
            showDialog: this.props.showDialog,
            anyRef: this.props.anyRef,
            needHelp: { name: this.props.User.User ? this.props.User.User.firstName + ' ' + this.props.User.User.lastName : '', email: this.props.User.User ? this.props.User.User.email : '', query: '', anyRef: this.props.anyRef ? this.props.anyRef : null },
            needHelpErr: { nameErr: '', emailErr: '', queryErr: '' },
            User: this.props.User.User ? this.props.User.User : null
        }

        this.newsService = new NewsService();
        this._closeDialog = this._closeDialog.bind(this);
        this._inputChangeHandle = this._inputChangeHandle.bind(this);
        this._emailChangeHandle = this._emailChangeHandle.bind(this);
        this._queryChangeHandle = this._queryChangeHandle.bind(this);
    }

    private _inputChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (this.state.User !== null || this.state.User !== undefined) {
            let erorMessage: string;
            if (event.target.value === '') {
                erorMessage = `required.`;
            } else {
                erorMessage = "";
            }
            this.setState({
                needHelp: { ...this.state.needHelp, [event.target.name]: event.target.value },
                needHelpErr: { ...this.state.needHelpErr, [event.target.name + 'Err']: erorMessage }
            });
        }
    }

    private _queryChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === '') {
            erorMessage = `required.`;
        } else {
            erorMessage = "";
        }
        this.setState({
            needHelp: { ...this.state.needHelp, [event.target.name]: event.target.value },
            needHelpErr: { ...this.state.needHelpErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private _emailChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (this.state.User !== null || this.state.User !== undefined) {
            let erorMessage: string;
            if (event.target.value === "") {
                erorMessage = "Email is required.";
            } else if (!Util.validateEmail(event.target.value)) {
                erorMessage = "Invalid email";
            }
            else {
                erorMessage = "";
            }
            this.setState({
                needHelp: { ...this.state.needHelp, [event.target.name]: event.target.value },
                needHelpErr: { ...this.state.needHelpErr, [event.target.name + 'Err']: erorMessage }
            });
        }
    }

    private raiseRequest() {
        this.setState({
            isLoading: true
        });


        this.newsService.saveQuery(this.state.needHelp).then((res: any) => {
            if (res.status) {
                this.setState({ isLoading: false, DialogProps: { show: true, message: res.message } });

            } else {

                this.setState({
                    isLoading: false
                })
            }
        });

    }

    private _closeDialog() {
        this.setState({
            DialogProps: { show: false, message: '' }
        });
        this.props.afterCancel();
    }

    public render(): JSX.Element {
        return (<>
            <Dialog
                hidden={!this.state.showDialog}
                onDismiss={() => { this.props.afterCancel() }}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Need Help',
                    closeButtonAriaLabel: 'Close',
                    showCloseButton: true,
                }}
                modalProps={{
                    containerClassName: "login-container-w",
                    onDismissed: () => { this.props.afterCancel() },
                    isBlocking: true
                }} >
                <div className="login-page">

                    <TextField label="Name" disabled={this.props.User.User ? true : false} placeholder="Enter Name" name="name" errorMessage={this.state.needHelpErr.nameErr} value={this.state.needHelp.name} onChange={(event: any) => this._inputChangeHandle(event)} required />
                    <TextField
                        label="Email"
                        name="email"
                        disabled={this.props.User.User ? true : false}
                        errorMessage={this.state.needHelpErr.emailErr}
                        value={this.state.needHelp.email}
                        onChange={(event: any) => this._emailChangeHandle(event)}
                        required />

                    <TextField label="Query" multiline={true} rows={4} placeholder="Describe your problem" name="query" errorMessage={this.state.needHelpErr.queryErr} value={this.state.needHelp.query} onChange={(event: any) => this._queryChangeHandle(event)} required />
                    <DefaultButton onClick={() => { this.raiseRequest() }} className="sp-main-btn sp-float-right btn-login" text="Send" />


                </div>
            </Dialog>
            <Dialog
                hidden={!this.state.DialogProps.show}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                modalProps={{
                    styles: { main: { maxWidth: 450, textAlign: "center" } },
                    isBlocking: true
                }}
            >
                <p>{this.state.DialogProps.message}</p>
                <DefaultButton className="sp-btn-login" onClick={this._closeDialog} text="Ok" />
            </Dialog>

        </>
        );
    }
}


const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});


export default connect(
    mapStateToProps
)(NeedHelp);


