import * as React from "react";
import { DefaultButton } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { FormType, ILoginForm, ILoginFormErr } from '../../../models/models';
import AuthService from '../../../services/authService/index';
import { AppState } from "../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../Redux/models";
import './styles.scss';

interface IState {
    loginForm: ILoginForm;
    loginFormErr: ILoginFormErr;
    FormErrMessage: string;
    language: string;
}

interface IProps {
    showDialog: boolean;
    afterLogin(): void;
    formHandle(id: number, userLoginId?: string): void;
    User: IUserState;
}

class LoginForm extends React.Component<IProps, IState> {
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            loginForm: { phoneNumber: '', password: '' },
            loginFormErr: { phoneNumberErr: '', passwordErr: '' },
            FormErrMessage: '',
            language: this.props.User.language
        }
        this._passwordChangeHandle = this._passwordChangeHandle.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._phoneNumberChangeHandle = this._phoneNumberChangeHandle.bind(this);
        this.authService = new AuthService();
    }

    private _passwordChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let errorMessage: string;
        if (event.target.value === "") {
            errorMessage = this.props.User.staticConstants.Constants.required;
        } else {
            errorMessage = "";
        }
        this.setState({
            loginForm: { ...this.state.loginForm, [event.target.name]: event.target.value },
            loginFormErr: { ...this.state.loginFormErr, [event.target.name + 'Err']: errorMessage }
        });
    }

    private _phoneNumberChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let errorMessage: string;
        const phoneNumber = (event.target.validity.valid) ? event.target.value : this.state.loginForm.phoneNumber;
        if (event.target.value === "") {
            errorMessage = errorMessage = this.props.User.staticConstants.Constants.required;
        } else if (!event.target.validity.valid) {
            errorMessage = this.props.User.staticConstants.Constants.onlyNumbersAllowed;
        } else {
            errorMessage = "";
        }
        this.setState({
            loginForm: { ...this.state.loginForm, [event.target.name]: phoneNumber },
            loginFormErr: { ...this.state.loginFormErr, [event.target.name + 'Err']: errorMessage }
        });
    }

    private isFormValid = (): boolean => {
        let loginForm: ILoginForm = this.state.loginForm;
        let loginFormErr: ILoginFormErr = this.state.loginFormErr;
        let isFormValid: boolean = true;
        if (loginForm.phoneNumber === "") {
            loginFormErr.phoneNumberErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else if (loginForm.phoneNumber.length < 10) {
            loginFormErr.phoneNumberErr = this.props.User.staticConstants.Constants.enterValidNumber;
            isFormValid = false;
        } else {
            loginFormErr.phoneNumberErr = "";
        }
        if (loginForm.password === "") {
            loginFormErr.passwordErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else {
            loginFormErr.passwordErr = "";
        }
        this.setState({
            loginFormErr: loginFormErr,
        });
        return isFormValid;
    }

    private _submitForm() {
        if (this.isFormValid()) {
            this.authService.Login(this.state.loginForm).then((res: any) => {
                if (res.status === true) {
                    this.setState({
                        loginForm: { phoneNumber: '', password: '' },
                        loginFormErr: { phoneNumberErr: '', passwordErr: '' },
                        FormErrMessage: ''
                    });
                } else {
                    if (res.statuscode === 2) {
                        this.props.formHandle(FormType.EMailVerify, this.state.loginForm.phoneNumber)
                    } else {
                        if (this.state.language === 'en') {
                            this.setState({
                                FormErrMessage: res.message
                            });
                        } else {
                            if (res.statuscode === 6) {
                                this.setState({
                                    FormErrMessage: this.props.User.staticConstants.Constants.invalidPassword
                                });
                            } else if (res.statuscode === 3) {
                                this.setState({
                                    FormErrMessage: this.props.User.staticConstants.Constants.rejectedError
                                });
                            } else if (res.statuscode === 4) {
                                this.setState({
                                    FormErrMessage: this.props.User.staticConstants.Constants.suspendedError
                                });
                            } else if (res.statuscode === 7) {
                                this.setState({
                                    FormErrMessage: this.props.User.staticConstants.Constants.accountNotFoundError
                                });
                            } else {
                                this.setState({
                                    FormErrMessage: this.props.User.staticConstants.Constants.error
                                });
                            }
                        }
                        setTimeout(() => {
                            this.setState({
                                FormErrMessage: ''
                            });
                        }, 5000);
                    }
                }
            });
        }
    }

    render(): JSX.Element {
        return (
            <Dialog
                hidden={!this.props.showDialog}
                onDismiss={() => { this.props.afterLogin() }}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: this.props.User.staticConstants.Constants.loginTitle,
                    closeButtonAriaLabel: 'Close',
                    showCloseButton: true,
                }}
                modalProps={{
                    containerClassName: "login-container-w",
                    onDismissed: () => { this.props.afterLogin() },
                    isBlocking: true
                }} >
                <div className="login-page">
                    <input type="text" pattern="[0-9]*" maxLength={10} className={`input-control fadeIn first ${true ? 'error-border' : ''}`} placeholder={this.props.User.staticConstants.Constants.phoneNumber} name="phoneNumber" value={this.state.loginForm.phoneNumber} onChange={this._phoneNumberChangeHandle} />
                    <p className="sp-danger">{this.state.loginFormErr.phoneNumberErr}</p>
                    <input type="password" className={`input-control fadeIn second ${true ? 'error-border' : ''}`} placeholder={this.props.User.staticConstants.Constants.password} name="password" value={this.state.loginForm.password} onChange={this._passwordChangeHandle} />
                    <p className="sp-danger">{this.state.loginFormErr.passwordErr}</p>
                    <p className="sp-danger">{this.state.FormErrMessage}</p>
                    <a className="forget-password" onClick={() => this.props.formHandle(FormType.ForgetPassword)} >{this.props.User.staticConstants.Constants.forgetPassword}</a>
                    <div className="sp-clearFix"></div>
                    <p className="create-account">{this.props.User.staticConstants.Constants.newToOurSite}<a className="register" onClick={() => this.props.formHandle(FormType.Register)}>{this.props.User.staticConstants.Constants.createAccount}</a> </p>
                    <DefaultButton onClick={this._submitForm} className="sp-main-btn sp-float-right btn-login" text={this.props.User.staticConstants.Constants.login} />
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(LoginForm);