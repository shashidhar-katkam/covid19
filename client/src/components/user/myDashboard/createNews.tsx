
import * as React from "react";
import {
    withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import { AppState } from '../../../Redux/app.store';
import { IUserState } from '../../../Redux/models';
import FileUpload from '../../common/fileUpload';
import '../styles.scss';
import { IAddFile, AddFile, IFileT, FileT, IDialogPropss } from '../../../models/models';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Service from '../Service';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { FileTypes2 } from '../../../constants/constants';
import Loading from "../../common/Loading";

const CategoryOptions: IChoiceGroupOption[] = [
    { key: 'news', text: 'News' },
    { key: 'info', text: 'Useful Info' },
    { key: 'article', text: 'Article' }
];

interface IUser {
    firstName: string,
    lastName: string,
    imagePath: string,
    _id: string;
}
interface ICreateNewsForm {
    Title: string;
    Description: string;
    Category: string;
    User: IUser;
    Files: IFileT[];
}

interface ICreateNewsFormError {
    TitleErr: string;
    DescriptionErr: string;
    CategoryErr: string;
}

interface IState {
    uploadedFilesInfo: any;
    newsForm: ICreateNewsForm;
    newsFormErr: ICreateNewsFormError;
    Reset: boolean;
    Files: IAddFile[];
    fileIndex: number;
    errorMessage: string;
    isShowAlertDialog: boolean;
    DialogProps: IDialogPropss;
    isLoading: boolean;
}

interface IProps {
    User: IUserState;
}

class CreateNews extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            uploadedFilesInfo: [],
            newsForm: { Title: '', Description: '', Files: [], Category: '', User: { _id: this.props.User.User._id, firstName: this.props.User.User.firstName, lastName: this.props.User.User.lastName, imagePath: this.props.User.User.imagePath } },
            newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '' },
            Reset: false,
            Files: [],
            fileIndex: 1,
            errorMessage: '',
            isShowAlertDialog: false,
            DialogProps: { show: false, message: '' },
            isLoading: false

        }
        this._afterFilesUploaded = this._afterFilesUploaded.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._titleChangeHandle = this._titleChangeHandle.bind(this);
        this._descriptionChangeHandle = this._descriptionChangeHandle.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._addFile = this._addFile.bind(this);
        this._textChangeHandle = this._textChangeHandle.bind(this);
        this._onCategoryChange = this._onCategoryChange.bind(this);
        this._onToggleChange = this._onToggleChange.bind(this);
        this._closeAlertDialog = this._closeAlertDialog.bind(this);
        this._removeFile = this._removeFile.bind(this);
        this._dropDownChangeHandle = this._dropDownChangeHandle.bind(this);
        this._removeF = this._removeF.bind(this);
        this.service = new Service();
    }

    private _afterFilesUploaded(files: any) {
        for (let i = 0; i < files.length; i++) {
            this.setState((prevState, prevProps) => ({
                uploadedFilesInfo: [...prevState.uploadedFilesInfo, files[i]]
            }));
        }
    }

    private _removeFile(fileInf: any) {
        let uploadedFiles: any[] = [];
        this.state.uploadedFilesInfo.forEach((fileInfo: any) => {
            if (fileInfo.name !== fileInf.name) {
                uploadedFiles = [...uploadedFiles, fileInfo];
                return fileInfo;
            }
        });
        this.setState({
            uploadedFilesInfo: uploadedFiles
        });
    }

    private _onProgress(filesInfo: any) {
        let tempFiles = this.state.uploadedFilesInfo;
        let added = false;
        if (tempFiles && tempFiles.length > 0) {
            for (let j = 0; j < tempFiles.length; j++) {
                if (tempFiles[j].name === filesInfo.name) {
                    tempFiles = tempFiles.map(
                        (file: any) => {
                            if (file.name === filesInfo.name) {
                                return file;
                            } else {
                                return file
                            }
                        });
                } else {
                    if (!added) {
                        if (tempFiles[j].name === filesInfo.name) {
                            tempFiles = tempFiles.map(
                                (file: any) => {
                                    if (file.name === filesInfo.name) {
                                        return file;
                                    } else {
                                        return file
                                    }
                                });
                        } else {
                            tempFiles = [...tempFiles, filesInfo];
                        }
                    }
                    added = true;
                }
            }
        } else {
            tempFiles = [...tempFiles, filesInfo];
        }

        this.setState((prevState: IState) => {
            return { uploadedFilesInfo: this.getUnique(tempFiles) }
        });

    }

    private getUnique(array: any) {
        var uniqueArray = [];
        if (array.length > 0) {
            for (let value of array) {
                if (uniqueArray.indexOf(value) === -1) {
                    uniqueArray.push(value);
                }
            }
        }
        return uniqueArray;
    }

    private _addFile() {
        this.setState((prevState: IState) => {
            return {
                Files: [...prevState.Files, new AddFile(prevState.fileIndex)],
                fileIndex: prevState.fileIndex + 1
            }
        });
    }

    private _titleChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = "Title is Required";
        } else {
            erorMessage = "";
        }
        this.setState({
            newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
            newsFormErr: { ...this.state.newsFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private _descriptionChangeHandle = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = "Description is Required";
        } else {
            erorMessage = "";
        }
        this.setState({
            newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
            newsFormErr: { ...this.state.newsFormErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private isFormValid = (): boolean => {
        let newsForm: ICreateNewsForm = this.state.newsForm;
        let errormsgs: ICreateNewsFormError = this.state.newsFormErr;
        let filesInfo = this.state.Files;
        let uploadedFilesInfo = this.state.uploadedFilesInfo;
        let isFormValid: boolean = true;
        if (newsForm.Title === "") {
            errormsgs.TitleErr = "Title is Required";
            isFormValid = false;
        } else {
            errormsgs.TitleErr = "";
        }

        if (newsForm.Description === "") {
            errormsgs.DescriptionErr = "Description is Required";
            isFormValid = false;
        } else {
            errormsgs.DescriptionErr = "";
        }

        if (newsForm.Category === "") {
            errormsgs.CategoryErr = "Category is Required";
            isFormValid = false;
        } else {
            errormsgs.CategoryErr = "";
        }

        if (filesInfo.length > 0) {
            for (let i = 0; i < filesInfo.length; i++) {
                if (filesInfo[i].fileNewName === "") {
                    isFormValid = false;
                    filesInfo[i].fileNewNameErr = "File name is required."
                }
                if (filesInfo[i].filePath === "") {
                    isFormValid = false;
                    filesInfo[i].filePathErr = "Url is required."
                }
                if (filesInfo[i].mimeType === "") {
                    isFormValid = false;
                    filesInfo[i].mimeTypeErr = "File type is required."
                }
            }
        }
        if (uploadedFilesInfo.length > 0) {
            for (let i = 0; i < uploadedFilesInfo.length; i++) {
                if (!uploadedFilesInfo[i].response) {
                    isFormValid = false;
                }
                else {
                }
            }
        }
        this.setState({
            newsFormErr: errormsgs,
            Files: filesInfo,
            errorMessage: isFormValid ? '' : 'Please Fill all the fields.'
        });
        setTimeout(() => {
            this.setState({
                errorMessage: ''
            });
        }, 3000);

        return isFormValid;
    }

    private _submitForm() {
        if (this.isFormValid()) {
            let files = this.state.Files;
            let eFormData = this.state.newsForm;
            let uploadedFilesInfo = this.state.uploadedFilesInfo;
            let filesInfo: IFileT[] = [];
            for (let i = 0; i < files.length; i++) {
                filesInfo = [...filesInfo, new FileT(files[i])]
            }
            if (uploadedFilesInfo.length > 0) {
                for (let i = 0; i < uploadedFilesInfo.length; i++) {
                    if (uploadedFilesInfo[i].response) {
                        filesInfo = [...filesInfo, new FileT(uploadedFilesInfo[i].response)]
                    }
                }
            }
            eFormData.Title = eFormData.Title.trim();
            eFormData.Description = eFormData.Description.trim();
            eFormData = { ...eFormData, Files: filesInfo };
            this.setState({ isLoading: true });
            this.service.createNewsBySelfAdmin(eFormData).then((res) => {
                if (res.status === true) {
                    this.setState({
                        uploadedFilesInfo: [],
                        newsForm: { Title: '', Description: '', Files: [], Category: '', User: { _id: this.props.User.User._id, firstName: this.props.User.User.firstName, lastName: this.props.User.User.lastName, imagePath: this.props.User.User.imagePath } },
                        newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '' },
                        Reset: true,
                        Files: [],
                        fileIndex: 1,
                        DialogProps: { show: true, message: res.message },
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
        let bindingData = filesInfo;
        temp = bindingData.map((fileInfo: any) => {
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
                                        {fileInfo.progress != 100 && <ProgressBar now={fileInfo.progress} label={fileInfo.progress} animated={true} />}
                                    </div>
                                    <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg1">
                                        <span className="btn-remove-file sp-float-right" onClick={() => this._removeFile(fileInfo)}> &times;</span>
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

    private _textChangeHandle(event: any, id: number) {
        let erorMessage: string;
        let inputControl = event.target;
        if (event.target.value === "") {
            erorMessage = `${inputControl.name} is required`;
        } else {
            erorMessage = "";
        }
        let files = this.state.Files.map((file: IAddFile) => {
            if (file.id === id) {
                return file = { ...file, [inputControl.name]: inputControl.value, [inputControl.name + 'Err']: erorMessage };
            } else {
                return file
            }
        });
        this.setState({
            Files: files
        });
    }

    private _dropDownChangeHandle(id: number, mimeType: string, option?: IDropdownOption) {
        let erorMessage: string;
        if (option) {
            if (option.key === "") {
                erorMessage = `${mimeType} is required`;
            } else {
                erorMessage = "";
            }
            let files = this.state.Files.map((file: IAddFile) => {
                if (file.id === id) {
                    return file = { ...file, [mimeType]: option.key, [mimeType + 'Err']: erorMessage };
                } else {
                    return file
                }
            });
            this.setState({
                Files: files
            });
        }
    }

    private _removeF(id: number) {
        let files = this.state.Files.filter(
            (file: IAddFile) => file.id !== id
        );
        this.setState((prevState: IState) => {
            return { Files: files };
        });
    }

    private _closeAlertDialog() {
        this.setState({
            DialogProps: { show: false, message: '' },
        });
    }

    private _onCategoryChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
        this.setState({
            newsForm: { ...this.state.newsForm, [field]: option.key },
        });
    }

    private _onToggleChange(field: string, isChecked?: boolean) {
        this.setState({
            newsForm: { ...this.state.newsForm, [field]: isChecked },
        });

    }

    render(): JSX.Element {
        return (
            <div className="ms-Grid" dir="ltr">
                {this.state.isLoading && <Loading />}
                <div className="ms-Grid-row" >
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                        <div >
                            <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormErr.TitleErr} value={this.state.newsForm.Title} onChange={(event: any) => this._titleChangeHandle(event)} required />
                            <TextField label="Description" multiline={true} rows={6} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormErr.DescriptionErr} value={this.state.newsForm.Description} onChange={(event: any) => this._descriptionChangeHandle(event)} required />
                            <ChoiceGroup selectedKey={this.state.newsForm.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onCategoryChange(ev, o, "Category")} label="Category" required={true} />
                            <span className="sp-danger">{this.state.newsFormErr.CategoryErr}</span>
                            <style>
                                {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                                `}
                            </style>
                            <div className="clearFix"> </div>

                        </div>
                        <div>
                            {
                                this.state.Files.length > 0 &&
                                < table >
                                    <thead>
                                        <tr>
                                            <th>File Type</th>
                                            <th>File URL</th>
                                            <th>File Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.Files.map((file: IAddFile) => {
                                                return <tr key={file.id}>
                                                    <td>
                                                        <Dropdown
                                                            className="dropdown-fileType"
                                                            placeholder="Select file type"
                                                            options={FileTypes2}
                                                            errorMessage={file.mimeTypeErr}
                                                            onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._dropDownChangeHandle(file.id, "mimeType", option)}
                                                        />
                                                    </td>
                                                    <td>  <TextField
                                                        placeholder="Enter file Url"
                                                        name="filePath"
                                                        errorMessage={file.filePathErr}
                                                        value={file.filePath}
                                                        onChange={(event: any) => this._textChangeHandle(event, file.id)}
                                                    />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            placeholder="Enter file name"
                                                            name="fileNewName"
                                                            errorMessage={file.fileNewNameErr}
                                                            value={file.fileNewName}
                                                            onChange={(event: any) => this._textChangeHandle(event, file.id)}
                                                        />
                                                    </td>

                                                    <td>
                                                        <p className="btn-remove-file" onClick={() => this._removeF(file.id)}>&times;</p>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            }
                            <div className="file-upload-wrapper">
                                {this.filesUploadedBindingInfo(this.state.uploadedFilesInfo)}
                            </div>
                            <div className="sp-clearFix"></div>
                            <p className="sp-danger sp-mt10">{this.state.errorMessage}</p>
                            <div className="sp-float-left sp-mt30">
                                <PrimaryButton className="sp-main-btn" onClick={this._submitForm} text="Create News" />
                                <span className="add-icon sp-ml10 sp-mt10" title="Add row" onClick={this._addFile} ><i className="ms-Icon ms-Icon--CirclePlus" aria-hidden="true"></i></span>
                                <FileUpload id="createNews" multiple={true} onProgress={this._onProgress} Reset={this.state.Reset} afterFilesUploaded={this._afterFilesUploaded}></FileUpload>
                            </div>
                        </div>
                    </div >
                </div >
                <Dialog
                    hidden={!this.state.DialogProps.show}
                    onDismiss={this._closeAlertDialog}
                    dialogContentProps={{
                        type: DialogType.normal,

                    }}
                    modalProps={{
                        styles: { main: { maxWidth: 450, textAlign: "center" } },
                        isBlocking: true
                    }}
                >
                    <p>{this.state.DialogProps.message}</p>
                    <DefaultButton className="sp-btn-login" onClick={this._closeAlertDialog} text="Ok" />
                </Dialog>
            </div >
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default withRouter(connect(
    mapStateToProps,
)(CreateNews));