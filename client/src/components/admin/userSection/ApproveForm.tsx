import * as React from "react";
import { News, EditFile, FileType, IDialogPropss, Type, TypeOptions3, AddFile } from '../../../models/models';
import '../styles.scss';
import { IStatusForm, IAddFile, BasicUserInfo, ISavedNews, NewsInfo, IStatusFormErr, ICreateNewsForm, ISavedFile, IFile, File } from '../../../models/models';
import Service from '../service';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Toggle } from "office-ui-fabric-react";
import { FileTypes2, CategoryOptions, FileTypes } from '../../../constants/constants';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { stringify } from "querystring";


interface ICreatenewsFormErr {
  TitleErr: string;
  DescriptionErr: string;
  CategoryErr: string;
  TypeErr: string;
}

interface IState {
  newsForm: ICreateNewsForm;
  newsFormTelugu: ICreateNewsForm;
  newsFormErr: ICreatenewsFormErr;
  newsFormTeluguErr: ICreatenewsFormErr;
  statusForm: IStatusForm;
  DialogProps: IDialogPropss;
  isLoading: boolean;
  statusFormErr: IStatusFormErr;
  isShowModal: boolean;
  Files: any;
  errorMessage: string;
  type: string;
  Links: IAddFile[];
  fileIndex: number;
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
      newsForm: new News(this.props.newsInfo),
      newsFormTelugu: new News(this.props.newsInfo),
      statusForm: { statusMessage: '', status: this.props.status },
      newsFormTeluguErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', TypeErr: "" },
      statusFormErr: { CommentErr: '' },
      newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', TypeErr: "" },
      isShowModal: (this.props.status !== "Approved" ? true : false),
      Files: (this.props.newsInfo.Files && this.props.newsInfo.Files.length > 0) ?
        this.props.newsInfo.Files.map((fileInfo: ISavedFile) => {
          return new EditFile(fileInfo);
        }) : null,
      errorMessage: '',
      DialogProps: { show: false, message: '' },
      isLoading: false,
      type: '',
      Links: [],
      fileIndex: 1
    }
    this.service = new Service();
    this._titleChangeHandle = this._titleChangeHandle.bind(this);
    this._descriptionChangeHandle = this._descriptionChangeHandle.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._statusMessageChangeHandle = this._statusMessageChangeHandle.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._onCategoryChange = this._onCategoryChange.bind(this);
    this._closeAlertDialog = this._closeAlertDialog.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._textChangeHandle = this._textChangeHandle.bind(this);
    this._removeF = this._removeF.bind(this);
    this._removefile = this._removefile.bind(this);
    this._onToggleChange = this._onToggleChange.bind(this);
    this._dropDownChangeHandle = this._dropDownChangeHandle.bind(this);
    this._onTeluguToggleChange = this._onTeluguToggleChange.bind(this);
    this._onTeluguCategoryChange = this._onTeluguCategoryChange.bind(this);
    this._teluguTitleChangeHandle = this._teluguTitleChangeHandle.bind(this);
    this._teluguDescriptionChangeHandle = this._teluguDescriptionChangeHandle.bind(this);
    this._removeFPermanently = this._removeFPermanently.bind(this);
    this._addFile = this._addFile.bind(this);
  }

  componentWillReceiveProps(newProps: IProps) {
    this.setState({
      newsForm: new News(newProps.newsInfo),
      statusForm: { statusMessage: '', status: newProps.status },
      isShowModal: (newProps.status !== "Approved" ? true : false)
    });
  }

  private _closeAlertDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }

  private _onToggleChange(field: string, isChecked?: boolean) {
    this.setState({
      newsForm: { ...this.state.newsForm, [field]: isChecked },
    });
  }

  private _removefile(fileInfo: ISavedFile) {
    let files = this.state.newsForm.Files.filter(
      (file: ISavedFile) => file._id !== fileInfo._id
    );

    this.setState((prevState: IState) => {
      return { newsForm: { ...prevState.newsForm, Files: files } };
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
    this.setState((prevState: IState) => ({
      newsForm: { ...this.state.newsForm, [event.target.name]: event.target.value },
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

  private _onCategoryChange(id: number, mimeType: string, option?: IDropdownOption) {

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
      this.setState({
        newsForm: { ...this.state.newsForm, Category: catergory },
      });
    }
  }
  private isFormValid = (): boolean => {
    let newsForm: ICreateNewsForm = this.state.newsForm;
    let newsFormErrInfo: ICreatenewsFormErr = this.state.newsFormErr;
    let statusFormErrInfo: IStatusFormErr = this.state.statusFormErr;
    let newsFormTelugu: ICreateNewsForm = this.state.newsFormTelugu;
    let newsFormTeluguErr: ICreatenewsFormErr = this.state.newsFormTeluguErr;
    let filesInfo = this.state.Links;
    let isFormValid: boolean = true;

    if (newsForm.Title === "") {
      newsFormErrInfo.TitleErr = "Title is Required";
      isFormValid = false;
    } else {
      newsFormErrInfo.TitleErr = "";
    }

    if (newsForm.Category.length === 0) {
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

    if (newsFormTelugu.Category.length === 0) {
      newsFormTeluguErr.CategoryErr = "Category is Required";
      isFormValid = false;
    } else {
      newsFormTeluguErr.CategoryErr = "";
    }
    debugger;
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


    this.setState({
      newsFormErr: newsFormErrInfo,
      statusFormErr: statusFormErrInfo,
      newsFormTeluguErr: newsFormTeluguErr,
      Links: filesInfo,
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
        let eFormData: ICreateNewsForm = this.state.newsForm;
        let tFormData: ICreateNewsForm = this.state.newsFormTelugu;
        let files: IFile[] = [];
        //let links = this.state.Links;
        if (this.state.Files && this.state.Files.length > 0) {
          for (let i = 0; i < this.state.Files.length; i++) {
            files = [...files, new File(this.state.Files[i])]
          }
        }
        if (this.state.Links && this.state.Links.length > 0) {
          for (let i = 0; i < this.state.Links.length; i++) {
            files = [...files, new File(this.state.Links[i])]
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
        tFormData.Title = tFormData.Title.trim();
        tFormData.Description = tFormData.Description.trim();

        let formsData = { English: eFormData, Telugu: tFormData };
        statusChangeModel = new NewsInfo(formsData, this.state.statusForm);
      } else {
        statusChangeModel = { newsInfo: { English: { _id: this.state.newsForm._id } }, status: this.state.statusForm };
      }
      this.setState({ isLoading: true });
      this.service.saveNews(statusChangeModel).then((data: any) => {
        if (data.status === true) {
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


  private _onTeluguCategoryChange(id: number, mimeType: string, option?: IDropdownOption) {
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
      this.setState({
        newsFormTelugu: { ...this.state.newsFormTelugu, Category: catergory },
      });
    }
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
    this.setState({
      newsFormTelugu: { ...this.state.newsFormTelugu, [event.target.name]: event.target.value },
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
    let files = this.state.Links.map((file: IAddFile) => {
      if (file.id === id) {
        return file = { ...file, [inputControl.name]: inputControl.value, [inputControl.name + 'Err']: erorMessage };
      } else {
        return file
      }
    });
    this.setState((prevState: IState) => {
      return { Links: files };
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
      let files = this.state.newsForm.Files.map((file: IAddFile) => {
        if (file.id === id) {
          return file = { ...file, [mimeType]: option.key, [mimeType + 'Err']: erorMessage };
        } else {
          return file
        }
      });
      this.setState((prevState: IState) => {
        return { newsForm: { ...prevState.newsForm, Files: files } };
      });
    }
  }

  
  private _dropDownChange2Handle(id: number, mimeType: string, option?: IDropdownOption) {
    let erorMessage: string;
    if (option) {
        if (option.key === "") {
            erorMessage = `${mimeType} is required`;
        } else {
            erorMessage = "";
        }
        let files = this.state.Links.map((file: IAddFile) => {
            if (file.id === id) {
                return file = { ...file, [mimeType]: option.key, [mimeType + 'Err']: erorMessage };
            } else {
                return file
            }
        });
        this.setState({
          Links: files
        });
    }
}


  _onTypeChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
    if (option) {
      if (option.key === 'comments') {
        this.setState({
          newsForm: { ...this.state.newsForm, Type: Type.Comments },
          newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.Comments },
          type: option.key
        });
      } else if (option.key === 'poll') {
        this.setState({
          newsForm: { ...this.state.newsForm, Type: Type.Polls },
          newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.Polls },
          type: option.key
        });
      } else if (option.key === 'questions') {
        this.setState({
          newsForm: { ...this.state.newsForm, Type: Type.Questions },
          newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.Questions },
          type: option.key
        });
      } else {
        this.setState({
          newsForm: { ...this.state.newsForm, Type: Type.None },
          newsFormTelugu: { ...this.state.newsFormTelugu, Type: Type.None },
          type: option.key
        });
      }
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

  private _addFile() {
    this.setState((prevState: IState) => {
      return {
        Links: [...prevState.Links, new AddFile(prevState.fileIndex)],
        fileIndex: prevState.fileIndex + 1
      }
    });
  }

  private _removeFPermanently(id: number) {
    let fileInfo;
    let files = this.state.Files.filter(
      (file: IAddFile) => {
        if (file.id == id) {
          fileInfo = file;
        }
        return file.id !== id
      }
    );

    this.service.deleteUploadedFile(fileInfo).then((res: any) => {
    });

    this.setState((prevState: IState) => {
      return { Files: files };
    });
  }

  render(): JSX.Element {
    return (
      <div className="approve-form" >
        {(this.state.statusForm.status === "Approved" && <div className="sp-pb20">
          <hr />
          <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row" >
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                <h4>English</h4>
                <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormErr.TitleErr} value={this.state.newsForm.Title} onChange={(event: any) => this._titleChangeHandle(event)} required />
                <TextField className="cs" label="Description" rows={10} multiline={true} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormErr.DescriptionErr} value={this.state.newsForm.Description} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                <Dropdown
                  label="Category"
                  required
                  className="dropdown-fileType"
                  placeholder="Select file type"
                  options={CategoryOptions}
                  multiSelect={true}
                  defaultSelectedKeys={this.state.newsForm.Category}
                  errorMessage={this.state.newsFormErr.CategoryErr}
                  onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._onCategoryChange(1, "Category", option)}
                />
                <Toggle label="Is Top News" checked={this.state.newsForm.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsTopTen", checked)} />
                <Toggle label="Is Headlines" checked={this.state.newsForm.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsHeadlines", checked)} />
                <ChoiceGroup selectedKey={this.state.type} options={TypeOptions3} onChange={(ev: any, o: any) => this._onTypeChange(ev, o, "Type")} label="Type" required={true} />
                <p className="sp-danger sp-no-pm">{this.state.newsFormErr.TypeErr}</p>
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
                  <TextField label="Description" multiline={true} rows={10} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormTeluguErr.DescriptionErr} value={this.state.newsFormTelugu.Description} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                  <Dropdown
                    label="Category"
                    required
                    className="dropdown-fileType"
                    placeholder="--Category--"
                    options={CategoryOptions}
                    multiSelect={true}
                    defaultSelectedKeys={this.state.newsFormTelugu.Category}
                    errorMessage={this.state.newsFormTeluguErr.CategoryErr}
                    onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._onTeluguCategoryChange(1, "Category", option)}
                  />

                  <Toggle label="Is Top News" checked={this.state.newsFormTelugu.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsTopTen", checked)} />
                  <Toggle label="Is Headlines" checked={this.state.newsFormTelugu.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsHeadlines", checked)} />
                  {/* <Toggle label="Comments" checked={this.state.newsFormTelugu.IsCommentsOn} onText="On" offText="Off" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsCommentsOn", checked)} /> */}

                  <ChoiceGroup selectedKey={this.state.type} options={TypeOptions3} onChange={(ev: any, o: any) => this._onTypeChange(ev, o, "Type")} label="Type" required={true} />
                  <p className="sp-danger sp-no-pm">{this.state.newsFormTeluguErr.TypeErr}</p>
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
                              : <a className="sp-ml10" href={`http://localhost:7777/${file.filePath}`} rel="noopener noreferrer" target="_blank">click here</a>}
                          </td>
                          <td>
                            <Dropdown
                              className="dropdown-fileType"
                              placeholder="Select file type"
                              defaultSelectedKey={file.mimeType}
                              options={FileTypes}
                              errorMessage={file.mimeTypeErr}
                              onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._dropDownChangeHandle(file.id, "mimeType", option)}
                            />
                          </td>
                          <td>
                            <p className="btn-remove-file" title="remove" onClick={() => this._removeF(file.id)}>&times;</p>
                          </td>
                          {/* <td>
                            <p className="btn-remove-file" title="remove permanently." onClick={() => this._removeFPermanently(file.id)}>&times;</p>
                          </td> */}
                        </tr>
                      })
                    }
                  </tbody>
                </table>
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
                      this.state.Links.map((file: IAddFile) => {
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
                              onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._dropDownChange2Handle(file.id, "mimeType", option)}
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
          {/* <div className="sp-float-left sp-mt30 spmb30"> */}
          <PrimaryButton className="sp-mt10" onClick={this._submitForm} text="Post News" />
          <span className="add-icon sp-ml10 sp-mt10" title="Add row" onClick={this._addFile} ><i className="ms-Icon ms-Icon--CirclePlus" aria-hidden="true"></i></span>
          {/* </div> */}
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