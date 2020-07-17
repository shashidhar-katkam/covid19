
import * as React from "react";
import {
    withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import { AppState } from '../../../Redux/app.store';
import { IUserState } from '../../../Redux/models';
import FileUpload from '../../common/fileUpload';
import '../styles.scss';
import { IAddFile, AddFile, IFileT, FileT, IDialogPropss, FileT1, IFileAndUser, FileType, Type, TypeOptions } from '../../../models/models';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Service from '../service';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { FileTypes2, CategoryOptions } from '../../../constants/constants';
import { Toggle } from "office-ui-fabric-react";
import Loading from "../../common/Loading";
import FileSelect from "../../common/FileSelect";



// const FileTypes2: IDropdownOption[] =
//     [
//         { key: FileType.othersImage, text: FileType.othersImage },
//         { key: FileType.youtube, text: FileType.youtube },
//         { key: FileType.facebook, text: FileType.facebook },
//     ];


interface IUser {
    firstName: string,
    lastName: string,
    imagePath: string,
    _id: string;
}
interface ICreateNewsForm {
    Title: string;
    Description: string;
    Source: string;
    Category: string[];
    IsHeadlines: boolean;
    IsTopTen: boolean;
    User: IUser;
    Files: IFileT[];
    Type: number;
    Analysis1: string;
    Analysis2: string;
    Analysis3: string;
}

interface ICreateNewsFormError {
    TitleErr: string;
    DescriptionErr: string;
    CategoryErr: string;
    FilesErr: string;
    TypeErr: string;
}

interface IPollOptions {
    Option1: string;
    Option2: string;
    Option3: string;
    Option4: string;
}

interface IState {
    uploadedFilesInfo: any;
    newsForm: ICreateNewsForm;
    newsFormErr: ICreateNewsFormError;
    newsFormTelugu: ICreateNewsForm;
    newsFormTeluguErr: ICreateNewsFormError;
    Reset: boolean;
    Files: IAddFile[];
    DialogProps: IDialogPropss;
    fileIndex: number;
    isShowFileSelectionModel: boolean;
    errorMessage: string;
    isLoading: boolean;
    isShowAlertDialog: boolean;
    ImportedFiles: IFileAndUser[];
    type: string;
    pollOptions: IPollOptions;
    pollOptionsTelugu: IPollOptions;
    PollErr: string;
    PollTeluguErr: string;
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
            PollErr: '',
            PollTeluguErr: '',
            pollOptions: { Option1: '', Option2: '', Option3: '', Option4: '' },
            pollOptionsTelugu: { Option1: '', Option2: '', Option3: '', Option4: '' },
            newsForm: {
                Title: '',
                Description: '',
                Source: '',
                IsHeadlines: false,
                IsTopTen: false,
                Files: [],
                Category: [],
                User: {
                    _id: this.props.User.User._id,
                    firstName: this.props.User.User.firstName,
                    lastName: this.props.User.User.lastName,
                    imagePath: this.props.User.User.imagePath
                },
                Type: 0,
                Analysis1: '',
                Analysis2: '',
                Analysis3: ''
            },
            newsFormErr: {
                TitleErr: '',
                DescriptionErr: '',
                CategoryErr: '',
                FilesErr: '',
                TypeErr: ''
            },
            newsFormTelugu: {
                Title: '',
                Description: '',
                Source: '',
                IsHeadlines: false,
                IsTopTen: false,
                Files: [],
                Category: [],
                User: {
                    _id: this.props.User.User._id,
                    firstName: this.props.User.User.firstName,
                    lastName: this.props.User.User.lastName,
                    imagePath: this.props.User.User.imagePath
                },
                Type: 0,
                Analysis1: '',
                Analysis2: '',
                Analysis3: ''
            },
            newsFormTeluguErr: {
                TitleErr: '',
                DescriptionErr: '',
                CategoryErr: '',
                FilesErr: '',
                TypeErr: ''
            },
            Reset: false,
            Files: [],
            fileIndex: 1,
            isShowFileSelectionModel: false,
            errorMessage: '',
            DialogProps: { show: false, message: '' },
            isShowAlertDialog: false,
            isLoading: false,
            ImportedFiles: [],
            type: ''
        }
        this._afterFilesUploaded = this._afterFilesUploaded.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._titleChangeHandle = this._titleChangeHandle.bind(this);
        this._descriptionChangeHandle = this._descriptionChangeHandle.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._addFile = this._addFile.bind(this);
        this._textChangeHandle = this._textChangeHandle.bind(this);
        this._onCategoryChange = this._onCategoryChange.bind(this);
        this._showModel = this._showModel.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._onToggleChange = this._onToggleChange.bind(this);
        this._onTeluguToggleChange = this._onTeluguToggleChange.bind(this);
        this._onTeluguCategoryChange = this._onTeluguCategoryChange.bind(this);
        this._teluguTitleChangeHandle = this._teluguTitleChangeHandle.bind(this);
        this._teluguDescriptionChangeHandle = this._teluguDescriptionChangeHandle.bind(this);
        this._closeAlertDialog = this._closeAlertDialog.bind(this);
        this._removeFile = this._removeFile.bind(this);
        this._dropDownChangeHandle = this._dropDownChangeHandle.bind(this);
        this._removeF = this._removeF.bind(this);
        this._afterSelectionFilesCancel = this._afterSelectionFilesCancel.bind(this);
        this._afterFilesSelected = this._afterFilesSelected.bind(this);
        this._removeFileFromImported = this._removeFileFromImported.bind(this);
        this._sourceChangeHande = this._sourceChangeHande.bind(this);
        this._teluguSourceChangeHande = this._teluguSourceChangeHande.bind(this);
        this._onTypeChange = this._onTypeChange.bind(this);
        this._pollInputChangeHandle = this._pollInputChangeHandle.bind(this);
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
            }
        });
        this.setState({
            uploadedFilesInfo: uploadedFiles
        });
    }

    private _afterFilesSelected(importedFiles: IFileAndUser[]) {
        let importedF = this.state.ImportedFiles;
        importedFiles.forEach((file: IFileAndUser) => {
            let found = false;
            if (importedF.length > 0) {
                importedF.forEach((file1: IFileAndUser) => {
                    if (!found) {
                        if (file1._id === file._id) {
                            found = true;
                        }
                    }
                });
                if (!found) {
                    importedF = [...importedF, file];
                }
            } else {
                importedF = [...importedF, file];
            }
        });
        this.setState({
            ImportedFiles: importedF,
            isShowFileSelectionModel: false
        });
    }

    private _removeFileFromImported(id: string) {
        let files = this.state.ImportedFiles.filter(
            (file: IFileAndUser) => file._id !== id
        );
        this.setState((prevState: IState) => {
            return {
                ImportedFiles: files,
            };
        });
    }

    private _afterSelectionFilesCancel() {
        this.setState({
            isShowFileSelectionModel: false
        });
    }

    private _onProgress(filesInfo: any) {
        let tempFiles = this.state.uploadedFilesInfo;
        let added = false;
        if (tempFiles.length > 0) {
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

    private _sourceChangeHande = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value }
        });
    }

    private _teluguSourceChangeHande = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            newsFormTelugu: { ...this.state.newsFormTelugu, [event.target.name]: event.target.value }
        });
    }

    private _descriptionChangeHandle = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({
            newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
        });
    }

    private _teluguTitleChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let erorMessage: string;
        if (event.target.value === "") {
            erorMessage = "Title is Required";
        } else {
            erorMessage = "";
        }
        this.setState({
            newsFormTelugu: { ...this.state.newsFormTelugu, [event.target.name]: event.target.value },
            newsFormTeluguErr: { ...this.state.newsFormTeluguErr, [event.target.name + 'Err']: erorMessage }
        });
    }

    private _teluguDescriptionChangeHandle = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({
            newsFormTelugu: { ...this.state.newsFormTelugu, [event.target.name]: event.target.value },
        });
    }

    private isFormValid = (): boolean => {
        let newsForm: ICreateNewsForm = this.state.newsForm;
        let errormsgs: ICreateNewsFormError = this.state.newsFormErr;
        let newsFormTelugu: ICreateNewsForm = this.state.newsFormTelugu;
        let newsFormTeluguErr: ICreateNewsFormError = this.state.newsFormTeluguErr;
        let filesInfo = this.state.Files;
        let uploadedFilesInfo = this.state.uploadedFilesInfo;
        let isFormValid: boolean = true;

        if (newsForm.Title === "") {
            errormsgs.TitleErr = "Title is Required";
            isFormValid = false;
        } else {
            errormsgs.TitleErr = "";
        }

        if (newsForm.Category.length === 0) {
            errormsgs.CategoryErr = "Category is Required";
            isFormValid = false;
        } else {
            errormsgs.CategoryErr = "";
        }
        if (newsForm.Type === 0) {
            errormsgs.TypeErr = "Type is Required";
            isFormValid = false;
        } else {
            errormsgs.TypeErr = "";
        }

        if (newsFormTelugu.Title === "") {
            newsFormTeluguErr.TitleErr = "Title is Required";
            isFormValid = false;
        } else {
            newsFormTeluguErr.TitleErr = "";
        }

        if (newsFormTelugu.Category.length === 0) {
            newsFormTeluguErr.CategoryErr = "Category is Required";
            isFormValid = false;
        } else {
            newsFormTeluguErr.CategoryErr = "";
        }

        if (this.state.type === 'poll') {
            if (this.state.pollOptions.Option1 === '' || this.state.pollOptions.Option2 === '') {
                isFormValid = false
                this.setState({
                    PollErr: 'Atleast enter two options.'
                });
            }

            if (this.state.pollOptions.Option1 === '' || this.state.pollOptions.Option2 === '') {
                isFormValid = false
                this.setState({
                    PollTeluguErr: 'Atleast enter two options.'
                });
            }
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
                    errormsgs.FilesErr = 'Please wait until files are uploaded.'
                    isFormValid = false;
                } else {
                    errormsgs.FilesErr = '';
                }
            }
        }


        this.setState({
            newsFormErr: errormsgs,
            Files: filesInfo,
            newsFormTeluguErr: newsFormTeluguErr,
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
            let tFormData = this.state.newsFormTelugu;
            let uploadedFilesInfo = this.state.uploadedFilesInfo;
            let importedFiles = this.state.ImportedFiles;
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

            if (importedFiles.length > 0) {
                for (let i = 0; i < importedFiles.length; i++) {
                    filesInfo = [...filesInfo, new FileT1(importedFiles[i])]
                }
            }

            eFormData = { ...eFormData, Files: filesInfo };
            tFormData = { ...tFormData, Files: filesInfo };
            eFormData.Title = eFormData.Title.trim();
            eFormData.Description = eFormData.Description.trim();
            eFormData.Analysis1 = eFormData.Analysis1.trim();
            eFormData.Analysis2 = eFormData.Analysis2.trim();
            eFormData.Analysis3 = eFormData.Analysis3.trim();

            tFormData.Title = tFormData.Title.trim();
            tFormData.Description = tFormData.Description.trim();
            tFormData.Analysis1 = tFormData.Analysis1.trim();
            tFormData.Analysis2 = tFormData.Analysis2.trim();
            tFormData.Analysis3 = tFormData.Analysis3.trim();

            this.setState({
                isLoading: true
            });
            let saveInfo: any = { English: eFormData, Telugu: tFormData };

            if (this.state.type === 'poll') {
                let pollOptions: any = {};
                if (this.state.pollOptions.Option1 !== '') {
                    pollOptions.Option1 = this.state.pollOptions.Option1;
                }
                if (this.state.pollOptions.Option2 !== '') {
                    pollOptions.Option2 = this.state.pollOptions.Option2;
                }
                if (this.state.pollOptions.Option3 !== '') {
                    pollOptions.Option3 = this.state.pollOptions.Option3;
                }
                if (this.state.pollOptions.Option4 !== '') {
                    pollOptions.Option4 = this.state.pollOptions.Option4;
                }
                if (this.state.pollOptionsTelugu.Option1 !== '') {
                    pollOptions.Option1T = this.state.pollOptionsTelugu.Option1;
                }
                if (this.state.pollOptionsTelugu.Option2 !== '') {
                    pollOptions.Option2T = this.state.pollOptionsTelugu.Option2;
                }
                if (this.state.pollOptionsTelugu.Option3 !== '') {
                    pollOptions.Option3T = this.state.pollOptionsTelugu.Option3;
                }
                if (this.state.pollOptionsTelugu.Option4 !== '') {
                    pollOptions.Option4T = this.state.pollOptionsTelugu.Option4;
                }
                saveInfo.pollOptions = pollOptions;
                saveInfo.isPoll = true;
            }

            this.service.createNews(saveInfo).then((res) => {
                if (res.status) {
                    this.setState({
                        uploadedFilesInfo: [],
                        newsForm: {
                            Title: '', Description: '', Source: '', IsHeadlines: false, IsTopTen: false, Type: 0, Files: [], Category: [], User: { _id: this.props.User.User._id, firstName: this.props.User.User.firstName, lastName: this.props.User.User.lastName, imagePath: this.props.User.User.imagePath }, Analysis1: '',
                            Analysis2: '',
                            Analysis3: ''
                        },
                        newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', FilesErr: '', TypeErr: '' },
                        newsFormTelugu: {
                            Title: '', Description: '', Source: '', IsHeadlines: false, IsTopTen: false, Type: 0, Files: [], Category: [], User: { _id: this.props.User.User._id, firstName: this.props.User.User.firstName, lastName: this.props.User.User.lastName, imagePath: this.props.User.User.imagePath }, Analysis1: '',
                            Analysis2: '',
                            Analysis3: ''
                        },
                        newsFormTeluguErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', FilesErr: '', TypeErr: '' },
                        Reset: true,
                        Files: [],
                        ImportedFiles: [],
                        fileIndex: 1,
                        isLoading: false,
                        DialogProps: { show: true, message: res.message },
                        type: ''
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

    private _showModel() {
        this.setState({
            isShowFileSelectionModel: true
        });
    }

    private _closeDialog() {
        this.setState({
            isShowFileSelectionModel: false
        });
    }

    private _closeAlertDialog() {
        this.setState({
            DialogProps: { show: false, message: '' },
        });
    }

    private _onCategoryChange(id: number, mimeType: string, option?: IDropdownOption) {
        let erorMessage: string;
        if (option) {
            let catergory = this.state.newsForm.Category;
            if (option.selected) {
                catergory.push(option.key.toString());
            } else {
                let files = this.state.newsForm.Category.filter(
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
                newsForm: { ...this.state.newsForm, Category: catergory },
                newsFormErr: { ...this.state.newsFormErr, CategoryErr: erorMessage },
            });
        }
    }

    private _onToggleChange(field: string, isChecked?: boolean) {
        this.setState({
            newsForm: { ...this.state.newsForm, [field]: isChecked },
            newsFormTelugu: { ...this.state.newsFormTelugu, [field]: isChecked },
        });
    }

    private _pollInputChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            pollOptions: { ...this.state.pollOptions, [event.target.name]: event.target.value },
        });
    }

    private _pollInputTeluguChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            pollOptionsTelugu: { ...this.state.pollOptionsTelugu, [event.target.name]: event.target.value },
        });
    }

    _onTypeChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
        let erorMessage: string;
        if (option) {
            if (option.key === 'comments') {
                this.setState({
                    newsForm: { ...this.state.newsForm, Type: Type.Comments },
                    newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.Comments },
                    type: option.key,
                    newsFormErr: { ...this.state.newsFormErr, TypeErr: '' },
                    newsFormTeluguErr: { ...this.state.newsFormTeluguErr, TypeErr: '' }

                });
            } else if (option.key === 'poll') {
                this.setState({
                    newsForm: { ...this.state.newsForm, Type: Type.Polls },
                    newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.Polls },
                    type: option.key,
                    newsFormErr: { ...this.state.newsFormErr, TypeErr: '' },
                    newsFormTeluguErr: { ...this.state.newsFormTeluguErr, TypeErr: '' }
                });
            } else if (option.key === 'questions') {
                this.setState({
                    newsForm: { ...this.state.newsForm, Type: Type.Questions },
                    newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.Questions },
                    type: option.key,
                    newsFormErr: { ...this.state.newsFormErr, TypeErr: '' },
                    newsFormTeluguErr: { ...this.state.newsFormTeluguErr, TypeErr: '' }
                });
            } else {
                this.setState({
                    newsForm: { ...this.state.newsForm, Type: Type.None },
                    newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.None },
                    type: option.key,
                    newsFormErr: { ...this.state.newsFormErr, TypeErr: '' },
                    newsFormTeluguErr: { ...this.state.newsFormTeluguErr, TypeErr: '' }
                });
            }
        }
    }

    private _onTeluguCategoryChange(id: number, mimeType: string, option?: IDropdownOption) {
        let erorMessage: string;
        if (option) {
            let catergory = this.state.newsFormTelugu.Category;
            if (option.selected) {
                catergory.push(option.key.toString());
            } else {
                let files = this.state.newsFormTelugu.Category.filter(
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
                newsFormTelugu: { ...this.state.newsFormTelugu, Category: catergory },
                newsFormTeluguErr: { ...this.state.newsFormTeluguErr, CategoryErr: erorMessage }
            });
        }
    }

    private _onTeluguToggleChange(field: string, isChecked?: boolean) {
        this.setState({
            newsFormTelugu: { ...this.state.newsFormTelugu, [field]: isChecked },
        });
    }

    render(): JSX.Element {
        return (
            <div className="ms-Grid create-news" dir="ltr">
                {this.state.isLoading && <Loading />}
                <div className="ms-Grid-row" >
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                        <div >
                            <h4>English</h4>
                            <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormErr.TitleErr} value={this.state.newsForm.Title} onChange={(event: any) => this._titleChangeHandle(event)} required />
                            <TextField label="Description" multiline={true} rows={6} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormErr.DescriptionErr} value={this.state.newsForm.Description} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                            <TextField label="Analysis 1" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis1" value={this.state.newsForm.Analysis1} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                            <TextField label="Analysis 2" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis2" value={this.state.newsForm.Analysis2} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                            <TextField label="Analysis 3" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis3" value={this.state.newsForm.Analysis3} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                            <TextField label="Source" placeholder="Link" name="Source" value={this.state.newsForm.Source} onChange={(event: any) => this._sourceChangeHande(event)} />
                            <Dropdown
                                label="Category"
                                required
                                className="dropdown-fileType"
                                placeholder="Select file type"
                                options={CategoryOptions}
                                multiSelect={true}

                                defaultSelectedKeys={this.state.newsForm.Category}
                                // selectedKeys={this.state.newsForm.Category}
                                errorMessage={this.state.newsFormErr.CategoryErr}
                                onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._onCategoryChange(1, "Category", option)}
                            />
                            {/* <ChoiceGroup selectedKey={this.state.newsForm.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onCategoryChange(ev, o, "Category")} label="Category" required={true} /> */}
                            {/* <span className="sp-danger">{this.state.newsFormErr.CategoryErr}</span> */}
                            <Toggle label="Is Top News" checked={this.state.newsForm.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsTopTen", checked)} />
                            <Toggle label="Is Headlines" checked={this.state.newsForm.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsHeadlines", checked)} />
                            {/* <Toggle label="Comments" checked={this.state.newsForm.IsCommentsOn} onText="On" offText="Off" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsCommentsOn", checked)} /> */}
                            <ChoiceGroup selectedKey={this.state.type} options={TypeOptions} onChange={(ev: any, o: any) => this._onTypeChange(ev, o, "Type")} label="Type" required={true} />
                            <p className="sp-danger sp-no-pm">{this.state.newsFormErr.TypeErr}</p>
                            {this.state.type === 'poll' &&
                                <div>
                                    <TextField label="Poll option 1" placeholder="" name="Option1" value={this.state.pollOptions.Option1} onChange={(event: any) => this._pollInputChangeHandle(event)} required />
                                    <TextField label="Poll option 2" placeholder="" name="Option2" value={this.state.pollOptions.Option2} onChange={(event: any) => this._pollInputChangeHandle(event)} required />
                                    <TextField label="Poll option 3" placeholder="" name="Option3" value={this.state.pollOptions.Option3} onChange={(event: any) => this._pollInputChangeHandle(event)} />
                                    <TextField label="Poll option 4" placeholder="" name="Option4" value={this.state.pollOptions.Option4} onChange={(event: any) => this._pollInputChangeHandle(event)} />
                                    <span className="sp-danger">{this.state.PollErr}</span>
                                </div>
                            }
                            <style>
                                {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                               button.pill-109 {
    background: rgb(255, 133, 51) !important;
                     }
                     button.pill-109:hover {
                      background:#FF751A !important;
                                       }
                     
                     `  }
                            </style>
                            <div className="clearFix"> </div>
                        </div>
                        <div>
                            {this.state.ImportedFiles.length > 0 && < table >
                                <thead>
                                    <tr>
                                        <th>Imported Files</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.ImportedFiles.map((file: IFileAndUser) => {
                                        return <tr key={file._id}>
                                            <td>
                                                {(file.mimeType === FileType.facebook || file.mimeType === FileType.othersImage || file.mimeType === FileType.youtube) ?
                                                    <a className="sp-ml10" href={file.filePath} target="_blank" rel="noopener noreferrer" >click here</a>
                                                    : <a className="sp-ml10" href={`http://localhost:7777/${file.filePath}`} target="_blank" rel="noopener noreferrer" >click here</a>}
                                            </td>
                                            <td>
                                                <p className="btn-remove-file" onClick={() => this._removeFileFromImported(file._id)}>&times;</p>
                                            </td>
                                        </tr>

                                    })}
                                </tbody>
                            </ table>
                            }
                            {
                                this.state.Files.length > 0 &&
                                < table >
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>File URL</th>
                                            <th>File Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.Files.map((file: IAddFile) => {
                                                return <tr key={file.id}>
                                                    <td>
                                                        <TextField
                                                            placeholder="Enter file name"
                                                            name="fileNewName"
                                                            errorMessage={file.fileNewNameErr}
                                                            value={file.fileNewName}
                                                            onChange={(event: any) => this._textChangeHandle(event, file.id)}
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
                                                        <Dropdown
                                                            className="dropdown-fileType"
                                                            placeholder="Select file type"
                                                            options={FileTypes2}
                                                            errorMessage={file.mimeTypeErr}
                                                            onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._dropDownChangeHandle(file.id, "mimeType", option)}
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
                                <p className="sp-danger">{this.state.newsFormErr.FilesErr}</p>
                            </div>
                            <div className="sp-clearFix"></div>
                            <p className="sp-danger sp-mt10">{this.state.errorMessage}</p>
                            <div className="sp-float-left sp-mt30">
                                <PrimaryButton className="sp-main-btn" onClick={this._submitForm} text="Create News" />
                                <span className="add-icon sp-ml10 sp-mt10" title="Add row" onClick={this._addFile} ><i className="ms-Icon ms-Icon--CirclePlus" aria-hidden="true"></i></span>
                                <FileUpload multiple={true} id="createNews sp-ml10" onProgress={this._onProgress} Reset={this.state.Reset} afterFilesUploaded={this._afterFilesUploaded}></FileUpload>
                                <span className="add-icon" title="Select from Uploads" onClick={this._showModel} ><i className="ms-Icon ms-Icon--LaptopSelected" aria-hidden="true"></i></span>
                            </div>
                            {this.state.isShowFileSelectionModel && <FileSelect afterFilesSelected={this._afterFilesSelected} afterSelectionFilesCancel={this._afterSelectionFilesCancel} />}
                        </div>
                    </div >
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                        <div >
                            <h4>Telugu</h4>
                            <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormTeluguErr.TitleErr} value={this.state.newsFormTelugu.Title} onChange={(event: any) => this._teluguTitleChangeHandle(event)} required />
                            <TextField label="Description" multiline={true} rows={6} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormTeluguErr.DescriptionErr} value={this.state.newsFormTelugu.Description} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                            <TextField label="Analysis 1" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis1" value={this.state.newsFormTelugu.Analysis1} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                            <TextField label="Analysis 2" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis2" value={this.state.newsFormTelugu.Analysis2} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                            <TextField label="Analysis 3" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis3" value={this.state.newsFormTelugu.Analysis3} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                            <TextField label="Source" placeholder="Link" name="Source" value={this.state.newsFormTelugu.Source} onChange={(event: any) => this._teluguSourceChangeHande(event)} />
                            <Dropdown
                                label="Category"
                                required
                                className="dropdown-fileType"
                                placeholder="--Category--"
                                options={CategoryOptions}
                                multiSelect={true}
                                defaultSelectedKeys={this.state.newsFormTelugu.Category}
                                //   selectedKeys={this.state.newsFormTelugu.Category}
                                errorMessage={this.state.newsFormTeluguErr.CategoryErr}
                                onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._onTeluguCategoryChange(1, "Category", option)}
                            />


                            {/* <ChoiceGroup selectedKey={this.state.newsFormTelugu.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onTeluguCategoryChange(ev, o, "Category")} label="Category" required={true} />
                            <span className="sp-danger">{this.state.newsFormTeluguErr.CategoryErr}</span> */}
                            <Toggle label="Is Top News" checked={this.state.newsFormTelugu.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsTopTen", checked)} />
                            <Toggle label="Is Headlines" checked={this.state.newsFormTelugu.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsHeadlines", checked)} />
                            {/* <Toggle label="Comments" checked={this.state.newsFormTelugu.IsCommentsOn} onText="On" offText="Off" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsCommentsOn", checked)} /> */}

                            <ChoiceGroup selectedKey={this.state.type} options={TypeOptions} onChange={(ev: any, o: any) => this._onTypeChange(ev, o, "Type")} label="Type" required={true} />
                            <p className="sp-danger sp-no-pm">{this.state.newsFormTeluguErr.TypeErr}</p>
                            {this.state.type === 'poll' &&
                                <div>
                                    <TextField label="Poll option 1" placeholder="" name="Option1" value={this.state.pollOptionsTelugu.Option1} onChange={(event: any) => this._pollInputTeluguChangeHandle(event)} required />
                                    <TextField label="Poll option 2" placeholder="" name="Option2" value={this.state.pollOptionsTelugu.Option2} onChange={(event: any) => this._pollInputTeluguChangeHandle(event)} required />
                                    <TextField label="Poll option 3" placeholder="" name="Option3" value={this.state.pollOptionsTelugu.Option3} onChange={(event: any) => this._pollInputTeluguChangeHandle(event)} />
                                    <TextField label="Poll option 4" placeholder="" name="Option4" value={this.state.pollOptionsTelugu.Option4} onChange={(event: any) => this._pollInputTeluguChangeHandle(event)} />
                                    <span className="sp-danger">{this.state.PollErr}</span>
                                </div>
                            }
                            <style>
                                {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                                `}
                            </style>
                        </div>
                    </div>
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