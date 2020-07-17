import * as React from "react";
import FileUpload from '../../../common/fileUpload';
import { IFileInfo, FileInfo, BasicUserInfo, IDialogPropss } from '../../../../models/models';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Service from '../../Service';
import { DefaultButton, Callout } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import AuthService from '../../../../services/authService';
import Loading from "../../../common/Loading";
import { IUserState } from "../../../../Redux/models";
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import './styles.scss';
import Common from "../../../common";
const ShowMoreText = require('react-show-more-text');

interface IComposeNewsForm {
    Title: string;
    Description: string;
    User: any;
    Files: IFileInfo[];
}

interface IComposeNewsFormError {
    TitleErr: string;
    DescriptionErr: string;
    FilesErr: string;
}

interface IState {
    uploadedFilesInfo: any;
    composeNewsForm: IComposeNewsForm;
    composeNewsFormErr: IComposeNewsFormError;
    Reset: boolean;
    DialogProps: IDialogPropss;
    isLoading: boolean;
    isShowInfoPanel: boolean;
}

interface IProps {
    User: IUserState;
}

class ComposeNews extends React.Component<IProps, IState> {
    private service: Service;
    private _menuButtonElement = React.createRef<HTMLImageElement>();
    private authservice: AuthService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            uploadedFilesInfo: [],
            composeNewsForm: { Title: '', Description: '', User: '', Files: [] },
            composeNewsFormErr: { TitleErr: '', DescriptionErr: '', FilesErr: '' },
            Reset: false,
            DialogProps: { show: false, message: '' },
            isLoading: false,
            isShowInfoPanel: false
        }
        this._afterFilesUploaded = this._afterFilesUploaded.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._inputChangeHandle = this._inputChangeHandle.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._removefile = this._removefile.bind(this);
        this._onCalloutDismiss = this._onCalloutDismiss.bind(this);
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
            composeNewsForm: { ...this.state.composeNewsForm, [event.target.name]: event.target.value },
        });
    }

    private isFormValid(): boolean {
        let newsForm: IComposeNewsForm = this.state.composeNewsForm;
        let errormsgs: IComposeNewsFormError = this.state.composeNewsFormErr;
        let uploadedFilesInfo = this.state.uploadedFilesInfo;
        let isFormValid: boolean = true;

        if (newsForm.Title === "") {
            errormsgs.TitleErr = this.props.User.staticConstants.Constants.required;
            isFormValid = false;
        } else {
            errormsgs.TitleErr = "";
        }

        if (uploadedFilesInfo.length > 0) {
            for (let i = 0; i < uploadedFilesInfo.length; i++) {
                if (!uploadedFilesInfo[i].response) {
                    errormsgs.FilesErr = this.props.User.staticConstants.Constants.fileUploadWarning;
                    isFormValid = false;
                } else {
                    errormsgs.FilesErr = '';
                }
            }
        }
        this.setState({
            composeNewsFormErr: errormsgs
        });

        setTimeout(() => {
            this.setState((prevState: IState) => {
                return {
                    composeNewsFormErr: { ...prevState.composeNewsFormErr, FilesErr: '' },
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
            let formData: IComposeNewsForm = this.state.composeNewsForm;
            let FileUploadedResponse: IFileInfo[] = [];
            for (let i = 0; i < uploadedFilesInfo.length; i++) {
                if (uploadedFilesInfo[i].response) {
                    FileUploadedResponse = [...FileUploadedResponse,
                    new FileInfo(uploadedFilesInfo[i].response)]
                }
            }

            let userInfo = this.authservice.isLoggedIn();
            formData = {
                ...formData,
                Files: FileUploadedResponse,
                User: (userInfo ? new BasicUserInfo(userInfo) : null)
            };
            formData.Title = formData.Title.trim();
            formData.Description = formData.Description.trim();
            this.setState({ isLoading: true });
            this.service.createNews(formData).then((res) => {
                if (res.status === true) {
                    this.setState({
                        uploadedFilesInfo: [],
                        composeNewsForm: { Title: '', Description: '', Files: [], User: '' },
                        composeNewsFormErr: { TitleErr: '', DescriptionErr: '', FilesErr: '' },
                        Reset: true,
                        DialogProps: { show: true, message: this.props.User.staticConstants.Constants.newsSent },
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


    public render(): JSX.Element {
        return (
            <>
                {this.state.isLoading && <Loading />}
                <div className="compose-c">
                    <div className="sp-compose-body">
                        <TextField label={this.props.User.staticConstants.Constants.title}
                            placeholder={this.props.User.staticConstants.Constants.enterTitle}
                            name="Title"
                            errorMessage={this.state.composeNewsFormErr.TitleErr}
                            value={this.state.composeNewsForm.Title}
                            onChange={(event: any) => this._inputChangeHandle(event)}
                            required />
                        <TextField label={this.props.User.staticConstants.Constants.descripiton}
                            multiline={true}
                            rows={6}
                            placeholder={this.props.User.staticConstants.Constants.enterNewsDescription}
                            name="Description"
                            errorMessage={this.state.composeNewsFormErr.DescriptionErr}
                            value={this.state.composeNewsForm.Description}
                            onChange={(event: any) => this._inputChangeHandle(event)}
                        />
                        <div className="sp-clearFix"> </div>
                        <div className="" >
                            {this.filesUploadedBindingInfo(this.state.uploadedFilesInfo)}
                            <p className="sp-danger">{this.state.composeNewsFormErr.FilesErr}</p>
                        </div>
                    </div>
                    <div className={`sp-compose-footer`} >
                        <i className="ms-Icon ms-Icon--Info sp-icon" onClick={() => this.setState({ isShowInfoPanel: true })} ref={this._menuButtonElement} aria-hidden="true"></i>
                        {this.state.isShowInfoPanel && (
                            <Callout
                                role="alertdialog"
                                gapSpace={0}
                                target={this._menuButtonElement.current}
                                onDismiss={this._onCalloutDismiss}
                                setInitialFocus={true}
                                isBeakVisible={true}
                            >
                                <div className="callout-wrap">
                                    <h4>{this.props.User.staticConstants.Constants.infoTitle}</h4>
                                    <ShowMoreText
                                        lines={103}
                                        more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                        anchorClass='show-more-link'
                                        expanded={false}
                                        keepNewLines={true}
                                    >
                                        {this.props.User.staticConstants.Constants.infoText}
                                    </ShowMoreText>
                                    <p>{this.props.User.staticConstants.Constants.newsText}</p>
                                    <p></p>
                                    <p></p>
                                </div>
                            </Callout>
                        )}
                        <div className="sp-float-right">
                            <FileUpload id="composeC12"
                                multiple={true}
                                onProgress={this._onProgress}
                                Reset={this.state.Reset}
                                afterFilesUploaded={this._afterFilesUploaded} />
                            <DefaultButton onClick={this._submitForm}
                                className="sp-btn-login btn-send"
                                text={this.props.User.staticConstants.Constants.send} />
                        </div>
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
)(ComposeNews);