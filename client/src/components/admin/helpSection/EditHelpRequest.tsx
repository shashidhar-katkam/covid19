import * as React from "react";
import { Help2, HelpEmpty, IDialogPropss, Help } from '../../../models/models';
import '../styles.scss';
import { IStatusForm, BasicUserInfo, ISavedNews, NewsInfo, IStatusFormErr, ISavedFile, IFile, File } from '../../../models/models';
import Service from '../service';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Toggle } from "office-ui-fabric-react";

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
  newsForm: Help2;
  newsFormTelugu: Help2;
  newsFormErr: IHelpFormErr;
  newsFormTeluguErr: IHelpFormErr;
  statusForm: IStatusForm;
  statusFormErr: IStatusFormErr;
  isShowModal: boolean;
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

class EditHelpRequest extends React.Component<IProps, IState> {
  private service: Service;
  constructor(props: IProps) {
    super(props);

    this.state = {
      newsForm: new Help2(this.props.newsInfo),
      newsFormTelugu: new HelpEmpty(this.props.newsInfo),
      statusForm: { statusMessage: '', status: this.props.status },
      newsFormTeluguErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', WhatToDoErr: '' },
      statusFormErr: { CommentErr: '' },
      newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '', WhatToDoErr: '' },
      isShowModal: (this.props.status !== "Approved" ? true : false),
      isLoading: false,
      DialogProps: { show: false, message: '' },
      errorMessage: ''
    }
    this._titleChangeHandle = this._titleChangeHandle.bind(this);
    this._descriptionChangeHandle = this._descriptionChangeHandle.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this.service = new Service();
    this._statusMessageChangeHandle = this._statusMessageChangeHandle.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._onCategoryChange = this._onCategoryChange.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._removefile = this._removefile.bind(this);
    this._onToggleChange = this._onToggleChange.bind(this);
    this._onTeluguToggleChange = this._onTeluguToggleChange.bind(this);
    this._onTeluguCategoryChange = this._onTeluguCategoryChange.bind(this);
    this._teluguTitleChangeHandle = this._teluguTitleChangeHandle.bind(this);
    this._teluguDescriptionChangeHandle = this._teluguDescriptionChangeHandle.bind(this);
    this._whatToDoChangeHandle = this._whatToDoChangeHandle.bind(this);
    this._teluguWhatToDoChangeHandle = this._teluguWhatToDoChangeHandle.bind(this);
    this._closeAlertDialog = this._closeAlertDialog.bind(this);

    this.service.getHelpRequestInTeByERefId({ id: this.props.newsInfo._id }).then((res: any) => {
      if (res && res.status && res.data && res.data.length > 0) {
        this.setState({
          newsFormTelugu: new Help2(res.data[0])
        });
      } else {

      }
    });
  }

  componentWillReceiveProps(newProps: IProps) {
    this.setState({
      newsForm: new Help2(newProps.newsInfo),
      statusForm: { statusMessage: '', status: newProps.status },
      isShowModal: (newProps.status !== "Approved" ? true : false)
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
    let newsForm: Help2 = this.state.newsForm;
    let newsFormErrInfo: IHelpFormErr = this.state.newsFormErr;
    let statusFormErrInfo: IStatusFormErr = this.state.statusFormErr;
    let newsFormTelugu: Help2 = this.state.newsFormTelugu;
    let newsFormTeluguErr: IHelpFormErr = this.state.newsFormTeluguErr;
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

        let eFormData: Help2 = this.state.newsForm;
        let tFormData: Help2 = this.state.newsFormTelugu;
        let files: IFile[] = [];
        if (eFormData.Files.length > 0) {
          for (let i = 0; i < eFormData.Files.length; i++) {
            files = [...files, new File(eFormData.Files[i])]
          }
        }
        eFormData = { ...eFormData, Files: files };
        if (!eFormData.User) {
          eFormData = { ...eFormData, User: new BasicUserInfo({ firstName: 'Unkown', lastName: '', imagePath: '/uploads/static_files/avatar_2x.png', _id: null }) };
          tFormData = { ...tFormData, User: new BasicUserInfo({ firstName: 'Unkown', lastName: '', imagePath: '/uploads/static_files/avatar_2x.png', _id: null }) };
        }
        tFormData = { ...tFormData, Files: files };
        let formsData = { English: eFormData, Telugu: tFormData };

        eFormData.Title = eFormData.Title.trim();
        eFormData.Description = eFormData.Description.trim();
        eFormData.WhatToDo = eFormData.WhatToDo.trim();

        tFormData.Title = tFormData.Title.trim();
        tFormData.Description = tFormData.Description.trim();
        tFormData.WhatToDo = tFormData.WhatToDo.trim();

        statusChangeModel = new NewsInfo(formsData, this.state.statusForm);
      } else {
        statusChangeModel = { newsInfo: { English: { _id: this.state.newsForm._id } }, status: this.state.statusForm };
      }
      this.setState({
        isLoading: true
      });
      this.service.updateHelpRequestInET(statusChangeModel).then((res) => {
        if (res.status) {
          this.setState({
            isLoading: false
          });
          this.props.afterStatusUpdated(statusChangeModel.newsInfo.English._id, this.state.statusForm.status);
        } else {
          this.setState({
            isLoading: false,
            DialogProps: { show: true, message: res.message }
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

  private _closeAlertDialog() {
    this.setState({
      DialogProps: { show: false, message: '' },
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
                <TextField className="cs" label="Description" rows={5} multiline={true} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormErr.DescriptionErr} value={this.state.newsForm.Description} onChange={(event: any) => this._descriptionChangeHandle(event)} required />
                <TextField label="What To Do" multiline={true} rows={5} placeholder="Enter What to do" name="WhatToDo" errorMessage={this.state.newsFormErr.WhatToDoErr} value={this.state.newsForm.WhatToDo} onChange={(event: any) => this._whatToDoChangeHandle(event)} required />
                <ChoiceGroup selectedKey={this.state.newsForm.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onCategoryChange(ev, o, "Category")} label="Category" required={true} />
                <span className="sp-danger">{this.state.newsFormErr.CategoryErr}</span>
                <style>
                  {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                                `}
                </style>
                <Toggle label="Is Show" checked={this.state.newsForm.Show} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("Show", checked)} />
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

                  <div className="ms-Grid attachmentss" >
                    {(this.state.newsForm.Files.map((file: ISavedFile, index: number) => {
                      return <div className="ms-Grid-row item" id={file._id}>
                        <div className="ms-Grid-col ms-sm5 ms-md5 ms-lg5">
                          <a href={`http://localhost:7777/${file.filePath}`} rel="noopener noreferrer" target="_blank">{file.originalName}</a>
                        </div>
                        <div className="ms-Grid-col ms-sm5 ms-md5 ms-lg5">
                          <p>{file.mimeType}</p>
                        </div>
                        <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                          <p className="sp-pointer sp-remove sp-float-right" onClick={() => this._removefile(file)}>&times;</p>
                        </div>
                      </div>;
                    }))}
                  </div>
                </>
                }
              </div>
              <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6" >
                <div >
                  <h4>Telugu</h4>
                  <TextField label="Title" placeholder="Enter Title" name="Title" errorMessage={this.state.newsFormTeluguErr.TitleErr} value={this.state.newsFormTelugu.Title} onChange={(event: any) => this._teluguTitleChangeHandle(event)} required />
                  <TextField label="Description" multiline={true} rows={5} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormTeluguErr.DescriptionErr} value={this.state.newsFormTelugu.Description} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} required />
                  <TextField label="What To Do" multiline={true} rows={5} placeholder="Enter What to do" name="WhatToDo" errorMessage={this.state.newsFormTeluguErr.WhatToDoErr} value={this.state.newsFormTelugu.WhatToDo} onChange={(event: any) => this._teluguWhatToDoChangeHandle(event)} required />
                  <ChoiceGroup selectedKey={this.state.newsFormTelugu.Category} options={CategoryOptions} onChange={(ev: any, o: any) => this._onTeluguCategoryChange(ev, o, "Category")} label="Category" required={true} />
                  <span className="sp-danger">{this.state.newsFormTeluguErr.CategoryErr}</span>
                  <Toggle label="Is Show" checked={this.state.newsFormTelugu.Show} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("Show", checked)} />
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
          <div className="sp-clearFix"></div>
          <p className="sp-danger sp-mt10">{this.state.errorMessage}</p>
          <PrimaryButton className="sp-mt10" onClick={this._submitForm} text="Submit" />
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

export default EditHelpRequest;