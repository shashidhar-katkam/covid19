import * as React from "react";
import './styles.scss';
import { IUserC } from '../../../models/models';
import Util from '../../../util';
import TimeStamp from '../TimeStamp';


interface IProps {
  User: IUserC;
  DateTime: string;
  onUserClick(id: string): void;
}

class UserInfo extends React.Component<IProps, {}> {
  private util: Util;
  constructor(props: IProps) {
    super(props);
    this.util = new Util();
  }
  public render(): JSX.Element {
    return (<>
      <div className="row">
        <div className="column">
        <div className="sp-float-left img-c" >
          <img className="profile-pic sp-pointer" src={`${this.props.User.imagePath}`} alt="dd" onClick={() => this.props.onUserClick(this.props.User._id)} />
        </div>
        </div>
        <div className="column1" >
        <p className="profile-name" >
            {`${this.props.User.firstName} ${this.props.User.lastName}`}
          </p>
          <TimeStamp dateTime={this.props.DateTime} />
        </div>
      </div>
    </>
    );
  }
}

export default UserInfo;