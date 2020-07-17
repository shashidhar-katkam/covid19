import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import './styles.scss';
import { ErrorMessages, IDialogPropss } from '../../../models/models';
import NewsService from '../Service';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react';

interface name {
  isShow: boolean;
  firstName: string;
  lastName: string;
  firstNameErr: string;
  lastNameErr: string;
}
interface IState {
  name: name
  userId: string;
  DialogProps: IDialogPropss;
}

interface IProps {
  firstName: string;
  lastName: string;
  userId: string;
}

class Name extends React.Component<IProps, IState> {
  private service: NewsService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      name: {
        isShow: false,
        firstName: this.props.firstName,
        firstNameErr: '',
        lastName: this.props.lastName,
        lastNameErr: ''
      },
      userId: this.props.userId,
      DialogProps: { show: false, message: '' }
    }
    this.service = new NewsService();
    this._submit = this._submit.bind(this);
    this._showEditForm = this._showEditForm.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._nameChangeHandle = this._nameChangeHandle.bind(this);
  }

  private _submit() {
    if (this.nameValidation(this.state.name)) {
      this.service.updateProfile({
        field: 'name',
        data: { firstName: this.state.name.firstName, lastName: this.state.name.lastName, id: this.state.userId }
      }).then((res: any) => {
        if (res.status) {
          this.setState((prevState: IState) => {
            return {
              ...prevState,
              name: { ...prevState.name, isShow: false }
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

  private _showEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        name: { ...prevState.name, isShow: true }
      }
    });
  }

  private nameValidation(form: name) {
    let e1: string, e2: string, isValid = true;
    if (form.firstName === "") {
      e1 = ErrorMessages.firstNameIsRequired;
      isValid = false;
    } else {
      e1 = "";
    }
    if (form.lastName === "") {
      e2 = ErrorMessages.lastNameIsRequired;
      isValid = false;
    } else {
      e2 = "";
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        name: { ...prevState.name, firstNameErr: e1, lastNameErr: e2 }
      }
    });
    return isValid;
  }

  public _nameChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = event.target.name === "firstName" ? "Firstname is Required." : "Lastname is Required.";
    } else {
      erorMessage = ''
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        name: { ...prevState.name, [event.target.name]: event.target.value, [event.target.name + 'Err']: erorMessage }
      }
    });
  }

  public render(): JSX.Element {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row card-item">
          <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
            <p className="sp-no-pm sp-m3 title">Name</p>
          </div>
          <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
            <div className="ms-Grid" dir="ltr">
              {!this.state.name.isShow ?
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                    <p className="sp-no-pm sp-m3 profile-name">{`${this.state.name.firstName} ${this.state.name.lastName}`} </p>
                  </div>
                  <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
                    {/* <button className="btn-edit btn-action" onClick={() => this._showEditForm()}>Edit</button> */}
                  </div>
                </div>
                :
                <div>
                  <TextField label="First Name" name="firstName" errorMessage={this.state.name.firstNameErr} value={this.state.name.firstName} onChange={(event: any) => this._nameChangeHandle(event)} required />
                  <TextField label="Last Name" name="lastName" errorMessage={this.state.name.lastNameErr} value={this.state.name.lastName} onChange={(event: any) => this._nameChangeHandle(event)} required />
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

export default Name;