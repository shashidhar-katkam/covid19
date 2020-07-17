import * as React from "react";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Service from '../Service';
import './styles.scss';
import InLoading from "../../common/InLoading";

interface IState {
  isLoading: boolean;
  isSubmitted: any;
  Status: any;
}

interface IProps {

}

class RequestAccess extends React.Component<IProps, IState> {
  private service: Service;
  constructor(props: IProps) {
    super(props);
    this.state = {
      isLoading: true,
      isSubmitted: null,
      Status: null
    }

    this.service = new Service();
    this._sendPermissionRequest = this._sendPermissionRequest.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    this.service.checkIsRequestSubmitted().then((res: any) => {
      if (res.status) {
        this.setState({
          isSubmitted: res.data.submitted,
          Status: res.data.data,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  private _sendPermissionRequest() {
    this.setState({ isLoading: true });
    this.service.sendSelfAdminRequest().then((res: any) => {
      if (res.status) {
        this.setState({
          isSubmitted: true,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  public render(): JSX.Element {
    return (
      <div className="sp-mt10 sp-ml10">
        {!this.state.isLoading && !this.state.isSubmitted && <>
          <h5>You are not a reporter</h5>
          <p>Would you like to work as a Reporter ?</p>
          <DefaultButton onClick={this._sendPermissionRequest} text="Send Request" className="sp-main-btn" />
        </>
        }
        {!this.state.isLoading && this.state.isSubmitted && <>
          <h5>You are not a reporter. </h5>
          <p>Your request is in progress. Please give us some time accept your request.</p>
        </>
        }
        {this.state.isLoading && <InLoading />}
      </div>
    );
  }
}

export default RequestAccess;