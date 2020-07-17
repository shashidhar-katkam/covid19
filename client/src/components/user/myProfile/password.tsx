import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ErrorMessages, IDialogPropss } from '../../../models/models';
import NewsService from '../Service';
import './styles.scss';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react';


interface passwordd {
  isShow: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  oldPasswordErr: string;
  newPasswordErr: string;
  confirmPasswordErr: string;
}

interface IState {
  password: passwordd
  userId: string;
  phoneNumber: string;
  errorMessage: string;
  DialogProps: IDialogPropss;
}

interface IProps {
  userId: string;
  phoneNumber: string;
}

class Password extends React.Component<IProps, IState> {
  private service: NewsService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      password: {
        isShow: false,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        oldPasswordErr: "",
        newPasswordErr: "",
        confirmPasswordErr: ""
      },
      userId: this.props.userId,
      phoneNumber: this.props.phoneNumber,
      errorMessage: '',
      DialogProps: { show: false, message: '' }
    }

    this.service = new NewsService();
    this._confirmPasswordChangeHandle = this._confirmPasswordChangeHandle.bind(this);
    this._passwordChangeHandle = this._passwordChangeHandle.bind(this);
    this._showEditForm = this._showEditForm.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._submit = this._submit.bind(this);
    this._hideEditForm = this._hideEditForm.bind(this);
  }


  private _closeDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }

  public _passwordChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = event.target.name === "oldPassword" ? "Old password is Required." : "New password is Required.";
    } else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        password: { ...prevState.password, [event.target.name]: event.target.value, [event.target.name + 'Err']: erorMessage }
      }
    });
  }

  public _confirmPasswordChangeHandle(event: React.ChangeEvent<HTMLInputElement>) {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "Confirm Password Required.";
    } else if (this.state.password.newPassword !== '' && (this.state.password.newPassword !== event.target.value)) {
      erorMessage = "Password doesn't match.";
    }
    else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        password: { ...prevState.password, [event.target.name]: event.target.value, [event.target.name + 'Err']: erorMessage }
      }
    });
  }

  private _showEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        password: { ...prevState.password, isShow: true }
      }
    });
  }

  private _hideEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        password: {
          ...prevState.password,
          isShow: false,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          oldPasswordErr: "",
          newPasswordErr: "",
          confirmPasswordErr: ""
        },

      }
    });
  }

  private passwordValidation(form: passwordd) {
    let e1: string, e2: string, e3: string, isValid = true;

    if (form.oldPassword === "") {
      e1 = ErrorMessages.oldPasswordIsRequired;
      isValid = false;
    } else {
      e1 = "";
    }
    if (form.newPassword === "") {
      e2 = ErrorMessages.newPasswordIsRequired;
      isValid = false;
    } else {
      e2 = "";
    }
    if (form.confirmPassword === "") {
      e3 = ErrorMessages.confirmPasswordIsRequired;
      isValid = false;
    } else {
      e3 = "";
    }
    if (form.oldPassword === form.newPassword) {
      e2 = ErrorMessages.oldAndNewpasswordShouldNotSame;
      isValid = false;
    } else {
      e2 = "";
    }

    this.setState((prevState: IState) => {
      return {
        ...prevState,
        password: { ...prevState.password, oldPasswordErr: e1, newPasswordErr: e2, confirmPasswordErr: e3 }
      }
    });
    return isValid;

  }

  private _submit() {
    if (this.passwordValidation(this.state.password)) {
      this.service.changePassword({
        oldPassword: this.state.password.oldPassword, newPassword: this.state.password.newPassword, phoneNumber: this.state.phoneNumber, id: this.state.userId
      }).then((res: any) => {
        if (res.status) {
          this.setState((prevState: IState) => {
            return {
              ...prevState,
              password: {
                ...prevState.password,
                isShow: false,
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
                oldPasswordErr: "",
                newPasswordErr: "",
                confirmPasswordErr: ""
              }
            }
          });
        } else {
          this.setState({
            DialogProps: { show: true, message: res.message },
          });
        }
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row card-item">
          <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
            <p className="sp-no-pm sp-m3 title">Password</p>
          </div>
          <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
            <div className="ms-Grid" dir="ltr">
              {!this.state.password.isShow ?
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                    <p className="sp-no-pm sp-m3">**********</p>
                  </div>
                  <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
                    <button className="btn-edit btn-action" onClick={() => this._showEditForm()}>Edit</button>
                  </div>
                </div>
                :
                <div >
                  <TextField type="password" label="Old password" placeholder="old password" name="oldPassword" errorMessage={this.state.password.oldPasswordErr} value={this.state.password.oldPassword} onChange={(event: any) => this._passwordChangeHandle(event)} required minLength={8} />
                  <TextField type="password" label="New password" placeholder="new password" name="newPassword" errorMessage={this.state.password.newPasswordErr} value={this.state.password.newPassword} onChange={(event: any) => this._passwordChangeHandle(event)} required minLength={8} />
                  <TextField type="password" label="Confirm Password." placeholder="Confirm password" name="confirmPassword" errorMessage={this.state.password.confirmPasswordErr} value={this.state.password.confirmPassword} onChange={(event: any) => this._confirmPasswordChangeHandle(event)} required minLength={8} />
                  <p className="text-danger">{this.state.errorMessage}</p>
                  <button className="btn-edit btn-action" onClick={() => this._submit()} >Save</button>
                  <button className="btn-edit btn-action sp-mr10" onClick={() => this._hideEditForm()} >Cancel</button>
                </div>
              }
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

      </div>
    );
  }
}

export default Password;