import * as React from "react";
import { DefaultButton } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { FormType } from '../../../models/models';
import AuthService from '../../../services/authService/index';
import Util from "../../../util";
import { AppState } from "../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../Redux/models";
import './styles.scss';

interface IForgetPassword {
    phoneNumber: string;
    email: string;
}

interface IForgetPasswordErr {
    phoneNumberErr: string;
    emailErr: string;
}

interface IResetPasswordForm {
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

interface IResetPasswordFormErr {
    otpErr: string;
    newPasswordErr: string;
    confirmPasswordErr: string;
}

interface IState {
    forgetPasswordForm: IForgetPassword;
    forgetPasswordFormErr: IForgetPasswordErr;
    FormErrMessage: string;
    resetPassword: IResetPasswordForm;
    resetPasswordErr: IResetPasswordFormErr;
    isUserFound: boolean;
    isSuccessDialogHide: boolean;

}

interface IProps {
    showDialog: boolean;
    afterLogin(): void;
    User: IUserState;
    formHandle(id: number, userLoginId?: string): void;
}

class ForgetPasswrdForm extends React.Component<IProps, IState> {
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            forgetPasswordForm: { phoneNumber: '', email: '' },
            forgetPasswordFormErr: { phoneNumberErr: '', emailErr: '' },
            resetPassword: { otp: '', newPassword: '', confirmPassword: '' },
            resetPasswordErr: { otpErr: '', newPasswordErr: '', confirmPasswordErr: '' },
            FormErrMessage: '',
            isSuccessDialogHide: false,
            isUserFound: false
        }
        this._submitForm = this._submitForm.bind(this);
        this._emailChangeHandle = this._emailChangeHandle.bind(this);
        this._phoneNumberChangeHandle = this._phoneNumberChangeHandle.bind(this);
        this._resetPassowrd = this._resetPassowrd.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._confirmPasswordChangeHandle = this._confirmPasswordChangeHandle.bind(this);
        this._passwordChangeHandle = this._passwordChangeHandle.bind(this);
        this.__otpChangeHandle = this.__otpChangeHandle.bind(this);
        this.authService = new AuthService();
    }

    private _phoneNumberChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let errorMessage: string;
        const phoneNumber = (event.target.validity.valid) ? event.target.value : (event.target.validationMessage === this.props.User.staticConstants.Constants.required ? '' : this.state.forgetPasswordForm.phoneNumber);
        if (event.target.value === "") {
            errorMessage = this.props.User.staticConstants.Constants.required;
        } else if (!event.target.validity.valid) {
            errorMessage = this.props.User.staticConstants.Constants.onlyNumbersAllowed
        } else {
            errorMessage = "";
        }
        this.setState({
            forgetPasswordForm: { ...this.state.forgetPasswordForm, [event.target.name]: phoneNumber },
            forgetPasswordFormErr: { ...this.state.forgetPasswordFormErr, [event.target.name + 'Err']: errorMessage }
        });
    }

    private _closeDialog() {
        this.props.formHandle(FormType.Login);
    }

    private isFormValid = (): boolean => {
        let forgetPassword: IForgetPassword = this.state.forgetPasswordForm;
        let forgetPasswordErr: IForgetPasswordErr = this.state.forgetPasswordFormErr;
        let isFormValid: boolean = true;
        if (forgetPassword.phoneNumber === "") {
            forgetPasswordErr.phoneNumberErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else {
            forgetPasswordErr.phoneNumberErr = "";
        }
        if (forgetPassword.email === "") {
            forgetPasswordErr.emailErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else if (!Util.validateEmail(forgetPassword.email)) {
            forgetPasswordErr.emailErr = this.props.User.staticConstants.Constants.invalidEmail;
            isFormValid = false;
        }
        else {
            forgetPasswordErr.emailErr = "";
        }
        this.setState({
            forgetPasswordFormErr: forgetPasswordErr,
        });
        return isFormValid;
    }

    private _emailChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = this.props.User.staticConstants.Constants.required;
        } else if (!Util.validateEmail(event.target.value)) {
            erorMessage = this.props.User.staticConstants.Constants.invalidEmail;
        }
        else {
            erorMessage = "";
        }
        this.setState({
            forgetPasswordForm: { ...this.state.forgetPasswordForm, [event.target.name]: event.target.value },
            forgetPasswordFormErr: { ...this.state.forgetPasswordFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private _submitForm() {
        if (this.isFormValid()) {
            this.authService.verifyUser(this.state.forgetPasswordForm).then((res: any) => {
                if (res.status === true) {
                    this.setState({
                        isUserFound: true
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

    private _passwordChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = this.props.User.staticConstants.Constants.required;
        } else {
            erorMessage = "";
        }
        this.setState({
            resetPassword: { ...this.state.resetPassword, [event.target.name]: event.target.value },
            resetPasswordErr: { ...this.state.resetPasswordErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private __otpChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        const otp = (event.target.validity.valid) ? event.target.value : (event.target.validationMessage === this.props.User.staticConstants.Constants.required ? '' : this.state.resetPassword.otp);
        if (event.target.value === "") {
            erorMessage = this.props.User.staticConstants.Constants.required;
        } else if (!event.target.validity.valid) {
            erorMessage = this.props.User.staticConstants.Constants.onlyNumbersAllowed;
        }
        else {
            erorMessage = "";
        }
        this.setState({
            resetPassword: { ...this.state.resetPassword, [event.target.name]: otp },
            resetPasswordErr: { ...this.state.resetPasswordErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private _confirmPasswordChangeHandle(event: any) {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = this.props.User.staticConstants.Constants.required;
        } else if (this.state.resetPassword.newPassword !== '' && (this.state.resetPassword.newPassword !== event.target.value)) {
            erorMessage = this.props.User.staticConstants.Constants.passwordDoesntMatch;
        }
        else {
            erorMessage = "";
        }
        this.setState({
            resetPassword: { ...this.state.resetPassword, [event.target.name]: event.target.value },
            resetPasswordErr: { ...this.state.resetPasswordErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private isResetFormvalid() {
        let resetPassword: IResetPasswordForm = this.state.resetPassword;
        let resetPasswordErr: IResetPasswordFormErr = this.state.resetPasswordErr;
        let isFormValid: boolean = true;

        if (resetPassword.otp === "") {
            resetPasswordErr.otpErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        }
        else {
            resetPasswordErr.otpErr = "";
        }

        if (resetPassword.newPassword === "") {
            resetPasswordErr.newPasswordErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else {
            resetPasswordErr.newPasswordErr = "";
        }

        if (resetPassword.confirmPassword === "") {
            resetPasswordErr.confirmPasswordErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else if (resetPassword.newPassword !== '' && (resetPassword.newPassword !== resetPassword.confirmPassword)) {
            resetPasswordErr.confirmPasswordErr = this.props.User.staticConstants.Constants.passwordDoesntMatch;
            isFormValid = false;
        }
        else {
            resetPasswordErr.confirmPasswordErr = "";
        }
        this.setState({
            resetPasswordErr: resetPasswordErr,
        });
        return isFormValid;
    }

    private _resetPassowrd() {
        if (this.isResetFormvalid()) {
            this.authService.resetPassword({ phoneNumber: this.state.forgetPasswordForm.phoneNumber, otp: this.state.resetPassword.otp, newPassword: this.state.resetPassword.newPassword }).then((res: any) => {
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

    render(): JSX.Element {
        return (
            <Dialog
                hidden={!this.props.showDialog}
                onDismiss={() => { this.props.afterLogin() }}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: this.props.User.staticConstants.Constants.forgetPassword,
                    closeButtonAriaLabel: 'Close',
                    showCloseButton: true,
                }}
                modalProps={{
                    containerClassName: "login-container-w",
                    onDismissed: () => { this.props.afterLogin() },
                    isBlocking: true
                }} >

                {!this.state.isSuccessDialogHide ? (!this.state.isUserFound ?
                    <div className="login-page">
                        <TextField pattern="[0-9]*" label={this.props.User.staticConstants.Constants.phoneNumber} autoSave="false" autoComplete="false" name="phoneNumber" errorMessage={this.state.forgetPasswordFormErr.phoneNumberErr} value={this.state.forgetPasswordForm.phoneNumber} onChange={(event: any) => this._phoneNumberChangeHandle(event)} required minLength={10} prefix="+91" maxLength={10} />
                        <TextField label={this.props.User.staticConstants.Constants.email} name="email" errorMessage={this.state.forgetPasswordFormErr.emailErr} value={this.state.forgetPasswordForm.email} onChange={(event: any) => this._emailChangeHandle(event)} required />
                        <p className="sp-danger">{this.state.FormErrMessage}</p>
                        <DefaultButton onClick={this._submitForm} className="sp-main-btn sp-float-right btn-login" text={this.props.User.staticConstants.Constants.send} />
                    </div>
                    :
                    <div>
                        <p>{this.props.User.staticConstants.Constants.pleaseEnter6DigiiOtp}</p>
                        <TextField label="OTP" minLength={6} maxLength={6} pattern="[0-9]*" name="otp" errorMessage={this.state.resetPasswordErr.otpErr} value={this.state.resetPassword.otp} onChange={(event: any) => this.__otpChangeHandle(event)} required />
                        <hr />
                        <TextField type="password" autoComplete="false" label={this.props.User.staticConstants.Constants.password} name="newPassword" errorMessage={this.state.resetPasswordErr.newPasswordErr} value={this.state.resetPassword.newPassword} onChange={(event: any) => this._passwordChangeHandle(event)} required minLength={8} />
                        <TextField type="password" autoComplete="false" label={this.props.User.staticConstants.Constants.confirmPassword} name="confirmPassword" errorMessage={this.state.resetPasswordErr.confirmPasswordErr} value={this.state.resetPassword.confirmPassword} onChange={(event: any) => this._confirmPasswordChangeHandle(event)} required minLength={8} />
                        <DefaultButton onClick={this._resetPassowrd} className="sp-main-btn float-right btn-login" text={this.props.User.staticConstants.Constants.send} />
                    </div>) : <div style={{ textAlign: "center" }}>
                        <p>{this.props.User.staticConstants.Constants.passwordChanged}</p>
                        <p>{this.props.User.staticConstants.Constants.pleaseLogin}</p>
                        <DefaultButton className="sp-btn-login sp-mb10" onClick={this._closeDialog} text="Ok" />
                    </div>
                }
            </Dialog>
        );
    }
}

//export default ForgetPasswrdForm;

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(ForgetPasswrdForm);
