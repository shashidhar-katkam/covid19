import * as React from "react";
import NewsService from '../Service';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import './styles.scss';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react';
import { IDialogPropss } from "../../../models/models";


const genderOptions: IChoiceGroupOption[] = [
  { key: 'male', text: 'Male' },
  { key: 'female', text: 'Female' }
];

interface typ {
  isShow: boolean;
  value: string;
  errorMessage: string;
}

interface IState {
  gender: typ;
  DialogProps: IDialogPropss;
  userId: string;
}

interface IProps {
  gender: string;
  userId: string;
}

class Gender extends React.Component<IProps, IState> {
  private service: NewsService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      gender: {
        isShow: false,
        value: this.props.gender,
        errorMessage: ""
      },
      userId: this.props.userId,
      DialogProps: { show: false, message: '' }
    }
    this.service = new NewsService();
    this._submit = this._submit.bind(this);
    this._showEditForm = this._showEditForm.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._hideEditForm = this._hideEditForm.bind(this);
    this._onGenderChange = this._onGenderChange.bind(this);
  }

  private _closeDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }

  private _submit() {
    this.service.updateProfile({
      field: 'gender',
      data: { gender: this.state.gender.value, id: this.state.userId }
    }).then((res: any) => {
      if (res.status) {
        this.setState((prevState: IState) => {
          return {
            ...prevState,
            gender: { ...prevState.gender, isShow: false }
          }
        });
      } else {
        this.setState({
          DialogProps: { show: true, message: res.message },
          // isLoading: false
        });
      }
    });
  }

  private _showEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        gender: { ...prevState.gender, isShow: true }
      }
    });
  }

  private _hideEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        gender: { ...prevState.gender, isShow: false, errorMessage: "" }
      }
    });
  }

  _onGenderChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption, field: string) {
    this.setState({
      gender: { ...this.state.gender, value: option.key },
    });
  }



  render(): JSX.Element {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row card-item">
          <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
            <p className="sp-no-pm sp-m3 title">Gender</p>
          </div>
          <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
            <div className="ms-Grid" dir="ltr">
              {!this.state.gender.isShow ?
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                    <p className="sp-no-pm sp-m3">{this.state.gender.value}</p>
                  </div>
                  <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
                    <button className="btn-edit btn-action" onClick={() => this._showEditForm()}>Edit</button>
                  </div>
                </div>
                :
                <div>
                  <ChoiceGroup defaultSelectedKey={this.state.gender.value} options={genderOptions} onChange={(ev: any, o: any) => this._onGenderChange(ev, o, "gender")} label="Gender" required={true} />
                  <span className="sp-danger">{this.state.gender.errorMessage}</span>
                  <style>
                    {`.ms-ChoiceField {
                          display: inline-block;
                          margin-left:10px;
                      } 
                      `}
                  </style>
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

export default Gender;