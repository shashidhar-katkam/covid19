import * as React from "react";
import FileUpload from '../../../common/fileUpload';
import { FileInfo, BasicUserInfo, IDialogPropss, IFileInfo } from '../../../../models/models';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Service from '../../Service';
import { DefaultButton, Callout } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import AuthService from '../../../../services/authService';
import './styles.scss';
import Loading from "../../../common/Loading";
import { IUserState } from "../../../../Redux/models";
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import Common from "../../../common";
const ShowMoreText = require('react-show-more-text');

interface INeedHelpForm {
  Title: string;
  Description: string;
  WhatToDo: string;
  User: any;
  Files: IFileInfo[];
}

interface INeedHelpFormError {
  TitleErr: string;
  DescriptionErr: string;
  WhatToDoErr: string;
  FilesErr: string;
}

interface IState {
  uploadedFilesInfo: any;
  needHelpForm: INeedHelpForm;
  needHelpFormErr: INeedHelpFormError;
  Reset: boolean;
  DialogProps: IDialogPropss;
  isLoading: boolean;
  isShowInfoPanel: boolean;
}

interface IProps {
  User: IUserState;
}

class NeedHelp extends React.Component<IProps, IState> {
  private service: Service;
  private _menuButtonElement = React.createRef<HTMLImageElement>();
  private authservice: AuthService;
  constructor(props: IProps) {
    super(props);

    this.state = {
      uploadedFilesInfo: [],
      needHelpForm: { Title: '', Description: '', WhatToDo: '', User: '', Files: [] },
      needHelpFormErr: { TitleErr: '', DescriptionErr: '', WhatToDoErr: '', FilesErr: '' },
      Reset: false,
      DialogProps: { show: false, message: '' },
      isLoading: false,
      isShowInfoPanel: false
    }

    this._afterFilesUploaded = this._afterFilesUploaded.bind(this);
    this._onProgress = this._onProgress.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._inputChangeHandle = this._inputChangeHandle.bind(this);
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

  private removefile(fileInf: any) {
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
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = this.props.User.staticConstants.Constants.required;
    } else {
      erorMessage = "";
    }
    this.setState({
      needHelpForm: { ...this.state.needHelpForm, [event.target.name]: event.target.value },
      needHelpFormErr: { ...this.state.needHelpFormErr, [event.target.name + 'Err']: erorMessage }
    });
  }


  private isFormValid(): boolean {
    let newsForm: INeedHelpForm = this.state.needHelpForm;
    let errormsgs: INeedHelpFormError = this.state.needHelpFormErr;
    let uploadedFilesInfo = this.state.uploadedFilesInfo;
    let isFormValid: boolean = true;
    if (newsForm.Title === "") {
      errormsgs.TitleErr = this.props.User.staticConstants.Constants.required;
      isFormValid = false;
    } else {
      errormsgs.TitleErr = "";
    }

    if (newsForm.Description === "") {
      errormsgs.DescriptionErr = this.props.User.staticConstants.Constants.required;
      isFormValid = false;
    } else {
      errormsgs.DescriptionErr = "";
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
      needHelpFormErr: errormsgs
    });
    setTimeout(() => {
      this.setState((prevState: IState) => {
        return {
          needHelpFormErr: { ...prevState.needHelpFormErr, FilesErr: '' },
        };
      });
    }, 3000);
    return isFormValid;
  }

  _onCalloutDismiss() {
    this.setState({
      isShowInfoPanel: false
    });
  }


  private _closeDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }

  private _submitForm() {
    if (this.isFormValid()) {
      let uploadedFilesInfo = this.state.uploadedFilesInfo;
      let formData: INeedHelpForm = this.state.needHelpForm;
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
      formData.WhatToDo = formData.WhatToDo.trim();

      this.setState({ isLoading: true });
      this.service.raiseHelpRequest(formData).then((res) => {
        if (res.status === true) {
          this.setState({
            isLoading: false,
            uploadedFilesInfo: [],
            needHelpForm: {
              Title: '',
              Description: '',
              WhatToDo: '',
              Files: [],
              User: ''
            },
            needHelpFormErr: {
              TitleErr: '',
              DescriptionErr: '',
              WhatToDoErr: '',
              FilesErr: ''
            },
            Reset: true,
            DialogProps: {
              show: true,
              message: this.props.User.staticConstants.Constants.helpSentMsg

            }
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
    console.log(filesInfo);
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
                    {fileInfo.progress != 100 &&
                      <ProgressBar now={fileInfo.progress}
                        label={fileInfo.progress}
                        animated={true} />}
                  </div>
                  <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg1">
                    <span className="btn-remove-file sp-float-right"
                      onClick={() => this.removefile(fileInfo)}> &times;</span>
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

  public render(): JSX.Element {
    return (
      <>
        {this.state.isLoading && <Loading />}
        <div className="compose-c">
          <div className="sp-compose-body">
            <TextField label={this.props.User.staticConstants.Constants.title}
              placeholder={this.props.User.staticConstants.Constants.whatIsYourProblem}
              name="Title"
              errorMessage={this.state.needHelpFormErr.TitleErr}
              value={this.state.needHelpForm.Title}
              onChange={(event: any) => this._inputChangeHandle(event)}
              required />
            <TextField label={this.props.User.staticConstants.Constants.descripiton}
              multiline={true}
              rows={4}
              placeholder={this.props.User.staticConstants.Constants.describeYourProblem}
              name="Description"
              errorMessage={this.state.needHelpFormErr.DescriptionErr}
              value={this.state.needHelpForm.Description}
              onChange={(event: any) => this._inputChangeHandle(event)}
              required />
            <TextField label={this.props.User.staticConstants.Constants.whatToDo}
              multiline={true}
              rows={4}
              placeholder={this.props.User.staticConstants.Constants.whatToDoPlaceHo}
              name="WhatToDo"
              value={this.state.needHelpForm.WhatToDo}
              onChange={(event: any) => this._inputChangeHandle(event)}
            />
            <div className="sp-clearFix"> </div>
            <div className="sp-mt10">
              {this.filesUploadedBindingInfo(this.state.uploadedFilesInfo)}
              <p className="sp-danger">{this.state.needHelpFormErr.FilesErr}</p>
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
                </div>
              </Callout>
            )}
            <div className="sp-float-right">
              <FileUpload id="Help12"
                multiple={true}
                onProgress={this._onProgress}
                Reset={this.state.Reset}
                afterFilesUploaded={this._afterFilesUploaded} />
              <DefaultButton
                onClick={this._submitForm}
                className="sp-btn-login btn-send"
                text="Send" />
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
          <p className="ms-fontSize-14">{this.state.DialogProps.message}</p>
          <DefaultButton
            className="sp-btn-login"
            onClick={this._closeDialog}
            text="Ok" />
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
)(NeedHelp);