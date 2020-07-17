import * as React from "react";
import './styles.scss';
import { IUserC } from '../../../models/models';
import Util from '../../../util';
import TimeStamp from '../TimeStamp';
interface IState {

}

interface IProps {
  User: IUserC;
  DateTime: string;
  onUserClick(id: string): void;
}

class UserInfo extends React.Component<IProps, IState> {
  private util: Util;
  constructor(props: IProps) {
    super(props);
    this.util = new Util();
  }
  public render(): JSX.Element {
    return (<>

      {/* <div className="ms-Grid sp-no-pm" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
            <img className="profile-pic sp-pointer" src={`http://localhost:7777${this.props.User.imagePath}`} alt="dd" onClick={() => this.props.onUserClick(this.props.User._id)} />
          </div>
          <div className="ms-Grid-col ms-sm10 ms-md10 ms-lg10 sp-34">
            <p className="profile-name sp-no-pm" onClick={() => this.props.onUserClick(this.props.User._id)}>
              {`${this.props.User.firstName} ${this.props.User.lastName}`}
            </p>
            <TimeStamp dateTime={this.props.DateTime} />
          </div>
        </div>
      </div> */}


      <div className="row">
        <div className="column">
        <div className="sp-float-left img-c" >
          <img className="profile-pic sp-pointer" src={`http://localhost:7777${this.props.User.imagePath}`} alt="dd" onClick={() => this.props.onUserClick(this.props.User._id)} />
        </div>
        </div>
        <div className="column1" >
        <p className="profile-name" onClick={() => this.props.onUserClick(this.props.User._id)}>
            {`${this.props.User.firstName} ${this.props.User.lastName}`}
          </p>
          <TimeStamp dateTime={this.props.DateTime} />
        </div>
      </div>

      {/* <div className="msg-c">
        <div className="sp-float-left img-c" >
          <img className="profile-pic sp-pointer" src={`http://localhost:7777${this.props.User.imagePath}`} alt="dd" onClick={() => this.props.onUserClick(this.props.User._id)} />
        </div>
        <div className="sp-name">
          <p className="profile-name sp-no-pm" onClick={() => this.props.onUserClick(this.props.User._id)}>
            {`${this.props.User.firstName} ${this.props.User.lastName}`}
          </p>
          <TimeStamp dateTime={this.props.DateTime} />
        </div>
        <div>
        </div>
      </div>
      <div className="sp-clearFix"></div> */}
    </>
    );
  }
}

export default UserInfo;