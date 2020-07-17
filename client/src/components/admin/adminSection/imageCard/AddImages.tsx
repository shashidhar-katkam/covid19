import * as React from "react";
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import CreateNews from "../CreateNews";
import SearchNews from "../SearchNews";
import MainNews from "../MainNews";
import { IFileAndUser, IAddFile, AddFile, IFileT, FileT, FileT1, FileType } from "../../../../models/models";
import { PrimaryButton, Dropdown, TextField, IDropdownOption } from "office-ui-fabric-react";
import FileUpload from "../../../common/fileUpload";
import FileSelect from "../../../common/FileSelect";
import { FileTypes2 } from "../../../../constants/constants";
import ProgressBar from "react-bootstrap/ProgressBar";
import Service from '../../service';
import EditImages from "./EditImages";

interface IState {
    uploadedFilesInfo: any;
    Files: IAddFile[];
    ImportedFiles: IFileAndUser[];
    isShowFileSelectionModel: boolean;
    fileIndex: number;
    errorMessage: string;
    filesErrormessage: string;
    isLoading: boolean;
    Reset: boolean;
}

interface IProps {

}

class AddImages extends React.PureComponent<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            uploadedFilesInfo: [],
            Files: [],
            ImportedFiles: [],
            isShowFileSelectionModel: false,
            fileIndex: 0,
            filesErrormessage: '',
            errorMessage: '',
            isLoading: false,
            Reset: false
        }

        this.service = new Service();
        this._afterFilesUploaded = this._afterFilesUploaded.bind(this);
        this._onProgress = this._onProgress.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._addFile = this._addFile.bind(this);
        this._textChangeHandle = this._textChangeHandle.bind(this);
        this._showModel = this._showModel.bind(this);
        this._removeFile = this._removeFile.bind(this);
        this._dropDownChangeHandle = this._dropDownChangeHandle.bind(this);
        this._removeF = this._removeF.bind(this);
        this._afterSelectionFilesCancel = this._afterSelectionFilesCancel.bind(this);
        this._afterFilesSelected = this._afterFilesSelected.bind(this);
        this._removeFileFromImported = this._removeFileFromImported.bind(this);
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
    private isFormValid = (): boolean => {
        let filesInfo = this.state.Files;
        let uploadedFilesInfo = this.state.uploadedFilesInfo;
        let isFormValid: boolean = true;


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
                } else {
                }
            }
        }


        this.setState({
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


            
            this.setState({
                isLoading: true
            });
            this.service.addImages(filesInfo).then((res) => {
                if (res.status) {
                    this.setState({
                        uploadedFilesInfo: [],
                        Reset: true,
                        Files: [],
                        ImportedFiles: [],
                        fileIndex: 1,
                        isLoading: false,
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }
    }

    private _afterFilesUploaded(files: any) {
        for (let i = 0; i < files.length; i++) {
            this.setState((prevState, prevProps) => ({
                uploadedFilesInfo: [...prevState.uploadedFilesInfo, files[i]]
            }));
        }
    }

    private _afterSelectionFilesCancel() {
        this.setState({
            isShowFileSelectionModel: false
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

    private _showModel() {
        this.setState({
            isShowFileSelectionModel: true
        });
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

    render(): JSX.Element {
        return (

            <Pivot aria-label="Basic Pivot Example" >
                <PivotItem
                    headerText="Add"
                    headerButtonProps={{
                        'data-order': 1
                    }}
                >
                    <div className="sp-mt10">
                        Add Images
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
                            <p className="sp-danger">{this.state.filesErrormessage}</p>
                        </div>
                        <div className="sp-float-left sp-mt30">
                            <PrimaryButton className="sp-main-btn" onClick={this._submitForm} text="Add Images" />
                            <span className="add-icon sp-ml10 sp-mt10" title="Add row" onClick={this._addFile} ><i className="ms-Icon ms-Icon--CirclePlus" aria-hidden="true"></i></span>
                            <FileUpload accept="images" multiple={true} id="addImages" onProgress={this._onProgress} Reset={this.state.Reset} afterFilesUploaded={this._afterFilesUploaded}></FileUpload>
                            <span className="add-icon" title="Select from Uploads" onClick={this._showModel} ><i className="ms-Icon ms-Icon--LaptopSelected" aria-hidden="true"></i></span>
                        </div>
                        {this.state.isShowFileSelectionModel && <FileSelect afterFilesSelected={this._afterFilesSelected} afterSelectionFilesCancel={this._afterSelectionFilesCancel} />}
                    </div>
                </PivotItem>
                <PivotItem
                    headerText="Monitor"
                    headerButtonProps={{
                        'data-order': 2
                    }}
                >
                <EditImages />
                </PivotItem>
                {/* <PivotItem
                    headerText="Search News"
                    headerButtonProps={{
                        'data-order': 3
                    }}>
                    <SearchNews />
                </PivotItem>
                <PivotItem
                    headerText="Add Images"
                    headerButtonProps={{
                        'data-order': 4
                    }}
                >
               
                </PivotItem> */}
            </Pivot>


        );
    }
}

export default AddImages;