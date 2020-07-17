import * as React from "react";
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { States, StatesAndDirstricts } from '../../../constants/constants';
import { ErrorMessages, IDialogPropss } from '../../../models/models';
import NewsService from '../Service';
import './styles.scss';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react';

const options: IDropdownOption[] = States.map((state: string) => {
  return { key: state, text: state }
})

interface IAddress {
  isShow: boolean;
  state: string;
  stateErr: string;
  city: string;
  cityErr: string;
}

interface IState {
  address: IAddress;
  City: IDropdownOption[];
  userId: string;
  DialogProps: IDialogPropss;
}

interface IProps {
  city: string;
  state: string;
  userId: string;
}

class Address extends React.Component<IProps, IState> {
  private service: NewsService;
  constructor(props: IProps) {
    super(props);

    let CitysInfo: any[] = [];
    StatesAndDirstricts.forEach((sADInfo: any) => {
      if (sADInfo.State === this.props.state) {
        CitysInfo = [...CitysInfo, sADInfo];
      }
    });
    let citiesinSelectState = CitysInfo[0].Districts.map((state: string) => {
      return { key: state, text: state }
    });

    this.state = {
      address: {
        isShow: false,
        stateErr: '',
        state: this.props.state,
        city: this.props.city,
        cityErr: ''
      },
      userId: this.props.userId,
      City: citiesinSelectState,
      DialogProps: { show: false, message: '' }
    }
    this._stateChangeHandle = this._stateChangeHandle.bind(this);
    this._cityChangeHandle = this._cityChangeHandle.bind(this);
    this._submit = this._submit.bind(this);
    this._showEditForm = this._showEditForm.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._hideEditForm = this._hideEditForm.bind(this);
    this.service = new NewsService();

  }

  private _closeDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }


  private _stateChangeHandle(event: React.FormEvent<HTMLDivElement>, field: string, option?: IDropdownOption) {
    if (option) {
      let CitysInfo: any[] = [];
      StatesAndDirstricts.forEach((sADInfo: any) => {
        if (sADInfo.State === option.key) {
          CitysInfo = [...CitysInfo, sADInfo];
        }
      });
      let citiesinSelectState = CitysInfo[0].Districts.map((state: string) => {
        return { key: state, text: state }
      });
      this.setState({
        address: { ...this.state.address, [field]: option.key, city: '' },
        City: citiesinSelectState
      });
    }
  }

  private _cityChangeHandle(event: React.FormEvent<HTMLDivElement>, field: string, option?: IDropdownOption) {
    if (option) {
      this.setState({
        address: { ...this.state.address, [field]: option.key }
      });
    }
  }

  private isAddressValid(form: IAddress) {
    let e1: string, e2: string, isValid = true;
    if (form.city === "") {
      e1 = ErrorMessages.cityIsRequired;
      isValid = false;
    } else {
      e1 = "";
    }
    if (form.state === "") {
      e2 = ErrorMessages.stateIsRequired;
      isValid = false;
    } else {
      e2 = "";
    }

    this.setState((prevState: IState) => {
      return {
        ...prevState,
        address: { ...prevState.address, cityErr: e1, stateErr: e2 }
      }
    });
    return isValid;
  }

  private _submit() {
    if (this.isAddressValid(this.state.address)) {
      this.service.updateProfile({
        field: 'address',
        data: { city: this.state.address.city, state: this.state.address.state, id: this.state.userId }
      }).then((res: any) => {
        if (res.status) {
          this.setState((prevState: IState) => {
            return {
              ...prevState,
              address: { ...prevState.address, isShow: false }
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

  private _showEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        address: { ...prevState.address, isShow: true }
      }
    });
  }

  private _hideEditForm() {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        address: {
          ...prevState.address,
          isShow: false,
          stateErr: '',
          state: this.props.state,
          city: this.props.city,
          cityErr: ''
        }
      }
    });
  }

  public render(): JSX.Element {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row card-item">
          <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
            <p className="sp-no-pm sp-m3 title">Address</p>
          </div>
          <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
            <div className="ms-Grid" dir="ltr">
              {!this.state.address.isShow ?
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                    <p className="sp-no-pm sp-m3">{`${this.state.address.city} ${this.state.address.state}`}</p>
                  </div>
                  <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
                    <button className="btn-edit btn-action" onClick={() => this._showEditForm()}>Edit</button>
                  </div>
                </div>
                : <div> <Dropdown
                  label="State"
                  options={options}
                  errorMessage={this.state.address.stateErr}
                  selectedKey={this.state.address.state}
                  onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => this._stateChangeHandle(event, "state", option)} required
                />
                  <Dropdown
                    label="City"
                    options={this.state.City}
                    errorMessage={this.state.address.cityErr}
                    selectedKey={this.state.address.city}
                    onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => this._cityChangeHandle(event, "city", option)} required
                  />
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

export default Address;