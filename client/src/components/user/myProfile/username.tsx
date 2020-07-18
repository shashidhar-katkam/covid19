import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import './styles.scss';
import { ErrorMessages } from '../../../models/models';
import MyProfileService from './service';


interface typ {
  isShow: boolean;
  value: string;
  errorMessage: string;
}

interface IState {
  username: typ;
  userId: string;

}

interface IProps {
  username: string;
  userId: string;
}

class Username extends React.Component<IProps, IState> {
  private myProfileService: MyProfileService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: {
        isShow: false,
        value: this.props.username,
        errorMessage: ""
      },
      userId: this.props.userId
    }
    this.myProfileService = new MyProfileService();
  }


  private submit() {

  }

  private isUsernameValid(form: typ) {
    let e1: string, isValid = true;
    if (form.value === "") {
      e1 = ErrorMessages.userNameIsRequired;
      isValid = false;
    } else {
      e1 = "";
    }
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        username: { ...prevState.username, errorMessage: e1 }
      }
    });
    return isValid;

  }

  public usernameChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let erorMessage: string;
    if (event.target.value === "") {
      erorMessage = "Phone number is Required.";
    }
    else if (event.target.value !== "") {
      this.myProfileService.isAvailCheck('username', event.target.value, this.state.userId).then((data) => {
        if (!data) {
          erorMessage = "Already created.";
        } else {
          erorMessage = "";
        }
        this.setState((prevState: IState) => {
          return {
            ...prevState,
            username: { ...prevState.username, value: event.target.value, errorMessage: erorMessage }
          }
        });
      });
    }
    else {
      erorMessage = "";
    }

    this.setState((prevState: IState) => {
      return {
        ...prevState,
        [event.target.name]: { ...prevState.username, value: event.target.value, errorMessage: erorMessage }
      }
    });
  }
  public render(): JSX.Element {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row card-item">
          <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" >
            <p className="sp-no-pm sp-m3 title">Username/Phone</p>
          </div>
          <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
            <div className="ms-Grid" dir="ltr">
              {!this.state.username.isShow ?
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9" >
                    <p className="sp-no-pm sp-m3"> +91 {this.state.username.value}</p>
                  </div>
                </div>
                : <div >
                  <TextField label="Username/Phone" placeholder="Phone Number" name="username" errorMessage={this.state.username.errorMessage} value={this.state.username.value} onChange={(event: any) => this.usernameChangeHandle(event)} required minLength={10} prefix="+91" maxLength={10} />
                  <button className="btn-edit btn-action" onClick={() => this.submit()} >Save</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Username;