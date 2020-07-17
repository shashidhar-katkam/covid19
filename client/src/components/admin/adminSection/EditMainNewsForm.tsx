import * as React from "react";
import { News2, NewsEmpty, ICreateNewsForm2, IDialogPropss, TypeOptions2 } from '../../../models/models';
import '../styles.scss';
import { IStatusForm, BasicUserInfo, ISavedNews, NewsInfo, IStatusFormErr, ICreateNewsForm, ISavedFile, IFile, File } from '../../../models/models';
import Service from '../service';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Toggle, Dropdown, IDropdownOption } from "office-ui-fabric-react";
import Loading from "../../common/Loading";
import { CategoryOptions } from "../../../constants/constants";

interface ICreatenewsFormErr {
  TitleErr: string;
  DescriptionErr: string;
  CategoryErr: string;
}

interface IState {
  newsForm: ICreateNewsForm2;
  newsFormTelugu: ICreateNewsForm2;
  newsFormErr: ICreatenewsFormErr;
  newsFormTeluguErr: ICreatenewsFormErr;
  statusForm: IStatusForm;
  DialogProps: IDialogPropss;
  statusFormErr: IStatusFormErr;
  isShowModal: boolean;
  isLoading: boolean;
  errorMessage: string;
}

interface IProps {
  newsInfo: ISavedNews;
  status: string;
  _closeDialog(): void;
  afterStatusUpdated(id: string, status?: string): void;
}

class EditNews extends React.Component<IProps, IState> {
  private service: Service;
  constructor(props: IProps) {
    super(props);
    this.state = {
      newsForm: new News2(this.props.newsInfo),
      newsFormTelugu: new NewsEmpty(this.props.newsInfo),
      statusForm: { statusMessage: '', status: this.props.status },
      newsFormTeluguErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '' },
      statusFormErr: { CommentErr: '' },
      newsFormErr: { TitleErr: '', DescriptionErr: '', CategoryErr: '' },
      isShowModal: (this.props.status !== "Approved" ? true : false),
      errorMessage: '',
      DialogProps: { show: false, message: '' },
      isLoading: false
    }
    this.service = new Service();
    this._titleChangeHandle = this._titleChangeHandle.bind(this);
    this._descriptionChangeHandle = this._descriptionChangeHandle.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._statusMessageChangeHandle = this._statusMessageChangeHandle.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._onCategoryChange = this._onCategoryChange.bind(this);
    this._changeStatus = this._changeStatus.bind(this);
    this._closeAlertDialog = this._closeAlertDialog.bind(this);
    //this._fileTypeChangeHandle = this._fileTypeChangeHandle.bind(this);
    this._removefile = this._removefile.bind(this);
    this._onToggleChange = this._onToggleChange.bind(this);
    this._onTeluguToggleChange = this._onTeluguToggleChange.bind(this);
    this._onTeluguCategoryChange = this._onTeluguCategoryChange.bind(this);
    this._teluguTitleChangeHandle = this._teluguTitleChangeHandle.bind(this);
    this._teluguDescriptionChangeHandle = this._teluguDescriptionChangeHandle.bind(this);

    this.service.getNewsByRef({ id: this.props.newsInfo._id }).then((res: any) => {
      if (res && res.status && res.data && res.data.length > 0) {

        this.setState({
          newsFormTelugu: new News2(res.data[0])
        });
      }
    });
  }

  componentWillReceiveProps(newProps: IProps) {
    this.setState({
      newsForm: new News2(newProps.newsInfo),
      statusForm: { statusMessage: '', status: newProps.status },
      isShowModal: (newProps.status !== "Approved" ? true : false)
    });
  }

  componentDidMount() {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }

  private _closeAlertDialog() {
    this.setState({
      DialogProps: { show: false, message: '' },
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
    let erorMessage: string;

    if (option) {
      if (option.key.toString() == "") {
        erorMessage = "Category is Required";
      } else {
        erorMessage = "";
      }
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
        newsFormErr: { ...this.state.newsFormErr, CategoryErr: erorMessage }
      });
    }
  }


  private isFormValid = (): boolean => {
    let newsForm: ICreateNewsForm2 = this.state.newsForm;
    let newsFormErrInfo: ICreatenewsFormErr = this.state.newsFormErr;
    let statusFormErrInfo: IStatusFormErr = this.state.statusFormErr;
    let newsFormTelugu: ICreateNewsForm2 = this.state.newsFormTelugu;
    let newsFormTeluguErr: ICreatenewsFormErr = this.state.newsFormTeluguErr;
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
        let eFormData: ICreateNewsForm2 = this.state.newsForm;
        let tFormData: ICreateNewsForm2 = this.state.newsFormTelugu;
        let files: IFile[] = [];
        // if (eFormData.Files.length > 0) {
        //   for (let i = 0; i < eFormData.Files.length; i++) {
        //     files = [...files, new File(eFormData.Files[i])]
        //   }
        // }
        // eFormData = { ...eFormData, Files: files };
        eFormData.Title = eFormData.Title.trim();
        eFormData.Description = eFormData.Description.trim();

        tFormData.Title = tFormData.Title.trim();
        tFormData.Description = tFormData.Description.trim();

        // if (!eFormData.User) {
        //   eFormData = { ...eFormData, User: new BasicUserInfo({ firstName: 'Unkown', lastName: '', imagePath: '/uploads/static_files/avatar_2x.png', _id: null }) };
        //   tFormData = { ...tFormData, User: new BasicUserInfo({ firstName: 'Unkown', lastName: '', imagePath: '/uploads/static_files/avatar_2x.png', _id: null }) };
        // }
        // tFormData = { ...tFormData, Files: files };

        let formsData = { English: eFormData, Telugu: tFormData };

        statusChangeModel = new NewsInfo(formsData, this.state.statusForm);
      } else {
        statusChangeModel = { newsInfo: { English: { _id: this.state.newsForm._id } }, status: this.state.statusForm };
      }
      this.setState({
        isLoading: true
      });
      this.service.updateNews(statusChangeModel).then((res) => {
        if (res.status) {
          this.setState({
            isLoading: false
          });
          this.props.afterStatusUpdated(statusChangeModel.newsInfo.English._id, this.state.statusForm.status);
        } else {
          this.setState({
            DialogProps: { show: true, message: res.message },
            isLoading: false
          });
        }
      });
    }
  }

  private _onTeluguCategoryChange(id: number, mimeType: string, option?: IDropdownOption) {

    if (option) {
      let erorMessage: string;
      if (option.key == "") {
        erorMessage = "Category is Required";
      } else {
        erorMessage = "";
      }
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
        newsFormTeluguErr: { ...this.state.newsFormTeluguErr, CategoryErr: erorMessage }
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
                <TextField className="cs" label="Description" rows={10} multiline={true} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormErr.DescriptionErr} value={this.state.newsForm.Description} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                <TextField label="Analysis 1" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis1" value={this.state.newsForm.Analysis1} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                <TextField label="Analysis 2" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis2" value={this.state.newsForm.Analysis2} onChange={(event: any) => this._descriptionChangeHandle(event)} />
                <TextField label="Analysis 3" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis3" value={this.state.newsForm.Analysis3} onChange={(event: any) => this._descriptionChangeHandle(event)} />
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
                <style>
                  {`.ms-ChoiceField {
                                    display: inline-block;
                                    margin-left:10px;
                                } 
                                `}
                </style>
                <Toggle label="Is Top News" checked={this.state.newsForm.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsTopTen", checked)} />
                <Toggle label="Is Headlines" checked={this.state.newsForm.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("IsHeadlines", checked)} />
                <Toggle label="Is Show" checked={this.state.newsForm.Show} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleChange("Show", checked)} />
                <ChoiceGroup selectedKey={this.state.newsForm.Type.toString()} options={TypeOptions2} label="Type" required={true} />
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
                  <TextField label="Description" multiline={true} rows={10} placeholder="Enter Description" name="Description" errorMessage={this.state.newsFormTeluguErr.DescriptionErr} value={this.state.newsFormTelugu.Description} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                  <TextField label="Analysis 1" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis1" value={this.state.newsFormTelugu.Analysis1} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                  <TextField label="Analysis 2" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis2" value={this.state.newsFormTelugu.Analysis2} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                  <TextField label="Analysis 3" multiline={true} rows={3} placeholder="Enter Analysis" name="Analysis3" value={this.state.newsFormTelugu.Analysis3} onChange={(event: any) => this._teluguDescriptionChangeHandle(event)} />
                  <Dropdown
                    label="Category"
                    required
                    className="dropdown-fileType"
                    placeholder="--Category--"
                    options={CategoryOptions}
                    multiSelect={true}
                    //defaultSelectedKeys={this.state.newsFormTelugu.Category}
                    selectedKeys={this.state.newsFormTelugu.Category}

                    errorMessage={this.state.newsFormTeluguErr.CategoryErr}
                    onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => this._onTeluguCategoryChange(1, "Category", option)}
                  />
                  <Toggle label="Is Top News" checked={this.state.newsFormTelugu.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsTopTen", checked)} />
                  <Toggle label="Is Headlines" checked={this.state.newsFormTelugu.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsHeadlines", checked)} />
                  <Toggle label="Is Show" checked={this.state.newsFormTelugu.Show} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("Show", checked)} />
                  {/* <Toggle label="Comments" checked={this.state.newsFormTelugu.IsCommentsOn} onText="On" offText="Off" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onTeluguToggleChange("IsCommentsOn", checked)} /> */}
                  <ChoiceGroup selectedKey={this.state.newsFormTelugu.Type.toString()} options={TypeOptions2} label="Type" required={true} />

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

export default EditNews;