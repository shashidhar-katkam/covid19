import * as React from "react";
import { IUserC } from '../../../models/models';
import TimeStamp, { TimeStamp3Right } from '../TimeStamp';
import './styles.scss';

interface IState {

}

interface IProps {
  User: IUserC;
  DateTime: string;
  Comment: string;
}

class UserInfo extends React.Component<IProps, IState> {
  public render(): JSX.Element {
    return (<>
      <div className="ms-Grid comment-info" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col sp-1 profile-pic2-c">
            <img className="profile-pic2 sp-pointer" src={`http://localhost:7777${this.props.User.imagePath}`} alt="dd" />
          </div>
          <div className="ms-Grid-col sp-9 comment-details">
            <p className="profile-name2 sp-no-pm" >
              {`${this.props.User.firstName} ${this.props.User.lastName}`}
              <TimeStamp3Right dateTime={this.props.DateTime} />
            </p>

            <p className="comment">{this.props.Comment}</p>
          </div>
        </div>
      </div>
      <div className="sp-clearFix"></div>
    </>
    );
  }

}

export default UserInfo;