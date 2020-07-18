import * as React from "react";
import { DefaultButton } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IUser, IUserErr } from '../../../models/models';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { States, StatesAndDirstricts } from '../../../constants/constants';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import Service from './Service';
import { FormType } from '../../../models/models';
import { URLs } from '../../../constants/constants';
import Util from '../../../util';
import './styles.scss';
import { AppState } from "../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../Redux/models";
import { NavLink } from "react-router-dom";

const genderOptions: IChoiceGroupOption[] = [
    { key: 'male', text: 'Male' },
    { key: 'female', text: 'Female' }
];

const options: IDropdownOption[] = States.map((state: string) => {
    return { key: state, text: state }
})

interface IState {
    isLoginDialogEnabled: boolean;
    userForm: IUser;
    userFormErr: IUserErr;
    confirmPassword: string;
    confirmPasswordErr: string;
    City: IDropdownOption[];
    isPrivacyCheck: boolean;
    PrivacyCheckErr: string;
    FormErrMessage: string;
    showRegisterSuccessDialog: boolean;
    isLoading: boolean,
    imageError: string;
}

interface IProps {
    isLoginDialogEnabled: boolean;
    afterLogin(): void;
    formHandle(id: number): void;
    User: IUserState;
}

class Register extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoginDialogEnabled: this.props.isLoginDialogEnabled,
            userForm: { firstName: '', lastName: '', phoneNumber: '', password: '', gender: '', email: '', city: '', state: '', imagePath: '/uploads/images/avatar_2x.png' },
            userFormErr: { firstNameErr: '', lastNameErr: '', phoneNumberErr: '', passwordErr: '', genderErr: '', emailErr: '', cityErr: '', stateErr: '' },
            confirmPassword: '',
            confirmPasswordErr: '',
            isPrivacyCheck: false,
            City: [],
            PrivacyCheckErr: '',
            FormErrMessage: '',
            showRegisterSuccessDialog: false,
            isLoading: false,
            imageError: ''
        }

        this._loginCancel = this._loginCancel.bind(this);
        this._inputChangeHandle = this._inputChangeHandle.bind(this);
        this._onGenderChange = this._onGenderChange.bind(this);
        this._cityChangeHandle = this._cityChangeHandle.bind(this);
        this._onPrivacyCheck = this._onPrivacyCheck.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._onSucess = this._onSucess.bind(this);
        this._phoneNumberChangeHandle = this._phoneNumberChangeHandle.bind(this);
        this._onProgress = this._onSucess.bind(this);
        this._emailChangeHandle = this._emailChangeHandle.bind(this);
        this.service = new Service();
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({
            isLoginDialogEnabled: newProps.isLoginDialogEnabled
        });
    }

    public _emailChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = "Required";
        } else if (!Util.validateEmail(event.target.value)) {
            erorMessage = "Invalid email"
        }
        else {
            erorMessage = "";
        }
        this.setState({
            userForm: { ...this.state.userForm, [event.target.name]: event.target.value },
            userFormErr: { ...this.state.userFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    public _inputChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = "Required";
        } else {
            erorMessage = "";
        }
        this.setState({
            userForm: { ...this.state.userForm, [event.target.name]: event.target.value },
            userFormErr: { ...this.state.userFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    public _phoneNumberChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        const phoneNumber = (event.target.validity.valid || event.target.value === '') ? event.target.value : this.state.userForm.phoneNumber;
        if (event.target.value === "") {
            erorMessage = "Required";
        } else if (!event.target.validity.valid) {
            erorMessage = "Only number are allowed";
        } else {
            erorMessage = "";
        }
        this.setState({
            userForm: { ...this.state.userForm, [event.target.name]: phoneNumber },
            userFormErr: { ...this.state.userFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    public confirmPasswordChangeHandle(event: any) {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = "Required";
        } else if (this.state.userForm.password !== '' && (this.state.userForm.password !== event.target.value)) {
            erorMessage = "Password doesn't match."
        }
        else {
            erorMessage = "";
        }
        this.setState({
            confirmPassword: event.target.value,
            confirmPasswordErr: erorMessage
        });
    }

    stateChangeHandle(event: React.FormEvent<HTMLDivElement>, field: string, option?: IDropdownOption,) {
        if (option) {
            let CitysInfo: any[] = [];
            StatesAndDirstricts.forEach((sADInfo: any) => {
                if (sADInfo.State === option.key) {
                    CitysInfo = [...CitysInfo, sADInfo];
                }
            });
            if (CitysInfo && CitysInfo.length > 0) {


                let citiesinSelectState = CitysInfo[0].Districts.map((state: string) => {
                    return { key: state, text: state }
                });
                this.setState({
                    userForm: { ...this.state.userForm, [field]: option.key },
                    userFormErr: { ...this.state.userFormErr, [field + 'Err']: '' },
                    City: citiesinSelectState
                });
            }
        }

    }

    _cityChangeHandle(event: React.FormEvent<HTMLDivElement>, field: string, option?: IDropdownOption,) {
        if (option) {
            this.setState({
                userForm: { ...this.state.userForm, [field]: option.key },
                userFormErr: { ...this.state.userFormErr, [field + 'Err']: '' }
            });
        }
    }
    _loginCancel() {
        this.setState({
            isLoginDialogEnabled: false
        });
        this.props.afterLogin();
    }

    _onGenderChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
        if (option) {
            this.setState({
                userForm: { ...this.state.userForm, [field]: option.key },
                userFormErr: { ...this.state.userFormErr, [field + 'Err']: '' }
            });
        }
    }
    _onPrivacyCheck(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, checked?: boolean | undefined) {
        if (checked !== undefined) {
            this.setState({
                isPrivacyCheck: checked,
                PrivacyCheckErr: ''
            });
        }
    }

    private isFormValid = (): boolean => {
        let userForm: IUser = this.state.userForm;
        let userFormErr: IUserErr = this.state.userFormErr;
        let confirmPasswordErr: string;
        let isFormValid: boolean = true;
        let PrivacyCheckErr: string;
        if (userForm.phoneNumber === "") {
            userFormErr.phoneNumberErr = "Required";
            isFormValid = false;
        } else if (userForm.phoneNumber.length < 10) {
            userFormErr.phoneNumberErr = "Enter valid mobile number"
            isFormValid = false;
        } else {
            userFormErr.phoneNumberErr = "";
        }
        if (userForm.password === "") {
            userFormErr.passwordErr = "Required";
            isFormValid = false;
        } else {
            userFormErr.passwordErr = "";
        }

        if (this.state.confirmPassword === "") {
            confirmPasswordErr = "Required";
            isFormValid = false;
        } else if (userForm.password !== '' && (this.state.userForm.password !== this.state.confirmPassword)) {
            confirmPasswordErr = "Password doesn't match.";
            isFormValid = false;
        }
        else {
            confirmPasswordErr = "";
        }

        if (userForm.firstName === "") {
            userFormErr.firstNameErr = "Required";
            isFormValid = false;
        } else {
            userFormErr.firstNameErr = "";
        }

        if (userForm.lastName === "") {
            userFormErr.lastNameErr = "Required";
            isFormValid = false;
        } else {
            userFormErr.lastNameErr = "";
        }

        if (userForm.gender === "") {
            userFormErr.genderErr = "Required";
            isFormValid = false;
        } else {
            userFormErr.genderErr = "";
        }

        if (userForm.email === "") {
            userFormErr.emailErr = "Required";
            isFormValid = false;
        } else if (!Util.validateEmail(userForm.email)) {
            userFormErr.emailErr = "Invlaid email"
            isFormValid = false;
        } else {
            userFormErr.emailErr = "";
        }

        if (userForm.state === "") {
            userFormErr.stateErr = "Required";
            isFormValid = false;
        } else {
            userFormErr.stateErr = "";
        }

        if (userForm.city === "") {
            userFormErr.cityErr = "Required";
            isFormValid = false;
        } else {
            userFormErr.cityErr = "";
        }

        this.setState({
            userFormErr: userFormErr,
            confirmPasswordErr: confirmPasswordErr,
        });

        return isFormValid;

    }

    private _submitForm() {
        if (this.isFormValid()) {
            this.service.RegisterUser(this.state.userForm).then((res: any) => {
                if (res.status === true) {
                    this.setState({
                        userForm: { firstName: '', lastName: '', phoneNumber: '', password: '', gender: '', email: '', city: '', state: '', imagePath: '/uploads/images/avatar_2x.png' },
                        userFormErr: { firstNameErr: '', lastNameErr: '', phoneNumberErr: '', passwordErr: '', genderErr: '', emailErr: '', cityErr: '', stateErr: '' },
                        confirmPassword: '',
                        confirmPasswordErr: '',
                        isPrivacyCheck: false,
                        City: [],
                        PrivacyCheckErr: '',
                        showRegisterSuccessDialog: true
                    });
                } else {
                    if (res.statuscode === 2) {
                        this.setState({
                            FormErrMessage: "Account exit with this number/email"
                        });
                    } else {
                        this.setState({
                            FormErrMessage: res.msg
                        });
                    }
                }
            });
        }
    }

    onPhotoUpload(event: any, _onSucess: any, _onProgress: any) {
        //console.log(event.target.files[0]);
        if (event.target.files[0]) {
            if (event.target.files[0].type === 'image/x-png' || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/gif' || event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/jpg') {
                let datae: any = event.target.files[0];
                const data = new FormData();
                data.append('file', event.target.files[0]);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", `http://localhost:7777/use${URLs.uploadProfilePic}`);
                xhr.upload.addEventListener("progress", function (this, evt) {
                    if (evt.lengthComputable) {
                        let percentComplete: any = evt.loaded / evt.total;
                        let df: any = percentComplete.toFixed(2) * 100;
                        datae.progress = df.toFixed(0);
                        let db = datae;
                        db.progress = df.toFixed(0);
                        _onProgress(db);
                    }
                }, false);
                xhr.onloadstart = function (e) {
                }
                xhr.onloadend = function (e) {
                }
                xhr.send(data);
                xhr.onreadystatechange =
                    function () {
                        if (this.readyState === 4 && this.status === 200) {
                            var res = JSON.parse(this.response);
                            datae.response = res;
                            var de = datae
                            _onSucess(de);
                        }
                    };
            } else {
                this.setState({
                    imageError: "Only images are allowed."
                });
                setTimeout(() => {
                    this.setState({
                        imageError: ''
                    });
                }, 3000);
            }
        }
    }

    public _onSucess(some: any) {
        if (some && some.response) {
            this.setState({
                userForm: { ...this.state.userForm, imagePath: some.response.filePath }
            });
        }
    }

    public _onProgress(some: any) {

    }

    public render(): JSX.Element {
        return (<>
            <Dialog
                hidden={!this.state.isLoginDialogEnabled}
                onDismiss={this._loginCancel}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: "Signup",
                    closeButtonAriaLabel: 'Close',
                    showCloseButton: true,
                }}

                modalProps={{
                    styles: { main: { maxWidth: 450 } },
                    containerClassName: "register-form-dialog",
                    onDismissed: this._loginCancel,
                    isBlocking: true
                }}
            >
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 sp-center">
                            <img src={`http://localhost:7777${this.state.userForm.imagePath}`} className="avatar" alt="sss" />
                            <input type="file" name="photo" id="photo" className="display-none" accept="image/*" onChange={(event: any) => this.onPhotoUpload(event, this._onSucess, this._onProgress)} />
                            <label className="cursor upload-photo" htmlFor="photo">Select photo</label>
                            <span className="sp-danger">{this.state.imageError}</span>
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <TextField pattern="[0-9]*" label="phoneNumber" autoSave="false" autoComplete="false" name="phoneNumber" errorMessage={this.state.userFormErr.phoneNumberErr} value={this.state.userForm.phoneNumber} onChange={(event: any) => this._phoneNumberChangeHandle(event)} required minLength={10} prefix="+91" maxLength={10} />
                            <TextField type="password" autoComplete="false" label="Password" name="password" errorMessage={this.state.userFormErr.passwordErr} value={this.state.userForm.password} onChange={(event: any) => this._inputChangeHandle(event)} required minLength={8} />
                            <TextField type="password" autoComplete="false" label="Confirm password" name="confirmPassword" errorMessage={this.state.confirmPasswordErr} value={this.state.confirmPassword} onChange={(event: any) => this.confirmPasswordChangeHandle(event)} required minLength={8} />
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <TextField label="First Name" name="firstName" errorMessage={this.state.userFormErr.firstNameErr} value={this.state.userForm.firstName} onChange={(event: any) => this._inputChangeHandle(event)} required />
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <TextField label="Last Name" name="lastName" errorMessage={this.state.userFormErr.lastNameErr} value={this.state.userForm.lastName} onChange={(event: any) => this._inputChangeHandle(event)} required />
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <TextField label="Email" name="email" errorMessage={this.state.userFormErr.emailErr} value={this.state.userForm.email} onChange={(event: any) => this._emailChangeHandle(event)} required />
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <ChoiceGroup defaultSelectedKey="B" options={genderOptions} onChange={(ev: any, o: any) => this._onGenderChange(ev, o, "gender")} label="Gender" required={true} />
                            <span className="sp-danger">{this.state.userFormErr.genderErr}</span>
                            <style>
                                {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                                `}
                            </style>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <Dropdown
                                label="State"
                                options={options}
                                errorMessage={this.state.userFormErr.stateErr}
                                selectedKey={this.state.userForm.state}
                                onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => this.stateChangeHandle(event, "state", option)} required
                            />
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                            <Dropdown
                                label="District"
                                options={this.state.City}
                                errorMessage={this.state.userFormErr.cityErr}
                                selectedKey={this.state.userForm.city}
                                onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => this._cityChangeHandle(event, "city", option)} required
                            />
                        </div>
                    </div>
                </div>
                <span className="sp-danger sp-ml10">{this.state.FormErrMessage}</span>
                <DefaultButton onClick={this._submitForm} className="sp-main-btn sp-float-right btn-register" text="Register" />
            </Dialog>
            <Dialog
                hidden={!this.state.showRegisterSuccessDialog}
                onDismiss={this._loginCancel}
                modalProps={{
                    styles: { main: { maxWidth: 450 } },
                    isBlocking: true
                }}
            >
                <h5>Thanks for joing our community.</h5>
                <DefaultButton onClick={() => this.props.formHandle(FormType.Login)} className="sp-main-btn sp-float-right btn-login" text="Ok" />
            </Dialog>
        </>
        );
    }
}


const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(Register);
