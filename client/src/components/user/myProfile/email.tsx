import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import NewsService from '../Service';
import Util from '../../../util';
import './styles.scss';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react';
import { IDialogPropss } from "../../../models/models";


interface typ {
  isShow: boolean;
  value: string;
  errorMessage: string;
}

interface IState {
  email: typ;
  userId: string;
  DialogProps: IDialogPropss;
}

interface IProps {
  email: string;
  id: string;
}

class Email extends React.Component<IProps, IState> {
  private service: NewsService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      email: {
        isShow: false,
        value: this.props.email,
        errorMessage: ""
      },
      userId: this.props.id,
      DialogProps: { show: false, message: '' }
    }
    this.service = new NewsService();
    this._submit = this._submit.bind(this);
    this._emailChangeHandle = this._emailChangeHandle.bind(this);
    this._showEditForm = this._showEditForm.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
  }

  private _submit() {
    if (this.isEmailValid(this.state.email)) {
      this.service.updateProfile({
        field: 'email',
        data: { email: this.state.email.value, id: this.state.userId }
      }).then((res: any) => {
        if (res.status) {
          this.setState((prevState: IState) => {
            return {
              ...prevState,
              email: { ...prevState.email, isShow: false }
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

  private _closeDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }

  public _emailChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "Email is required.";
    } else if (!Util.validateEmail(event.target.value)) {
      erorMessage = "Invalid email";
    }
    else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        email: { ...prevState.email, value: event.target.value, errorMessage: erorMessage }
      }
    });
  }

  private isEmailValid(form: typ) {

    let isValid = true;
    let erorMessage: string;
    if (form.value === "") {
      erorMessage = "Email is required.";
      isValid = false;
    } else if (!Util.validateEmail(form.value)) {
      erorMessage = "Invalid email";
      isValid = false;
    }
    else {
      erorMessage = "";
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        email: { ...prevState.email, value: form.value, errorMessage: erorMessage }
      }
    });
    return isValid;

  }

  private _showEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        email: { ...prevState.email, isShow: true }
      }
    });
  }

  public render(): JSX.Element {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row card-item">
          <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
            <p className="sp-no-pm sp-m3 title">Email</p>
          </div>
          <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
            <div className="ms-Grid" dir="ltr">
              {!this.state.email.isShow ?
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                    <p className="sp-no-pm sp-m3">{this.state.email.value}</p>
                  </div>
                  <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
                    {/* <button className="btn-edit btn-action" onClick={() => this._showEditForm()}>Edit</button> */}
                  </div>
                </div>
                :
                <div>
                  <TextField label="Email" name="email" errorMessage={this.state.email.errorMessage} value={this.state.email.value} onChange={(event: any) => this._emailChangeHandle(event)} required />
                  <button className="btn-edit btn-action" onClick={() => this._submit()} >Save</button>
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

export default Email;