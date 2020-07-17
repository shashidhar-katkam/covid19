import * as React from "react";
import { EditFile, FileType, Help, IHelpForm, IDialogPropss } from '../../../models/models';
import '../styles.scss';
import {
  IStatusForm,
  IAddFile, BasicUserInfo,
  ISavedNews, NewsInfo, IStatusFormErr,
  ISavedFile, IFile, File
} from '../../../models/models';
import Service from '../service';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { FileTypes } from '../../../constants/constants';
import Loading from "../../common/Loading";

const CategoryOptions: IChoiceGroupOption[] = [
  { key: 'personal', text: 'Personal' },
  { key: 'public', text: 'Public' }
];

interface IHelpFormErr {
  TitleErr: string;
  DescriptionErr: string;
  WhatToDoErr: string;
  CategoryErr: string;
}

interface IState {
  newsForm: IHelpForm;
  newsFormTelugu: IHelpForm;
  newsFormErr: IHelpFormErr;
  newsFormTeluguErr: IHelpFormErr;
  statusForm: IStatusForm;
  statusFormErr: IStatusFormErr;
  isShowModal: boolean;
  Files: any;
  errorMessage: string;
  isLoading: boolean;
  DialogProps: IDialogPropss;
}

interface IProps {
  newsInfo: ISavedNews;
  status: string;
  _closeDialog(): void;
  afterStatusUpdated(id: string, status?: string): void;
}

class ApproveForm extends React.Component<IProps, IState> {
  private service: Service;
  constructor(props: IProps) {
    super(props);
    this.state = {
      newsForm: new Help(this.props.newsInfo),
      newsFormTelugu: new Help(this.props.newsInfo),
      statusForm: { statusMessage: '', status: this.props.status },
      newsFormTeluguErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', WhatToDoErr: '' },
      statusFormErr: { CommentErr: '' },
      newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', WhatToDoErr: '' },
      isShowModal: (this.props.status !== "Approved" ? true : false),
      Files: (this.props.newsInfo.Files && this.props.newsInfo.Files.length > 0) ?
        this.props.newsInfo.Files.map((fileInfo: ISavedFile) => {
          return new EditFile(fileInfo);
        }) : null,
      errorMessage: '',
      DialogProps: { show: false, message: '' },
      isLoading: false
    }
    this._titleChangeHandle = this._titleChangeHandle.bind(this);
    this._descriptionChangeHandle = this._descriptionChangeHandle.bind(this);
    this._whatToDoChangeHandle = this._whatToDoChangeHandle.bind(this);
    this._closeAlertDialog = this._closeAlertDialog.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._statusMessageChangeHandle = this._statusMessageChangeHandle.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._onCategoryChange = this._onCategoryChange.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._textChangeHandle = this._textChangeHandle.bind(this);
    this._removeF = this._removeF.bind(this);
    this._onToggleChange = this._onToggleChange.bind(this);
    this._onTeluguToggleChange = this._onTeluguToggleChange.bind(this);
    this._onTeluguCategoryChange = this._onTeluguCategoryChange.bind(this);
    this._teluguTitleChangeHandle = this._teluguTitleChangeHandle.bind(this);
    this._teluguDescriptionChangeHandle = this._teluguDescriptionChangeHandle.bind(this);
    this._teluguWhatToDoChangeHandle = this._teluguWhatToDoChangeHandle.bind(this);
    this.service = new Service();
  }
  componentWillReceiveProps(newProps: IProps) {
    this.setState({
      newsForm: new Help(newProps.newsInfo),
      statusForm: { statusMessage: '', status: newProps.status },
      isShowModal: (newProps.status !== "Approved" ? true : false)
    });
  }

  private _onToggleChange(field: string, isChecked?: boolean) {
    this.setState({
      newsForm: { ...this.state.newsForm, [field]: isChecked },
    });

  }

  private _titleChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "Title is Required";
    } else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => ({
      newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
      newsFormErr: { ...prevState.newsFormErr, TitleErr: erorMessage }
    }));
  }

  private _descriptionChangeHandle = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "Description is Required";
    } else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => ({
      newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
      newsFormErr: { ...prevState.newsFormErr, DescriptionErr: erorMessage }
    }));
  }

  private _whatToDoChangeHandle = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "what to do is Required";
    } else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => ({
      newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
      newsFormErr: { ...prevState.newsFormErr, DescriptionErr: erorMessage }
    }));
  }

  private _statusMessageChangeHandle = (event: any): void => {
    let erorMessage: string;
    let db = event.target.value;
    if (event.target.value) {
      if (event.target.value === "") {
        erorMessage = "Please enter Comment.";
      } else {
        erorMessage = "";
      }
    } else {
      erorMessage = "Please enter Comment.";
    }
    this.setState((prevState: IState) => ({
      statusForm: { ...prevState.statusForm, statusMessage: db },
      statusFormErr: { ...prevState.statusFormErr, CommentErr: erorMessage }
    }));
  }

  componentDidMount() {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }

  private _closeDialog() {
    let isApprove: boolean = true;
    if (this.state.statusForm.status !== 'Approved') {
      isApprove = false;
    }
    this.setState({
      isShowModal: false,
      statusForm: { statusMessage: '', status: isApprove ? 'Approved' : '' }
    });

    if (!isApprove) {
      this.props._closeDialog();
    }


  }

  private _onCategoryChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
    this.setState((prevState: IState) => ({
      newsForm: { ...prevState.newsForm, [field]: option.key },
      newsFormErr: { ...prevState.newsFormErr, CategoryErr: '' }
    }));
  }

  private isFormValid = (): boolean => {
    let newsForm: IHelpForm = this.state.newsForm;
    let newsFormErrInfo: IHelpFormErr = this.state.newsFormErr;
    let statusFormErrInfo: IStatusFormErr = this.state.statusFormErr;

    let newsFormTelugu: IHelpForm = this.state.newsFormTelugu;
    let newsFormTeluguErr: IHelpFormErr = this.state.newsFormTeluguErr;

    //  let filesInfo = this.state.Files;
    let isFormValid: boolean = true;
    if (newsForm.Title === "") {
      newsFormErrInfo.TitleErr = "Title is Required";
      isFormValid = false;
    } else {
      newsFormErrInfo.TitleErr = "";
    }

    if (newsForm.Description === "") {
      newsFormErrInfo.DescriptionErr = "Description is Required";
      isFormValid = false;
    } else {
      newsFormErrInfo.DescriptionErr = "";
    }

    if (newsForm.Category === "") {
      newsFormErrInfo.CategoryErr = "Category is Required";
      isFormValid = false;
    } else {
      newsFormErrInfo.CategoryErr = "";
    }

    if (newsFormTelugu.Title === "") {
      newsFormTeluguErr.TitleErr = "Title is Required";
      isFormValid = false;
    } else {
      newsFormTeluguErr.TitleErr = "";
    }

    if (newsFormTelugu.Description === "") {
      newsFormTeluguErr.DescriptionErr = "Description is Required";
      isFormValid = false;
    } else {
      newsFormTeluguErr.DescriptionErr = "";
    }

    if (newsFormTelugu.Category === "") {
      newsFormTeluguErr.CategoryErr = "Category is Required";
      isFormValid = false;
    } else {
      newsFormTeluguErr.CategoryErr = "";
    }
    this.setState({
      newsFormErr: newsFormErrInfo,
      statusFormErr: statusFormErrInfo,
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
      this.setState({
        isShowModal: true
      });
    }

  }

  private isStatusFormValid() {
    let statusForm: IStatusForm = this.state.statusForm;
    let statusFormErrInfo: IStatusFormErr = this.state.statusFormErr;
    let isStatusFormValid: boolean = true;
    if (statusForm.statusMessage === "") {
      statusFormErrInfo.CommentErr = "Please comment something.";
      isStatusFormValid = false;
    } else {
      statusFormErrInfo.CommentErr = "";
    }
    this.setState({
      statusFormErr: statusFormErrInfo
    });

    return isStatusFormValid;


  }

  private _changeStatus() {
    if (this.isStatusFormValid()) {
      let statusChangeModel: any;
      if (this.state.statusForm.status === "Approved") {

        let eFormData: IHelpForm = this.state.newsForm;
        let tFormData: IHelpForm = this.state.newsFormTelugu;

        let files: IFile[] = [];
        if (this.state.Files && this.state.Files.length > 0) {
          for (let i = 0; i < this.state.Files.length; i++) {
            files = [...files, new File(this.state.Files[i])]
          }
        }

        eFormData = { ...eFormData, Files: files };
        if (!eFormData.User) {
          eFormData = { ...eFormData, User: new BasicUserInfo({ firstName: 'Unkown', lastName: '', imagePath: '/uploads/static_files/avatar_2x.png', _id: null }) };
          tFormData = { ...tFormData, User: new BasicUserInfo({ firstName: 'Unkown', lastName: '', imagePath: '/uploads/static_files/avatar_2x.png', _id: null }) };
        }
        tFormData = { ...tFormData, Files: files };

        eFormData.Title = eFormData.Title.trim();
        eFormData.Description = eFormData.Description.trim();
        eFormData.WhatToDo = eFormData.WhatToDo.trim();

        tFormData.Title = tFormData.Title.trim();
        tFormData.Description = tFormData.Description.trim();
        tFormData.WhatToDo = tFormData.WhatToDo.trim();

        let formsData = { English: eFormData, Telugu: tFormData };

        statusChangeModel = new NewsInfo(formsData, this.state.statusForm);
      } else {
        statusChangeModel = { newsInfo: { English: { _id: this.state.newsForm._id } }, status: this.state.statusForm };
      }
      this.setState({ isLoading: true });

      this.service.acceptHelpRequestAndCreate(statusChangeModel).then((data: any) => {
        if (data.status) {
          this.setState({
            isLoading: false
          });

          this.props.afterStatusUpdated(statusChangeModel.newsInfo.English._id, this.state.statusForm.status);
        } else {
          this.setState({
            isLoading: false,
            DialogProps: { show: true, message: data.message }
          });

        }
      });
    }
  }

  private _onTeluguCategoryChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
    this.setState({
      newsFormTelugu: { ...this.state.newsFormTelugu, [field]: option.key },
    });
  }

  private _onTeluguToggleChange(field: string, isChecked?: boolean) {
    this.setState({
      newsFormTelugu: { ...this.state.newsFormTelugu, [field]: isChecked },
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
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "Description is Required";
    } else {
      erorMessage = "";
    }
    this.setState({
      newsFormTelugu: { ...this.state.newsFormTelugu, [event.target.name]: event.target.value },
      newsFormTeluguErr: { ...this.state.newsFormTeluguErr, [event.target.name + 'Err']: erorMessage }
    });
  }

  private _teluguWhatToDoChangeHandle = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "what to do Required";
    } else {
      erorMessage = "";
    }
    this.setState({
      newsFormTelugu: { ...this.state.newsFormTelugu, [event.target.name]: event.target.value },
      newsFormTeluguErr: { ...this.state.newsFormTeluguErr, [event.target.name + 'Err']: erorMessage }
    });
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


    this.setState((prevState: IState) => {
      return { Files: files };
    });
  }

  private DropDownChangeHandle(id: number, mimeType: string, option?: IDropdownOption) {

    let erorMessage: string;
    if (option) {

      if (option.key === "") {
        erorMessage = `${mimeType} is required`;
      } else {
        erorMessage = "";
      }
      let files = this.state.newsForm.Files.map((file: IAddFile) => {
        if (file.id === id) {
          return file = { ...file, [mimeType]: option.key, [mimeType + 'Err']: erorMessage };
        } else {
          return file;
        }
      });

      this.setState((prevState: IState) => {
        return { newsForm: { ...prevState.newsForm, Files: files } };
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


  render(): JSX.Element {
    return (
      <div className="approve-form" >
        {this.state.isLoading && <Loading />}
        {(this.state.statusForm.status === "Approved" && <div className="sp-pb20">
          <hr />
          <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row" >
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                <h4>English</h4>
                <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormErr.TitleErr} value={this.state.newsForm.Title} onChange={(event: any) => this._titleChangeHandle(event)} required />
                <TextField className="cs" label="Description" rows={5} multiline={true} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormErr.DescriptionErr} value={this.state.newsForm.Description} onChange={(event: any) => this._descriptionChangeHandle(event)} required />
                <TextField label="WhatToDo" multiline={true} rows={5} placeholder="Enter WhatToDo" name="WhatToDo" errorMessage={this.state.newsFormErr.WhatToDoErr} value={this.state.newsForm.WhatToDo} onChange={(event: any) => this._whatToDoChangeHandle(event)} required />
                <ChoiceGroup defaultSelectedKey={this.state.newsForm.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onCategoryChange(ev, o, "Category")} label="Category" required={true} />
                <span className="sp-danger">{this.state.newsFormErr.CategoryErr}</span>
                <style>
                  {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                                `}
                </style>
                {/* <Toggle label="Is Top News" checked={this.state.newsForm.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsTopTen", checked)} />
                <Toggle label="Is Headlines" checked={this.state.newsForm.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsHeadlines", checked)} /> */}
                {this.state.newsForm.Files.length > 0 && <>
                  <div className="ms-Grid" >
                    <div className="ms-Grid-row item" >
                      <div className="ms-Grid-col ms-sm10 ms-md10 ms-lg10">
                        <p className="ms-fontSize-14 heading-3">Attachments</p>
                      </div>
                      <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                      </div>
                    </div>
                  </div>

                </>
                }
              </div>

              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                <div >
                  <h4>Telugu</h4>
                  <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormTeluguErr.TitleErr} value={this.state.newsFormTelugu.Title} onChange={(event: any) => this._teluguTitleChangeHandle(event)} required />
                  <TextField label="Description" multiline={true} rows={5} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormTeluguErr.DescriptionErr} value={this.state.newsFormTelugu.Description} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} required />
                  <TextField label="WhatToDo" multiline={true} rows={5} placeholder="Enter WhatToDo" name="WhatToDo" errorMessage={this.state.newsFormTeluguErr.WhatToDoErr} value={this.state.newsFormTelugu.WhatToDo} onChange={(event: any) => this._teluguWhatToDoChangeHandle(event)} required />
                  <ChoiceGroup selectedKey={this.state.newsFormTelugu.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onTeluguCategoryChange(ev, o, "Category")} label="Category" required={true} />
                  <span className="sp-danger">{this.state.newsFormTeluguErr.CategoryErr}</span>
                  {/* <Toggle label="Is Top News" checked={this.state.newsFormTelugu.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsTopTen", checked)} />
                  <Toggle label="Is Headlines" checked={this.state.newsFormTelugu.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsHeadlines", checked)} /> */}
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
          </div>
          <div className="ms-Grid attachmentss" >
            <div>
              {
                this.state.Files && this.state.Files.length > 0 &&
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
                              className="txt-filname"
                              placeholder="Enter file name"
                              name="fileNewName"
                              errorMessage={file.fileNewNameErr}
                              value={file.fileNewName}
                              onChange={(event: any) => this._textChangeHandle(event, file.id)}
                            />
                          </td>
                          <td>
                            {(file.mimeType === FileType.facebook || file.mimeType === FileType.othersImage || file.mimeType === FileType.youtube) ?
                              < TextField
                                className="txt-filpath"
                                placeholder="Enter file Url"
                                name="filePath"
                                errorMessage={file.filePathErr}
                                value={file.filePath}
                                onChange={(event: any) => this._textChangeHandle(event, file.id)}
                              />
                              : <a className="sp-ml10" href={`http://localhost:7777/${file.filePath}`} target="_blank" rel="noopener noreferrer" >click here</a>}
                          </td>
                          <td>
                            <Dropdown
                              className="dropdown-fileType"
                              placeholder="Select file type"
                              defaultSelectedKey={file.mimeType}
                              options={FileTypes}
                              errorMessage={file.mimeTypeErr}
                              onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this.DropDownChangeHandle(file.id, "mimeType", option)}
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
            </div>
          </div>
          <div className="sp-clearFix"></div>
          <p className="sp-danger sp-mt10">{this.state.errorMessage}</p>
          <PrimaryButton className="sp-mt10" onClick={this._submitForm} text="Post News" />
        </div>
        )}
        <Dialog
          hidden={!this.state.isShowModal}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: this.state.statusForm.status,
          }}
          modalProps={
            { isBlocking: true }
          }
        >
          <TextField label="Comment" multiline={true} placeholder="Enter Description" name="Description" errorMessage={this.state.statusFormErr.CommentErr} value={this.state.statusForm.statusMessage} onChange={this._statusMessageChangeHandle} required />
          <DialogFooter>
            <PrimaryButton onClick={this._changeStatus} text="Send" />
            <DefaultButton onClick={this._closeDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>

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
      </div>
    );
  }
}

export default ApproveForm;