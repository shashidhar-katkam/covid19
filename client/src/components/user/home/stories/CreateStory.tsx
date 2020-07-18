import * as React from "react";
import FileUpload from '../../../common/fileUpload';
import { IFileInfo,  BasicUserInfo, IDialogPropss, FileT } from '../../../../models/models';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Service from '../../Service';
import { DefaultButton, Callout, IDropdownOption, Dropdown } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import AuthService from '../../../../services/authService';
import Loading from "../../../common/Loading";
import { IUserState } from "../../../../Redux/models";
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import './styles.scss';
import Common from "../../../common";
const ShowMoreText = require('react-show-more-text');

export const CategoryOptions: IDropdownOption[] = [
    { key: 'Diabetes', text: 'Diabetes' },
    { key: 'Lung disease', text: 'Lung disease' },
    { key: 'Hypertension', text: 'Hypertension' },
    { key: 'Heart diesease', text: 'Heart diesease' },
    { key: 'Kidney disorder', text: 'Kidney disorder' }
];

interface IstoryForm {
    Name: string;
    Age: string;
    Diceases: string[];
    Symptoms: string;
    Treatment: string;
    MoreToSay: string;
    User: any;
    Files: IFileInfo[];
}

interface IstoryFormError {
    NameErr: string;
    AgeErr: string;
    DiceasesErr: string;
    SymptomsErr: string;
    TreatmentErr: string;
    MoreToSayErr: string;
    FilesErr: string;
}

interface IState {
    uploadedFilesInfo: any;
    storyForm: IstoryForm;
    storyFormErr: IstoryFormError;
    Reset: boolean;
    DialogProps: IDialogPropss;
    isLoading: boolean;
    isShowInfoPanel: boolean;
    showStoryForm: boolean;
}

interface IProps {
    User: IUserState;
}

class CreateStory extends React.Component<IProps, IState> {
    private service: Service;
    private _menuButtonElement = React.createRef<HTMLImageElement>();
    private authservice: AuthService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            uploadedFilesInfo: [],
            storyForm: {
                Name: '',
                Age: '',
                Diceases: [],
                Symptoms: '',
                Treatment: '',
                MoreToSay: '',
                User: '',
                Files: [],

            },
            storyFormErr: { NameErr: '', AgeErr: '', DiceasesErr: '', SymptomsErr: '', TreatmentErr: '', MoreToSayErr: '', FilesErr: '' },
            Reset: false,
            DialogProps: { show: false, message: '' },
            isLoading: false,
            isShowInfoPanel: false,
            showStoryForm: false
        }
        this._afterFilesUploaded = this._afterFilesUploaded.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._inputChangeHandle = this._inputChangeHandle.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._removefile = this._removefile.bind(this);
        this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
        this._ageChangeHandle = this._ageChangeHandle.bind(this);
        this._hideStoryForm = this._hideStoryForm.bind(this);
        this.service = new Service();
        this.authservice = new AuthService();
    }

    private _afterFilesUploaded(files: any) {
        for (let i = 0; i < files.length; i++) {
            this.setState((prevState, prevProps) => ({
                uploadedFilesInfo: [...prevState.uploadedFilesInfo, files[i]]
            }));
        }
    }

    private _removefile(fileInf: any) {
        let uploadedFiles: any[] = [];
        this.state.uploadedFilesInfo.forEach((fileInfo: any) => {
            if (fileInfo.name !== fileInf.name) {
                uploadedFiles = [...uploadedFiles, fileInfo];
            }
        });
        this.setState({
            uploadedFilesInfo: uploadedFiles
        });
    }

    private _onProgress(filesInfo: any) {
        let upLoad = Common._onProgress(filesInfo, this.state.uploadedFilesInfo);
        this.setState((prevState: IState) => {
            return { uploadedFilesInfo: upLoad }
        });
    }

    private _inputChangeHandle(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            storyForm: { ...this.state.storyForm, [event.target.name]: event.target.value },
        });
    }

    private isFormValid(): boolean {
        let newsForm: IstoryForm = this.state.storyForm;
        let errormsgs: IstoryFormError = this.state.storyFormErr;
        let uploadedFilesInfo = this.state.uploadedFilesInfo;
        let isFormValid: boolean = true;

        if (newsForm.Name === "") {
            errormsgs.NameErr = "Required";
            isFormValid = false;
        } else {
            errormsgs.NameErr = "";
        }

        if (newsForm.Symptoms === "") {
            errormsgs.SymptomsErr = "Required";
            isFormValid = false;
        } else {
            errormsgs.SymptomsErr = "";
        }

        if (newsForm.Treatment === "") {
            errormsgs.TreatmentErr = "Required";
            isFormValid = false;
        } else {
            errormsgs.TreatmentErr = "";
        }

        if (newsForm.Diceases.length === 0) {
            errormsgs.DiceasesErr = "Required";
            isFormValid = false;
        } else {
            errormsgs.DiceasesErr = "";
        }

        if (uploadedFilesInfo.length > 0) {
            for (let i = 0; i < uploadedFilesInfo.length; i++) {
                if (!uploadedFilesInfo[i].response) {
                    errormsgs.FilesErr = "Please wait until all files are uploaded."
                    isFormValid = false;
                } else {
                    errormsgs.FilesErr = '';
                }
            }
        }
        this.setState({
            storyFormErr: errormsgs
        });

        setTimeout(() => {
            this.setState((prevState: IState) => {
                return {
                    storyFormErr: { ...prevState.storyFormErr, FilesErr: '' },
                };
            });
        }, 3000);
        return isFormValid;
    }

    private _closeDialog() {
        this.setState({
            DialogProps: { show: false, message: '' }
        });
    }

    private _submitForm() {
        if (this.isFormValid()) {
            let uploadedFilesInfo = this.state.uploadedFilesInfo;
            let formData: IstoryForm = this.state.storyForm;
            let FileUploadedResponse: IFileInfo[] = [];
            for (let i = 0; i < uploadedFilesInfo.length; i++) {
                if (uploadedFilesInfo[i].response) {
                    FileUploadedResponse = [...FileUploadedResponse,
                    new FileT(uploadedFilesInfo[i].response)]
                }
            }

            let userInfo = this.authservice.isLoggedIn();
            formData = {
                ...formData,
                Files: FileUploadedResponse,
                User: (userInfo ? new BasicUserInfo(userInfo) : null)
            };
            formData.Name = formData.Name.trim();
            formData.MoreToSay = formData.MoreToSay.trim();
            formData.Symptoms = formData.Symptoms.trim();
            formData.Treatment = formData.Treatment.trim();
            this.setState({ isLoading: true });
            this.service.createStory(formData).then((res) => {
                if (res.status === true) {
                    this.setState({
                        uploadedFilesInfo: [],
                        storyForm: {
                            Name: '',
                            Age: '',
                            Diceases: [],
                            Symptoms: '',
                            Treatment: '',
                            MoreToSay: '',
                            User: '',
                            Files: [],

                        },
                        storyFormErr: {
                            NameErr: '',
                            AgeErr: '',
                            DiceasesErr: '', SymptomsErr: '',
                            TreatmentErr: '', MoreToSayErr: '', FilesErr: ''
                        },
                        Reset: true,
                        DialogProps: { show: true, message: "Your story created." },
                        isLoading: false
                    });
                } else {
                    this.setState({
                        DialogProps: { show: true, message: res.message },
                        isLoading: false
                    });
                }
            });
        }
    }

    private filesUploadedBindingInfo(filesInfo: any[]) {
        let temp;
        temp = filesInfo.map((fileInfo: any) => {
            return <div key={fileInfo.name}>
                <div className="ms-Grid upload" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
                            <p className="filename">{fileInfo.name}</p>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
                            <div className="ms-Grid" dir="ltr">
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-sm10 ms-md10 ms-lg11 sp-progress-bar ">
                                        {fileInfo.progress != 100 &&
                                            <ProgressBar now={fileInfo.progress}
                                                label={fileInfo.progress}
                                                animated={true}
                                            />
                                        }
                                    </div>
                                    <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg1">
                                        <span className="btn-remove-file sp-float-right"
                                            onClick={() => this._removefile(fileInfo)}> &times;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        });
        return temp;
    }

    _onCalloutDismiss() {
        this.setState({
            isShowInfoPanel: false
        });
    }

    _hideStoryForm() {
        this.setState({
            showStoryForm: false
        });
    }

    private _onCategoryChange(option?: IDropdownOption) {
        let erorMessage: string;
        if (option) {
            let catergory = this.state.storyForm.Diceases;
            if (option.selected) {
                catergory.push(option.key.toString());
            } else {
                let files = this.state.storyForm.Diceases.filter(
                    (file: string) => file !== option.key
                );
                catergory = files;
            }
            if (catergory.length > 0) {
                erorMessage = ''
            }
            else {
                erorMessage = 'required'

            }
            this.setState({
                storyForm: { ...this.state.storyForm, Diceases: catergory },
                storyFormErr: { ...this.state.storyFormErr, DiceasesErr: erorMessage },
            });
        }
    }


    public _ageChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let errorMessage: string;
        const amount = (event.target.validity.valid || event.target.value === '') ? event.target.value : this.state.storyForm.Age;
        if (event.target.value === "") {
            errorMessage = 'Age required'
        } else if (!event.target.validity.valid) {
            errorMessage = "Only number are allowed";
        } else {
            errorMessage = "";
        }
        this.setState({
            storyForm: { ...this.state.storyForm, [event.target.name]: amount },
            storyFormErr: { ...this.state.storyFormErr, [event.target.name + 'Err']: errorMessage }
        });
    }


    public render(): JSX.Element {
        return (
            <>
                {this.state.isLoading && <Loading />}
                <Dialog
                    hidden={!this.state.showStoryForm}
                    onDismiss={this._hideStoryForm}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: "Share your experience",
                        closeButtonAriaLabel: 'Close',
                        showCloseButton: true,
                    }}

                    modalProps={{
                        styles: { main: { maxWidth: 450 } },
                        containerClassName: "register-form-dialog",
                        onDismissed: this._hideStoryForm,
                        isBlocking: true
                    }}
                >
                    <TextField label="Name" name="Name"
                        errorMessage={this.state.storyFormErr.NameErr}
                        value={this.state.storyForm.Name}
                        onChange={(event: any) => this._inputChangeHandle(event)}
                        required />
                    <div className="ms-Grid sp-no-pm" dir="ltr">
                        <div className="ms-Grid-row" >
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6" >
                                <TextField label="Age" name="Age"
                                    errorMessage={this.state.storyFormErr.AgeErr}
                                    value={this.state.storyForm.Age}
                                    pattern="[0-9]*"
                                    onChange={(event: any) => this._ageChangeHandle(event)}
                                    required />
                            </div>
                            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6" >

                                <Dropdown
                                    style={{ width: "100%" }}
                                    label="Suffering from?"
                                    required
                                    className="dropdown-fileType"
                                    placeholder="Select file type"
                                    options={CategoryOptions}
                                    multiSelect={true}
                                    defaultSelectedKeys={this.state.storyForm.Diceases}
                                    // selectedKeys={this.state.newsForm.Category}
                                    errorMessage={this.state.storyFormErr.DiceasesErr}
                                    onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._onCategoryChange(option)}
                                />
                            </div>
                        </div>
                    </div>

                    <TextField label="What symptoms you observed?" name="Symptoms"
                        errorMessage={this.state.storyFormErr.SymptomsErr}
                        value={this.state.storyForm.Symptoms}
                        multiline={true}
                        rows={2}
                        onChange={(event: any) => this._inputChangeHandle(event)}
                        required />
                    <TextField label="What treatment have you taken or taking?" name="Treatment"
                        errorMessage={this.state.storyFormErr.TreatmentErr}
                        value={this.state.storyForm.Treatment}
                        onChange={(event: any) => this._inputChangeHandle(event)}
                        required
                        multiline={true}
                        rows={2}
                    />
                    <TextField label="More to Say?" name="MoreToSay"
                        errorMessage={this.state.storyFormErr.MoreToSayErr}
                        value={this.state.storyForm.MoreToSay}
                        onChange={(event: any) => this._inputChangeHandle(event)}
                        multiline={true}
                        rows={2}
                        required />

                    <div className="" >
                        {this.filesUploadedBindingInfo(this.state.uploadedFilesInfo)}
                        <p className="sp-danger">{this.state.storyFormErr.FilesErr}</p>
                    </div>
                    <FileUpload id="composeC12"
                        multiple={true}
                        onProgress={this._onProgress}
                        Reset={this.state.Reset}
                        afterFilesUploaded={this._afterFilesUploaded} />
                    <DefaultButton onClick={this._submitForm} className="sp-main-btn sp-float-right btn-register" text="Post" />
                </Dialog>
                <div className="compose-c">
                    <div className="sp-compose-body">
                        <p className="txt-heading">Would you like to share your Experience</p>
                        <div className="ms-Grid sp-no-pm" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm1">
                                    <img className="p-pic" src={`http://localhost:7777${this.props.User.User && this.props.User.User.imagePath ? this.props.User.User.imagePath : ''}`} />
                                </div>
                                <div className="ms-Grid-col ms-sm11">
                                    <p className="text-box" onClick={() => { this.setState({ showStoryForm: true }) }}>Share your Experience</p>
                                </div>
                            </div>
                        </div>
                        <div className="sp-clearFix"> </div>
                    </div>
                </div>
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
    mapStateToProps,
)(CreateStory);