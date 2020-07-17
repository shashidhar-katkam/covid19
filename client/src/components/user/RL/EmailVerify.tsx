import * as React from "react";
import { DefaultButton } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { FormType } from '../../../models/models';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import AuthService from '../../../services/authService/index';
import Util from '../../../util';
import { AppState } from "../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../Redux/models";
import './styles.scss';

interface IEmailVerifyForm {
    email: string;
    userLoginId: string;
    otp: string;
}

interface IEmailVerifyFormErr {
    emailErr: string;
    otpErr: string;
}

interface IState {
    EmailVerifyForm: IEmailVerifyForm;
    EmailVerifyFormErr: IEmailVerifyFormErr;
    FormErrMessage: string;
    showOtpDialog: boolean;
    isSuccessDialogHide: boolean;
    showResendButton: boolean;
    isResendOtp: boolean;
}

interface IProps {
    showDialog: boolean;
    afterLogin(): void;
    formHandle(id: number): void;
    userLoginId: string;
    User: IUserState;

}

class EmailVerifyForm extends React.Component<IProps, IState> {
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            EmailVerifyForm: { email: '', otp: '', userLoginId: this.props.userLoginId },
            EmailVerifyFormErr: { emailErr: '', otpErr: '' },
            FormErrMessage: '',
            showOtpDialog: false,
            isSuccessDialogHide: false,
            showResendButton: false,
            isResendOtp: false
        }

        this._submitForm = this._submitForm.bind(this);
        this._emailChangeHandle = this._emailChangeHandle.bind(this);
        this._isOtpValid = this._isOtpValid.bind(this);
        this._submitOtp = this._submitOtp.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._otpChangeHandle = this._otpChangeHandle.bind(this);
        this._resendOTP = this._resendOTP.bind(this);

        this.authService = new AuthService();
    }

    private _emailChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
            EmailVerifyForm: { ...this.state.EmailVerifyForm, [event.target.name]: event.target.value },
            EmailVerifyFormErr: { ...this.state.EmailVerifyFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private _otpChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        const otp = (event.target.validity.valid) ? event.target.value : (event.target.validationMessage === "Please fill out this field." ? '' : this.state.EmailVerifyForm.otp);
        if (event.target.value === "") {
            erorMessage = "OTP is required";
        } else if (!event.target.validity.valid) {
            erorMessage = "Please enter numbers only.";
        }
        else {
            erorMessage = "";
        }
        this.setState({
            EmailVerifyForm: { ...this.state.EmailVerifyForm, [event.target.name]: otp },
            EmailVerifyFormErr: { ...this.state.EmailVerifyFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }


    private _closeDialog() {
        this.props.formHandle(FormType.Login);
    }

    private isFormValid = (): boolean => {
        let emailVerifyForm: IEmailVerifyForm = this.state.EmailVerifyForm;
        let emailVerifyFormErr: IEmailVerifyFormErr = this.state.EmailVerifyFormErr;
        let isFormValid: boolean = true;
        if (emailVerifyForm.email === "") {
            emailVerifyFormErr.emailErr = "Email is required.";
        } else if (!Util.validateEmail(emailVerifyForm.email)) {
            emailVerifyFormErr.emailErr = "Invalid email";
        }
        else {
            emailVerifyFormErr.emailErr = "";
        }
        this.setState({
            EmailVerifyFormErr: emailVerifyFormErr,
        });
        return isFormValid;
    }

    private _submitForm() {
        if (this.isFormValid()) {
            this.authService.verifyEmail({ phoneNumber: this.state.EmailVerifyForm.userLoginId, email: this.state.EmailVerifyForm.email }).then((res: any) => {
                if (res.status === true) {

                    if (res.statuscode === 1) {
                        this.setState({
                            showOtpDialog: true
                        });
                        setTimeout(() => {
                            this.setState({
                                showResendButton: true
                            });
                        }, 30000);
                    }
                } else {
                    this.setState({
                        FormErrMessage: res.message
                    });
                    setTimeout(() => {
                        this.setState({
                            FormErrMessage: ''
                        });
                    }, 5000);
                }
            });
        }
    }


    private _isOtpValid = (): boolean => {
        let emailVerifyForm: IEmailVerifyForm = this.state.EmailVerifyForm;
        let emailVerifyFormErr: IEmailVerifyFormErr = this.state.EmailVerifyFormErr;
        let isFormValid: boolean = true;
        if (emailVerifyForm.otp === "") {
            emailVerifyFormErr.otpErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        }
        else {
            emailVerifyFormErr.otpErr = "";
        }
        this.setState({
            EmailVerifyFormErr: emailVerifyFormErr,
        });
        return isFormValid;
    }

    private _submitOtp() {
        if (this._isOtpValid()) {
            this.authService.verifyOTP({ phoneNumber: this.state.EmailVerifyForm.userLoginId, email: this.state.EmailVerifyForm.email, otp: this.state.EmailVerifyForm.otp }).then((res: any) => {
                if (res.status === true) {
                    this.setState({
                        isSuccessDialogHide: true
                    });
                } else {
                    this.setState({
                        FormErrMessage: res.message
                    });
                    setTimeout(() => {
                        this.setState({
                            FormErrMessage: ''
                        });
                    }, 5000);
                }
            });
        }
    }

    private _resendOTP() {
        this.authService.verifyEmail({ phoneNumber: this.state.EmailVerifyForm.userLoginId, email: this.state.EmailVerifyForm.email }).then((res: any) => {
            if (res.status === true) {
                if (res.statuscode === 1) {
                    this.setState({
                        showResendButton: false,
                        isResendOtp: true
                    });
                    setTimeout(() => {
                        this.setState({
                            isResendOtp: false
                        });
                    }, 7000);
                }
            } else {
                this.setState({
                    FormErrMessage: res.message
                });
            }
        });
    }

    render(): JSX.Element {
        return (
            <Dialog
                hidden={!this.props.showDialog}
                onDismiss={() => { this.props.afterLogin() }}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: this.props.User.staticConstants.Constants.verifyEmail,
                    closeButtonAriaLabel: 'Close',
                    showCloseButton: true,
                }}
                modalProps={{
                    containerClassName: "login-container-w",
                    onDismissed: () => { this.props.afterLogin() },
                    isBlocking: true
                }} >
                <div className="login-page">
                    {!this.state.isSuccessDialogHide ? (!this.state.showOtpDialog ? <>
                        <p className="sp-danger">{this.props.User.staticConstants.Constants.emailNotVerified}</p>
                        <p>{this.props.User.staticConstants.Constants.pleaseEnterEmailToVerify}</p>
                        <TextField
                            label={this.props.User.staticConstants.Constants.email}
                            name="email"
                            errorMessage={this.state.EmailVerifyFormErr.emailErr}
                            value={this.state.EmailVerifyForm.email}
                            onChange={(event: any) => this._emailChangeHandle(event)}
                            required />
                        <p className="sp-danger">{this.state.FormErrMessage}</p>
                        <DefaultButton onClick={this._submitForm} className="sp-main-btn sp-float-right btn-login" text={this.props.User.staticConstants.Constants.send} />
                    </> : <>
                            <p>{this.props.User.staticConstants.Constants.pleaseEnter6DigiiOtp}</p>
                            <TextField
                                label="OTP"
                                minLength={6}
                                maxLength={6}
                                pattern="[0-9]*"
                                name="otp"
                                errorMessage={this.state.EmailVerifyFormErr.otpErr}
                                value={this.state.EmailVerifyForm.otp}
                                onChange={(event: any) => this._otpChangeHandle(event)} required />
                            <p className="sp-danger">{this.state.FormErrMessage}</p>

                            {this.state.showResendButton && <> <p className="no-otp">Didn't recieve OTP,<span onClick={this._resendOTP} >Resend</span></p> </>}
                            {this.state.isResendOtp && <p className="otp-sent">OTP sent succussfully.</p>}
                            <DefaultButton onClick={this._submitOtp} className="sp-main-btn float-right btn-login" text={this.props.User.staticConstants.Constants.send} />
                        </>) :
                        <div style={{ textAlign: "center" }}>
                            <p>{this.props.User.staticConstants.Constants.accountIsVerified}</p>
                            <p>{this.props.User.staticConstants.Constants.pleaseLogin}</p>
                            <DefaultButton className="sp-btn-login" onClick={this._closeDialog} text="Ok" />
                        </div>
                    }
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
)(EmailVerifyForm);
