import * as React from "react";
import NewsService from '../Service';
import AuthService from '../../../services/authService';
import Address from './address';
import Name from './name';
import Email from './email';
import Gender from './gender';
import Password from './password';
import Username from './username';
import Image from './image';
import './styles.scss';
import Navbar from "../Navbar";
import Loading from "../../common/Loading";
import { connect } from "react-redux";
import { AppState } from "../../../Redux/app.store";
import { IUserState } from "../../../Redux/models";
import { UserType } from "../../../constants/constants";

interface IState {
  isLoading: boolean;
  User: any;
  User2: any;
}

interface IProps {
  User: IUserState;
}

class MyProfile extends React.PureComponent<IProps, IState> {
  private service: NewsService;
  private authService: AuthService;
  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: false,
      User: null,
      User2: null

    }
    this.service = new NewsService();
    this.authService = new AuthService();

    this._onImageChange = this._onImageChange.bind(this);
  }

  componentDidMount() {
    var user = this.authService.isLoggedIn();
    if (user) {
      this.setState({ isLoading: true });
      this.service.getProfileByIdF({ id: user._id }).then((data: any) => {
        if (data && data.data && data.data[0]) {
          let userInfo = data.data[0];
          this.setState((prevState: IState) => {
            return {
              ...prevState,
              User: user,
              User2: userInfo,
              isLoading: false
            }
          });
        }else{
          this.setState({ isLoading: false });

        }
      });
    }
  }

  private _onImageChange(newImagePath: string) {
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        User2: { ...prevState.User2, imagePath: newImagePath }
      }
    });
  }

  render(): JSX.Element {
    return (
      <>
        <Navbar />
        <div className="">
          <div className="ms-Grid sp-bg-white my-profile" dir="ltr" >
            {this.state.isLoading && <Loading />}

            {this.state.User2 &&
              <div className="ms-Grid-row sp-mt10">
                <div className="ms-Grid-col ms-sm12 ms-md3 ms-lg3 img-container" >
                  <Image imagePath={this.state.User2.imagePath} userId={this.state.User2._id} onImageChange={this._onImageChange} ></Image>
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md9 ms-lg9" >
                  <div>
                    <h5 className="h5">General</h5>
                  </div>
                  <div className="card">
                    <div className="header">
                      <p className="sp-no-pm">Security and Login</p>
                    </div>
                    <Username userId={this.state.User2._id} username={this.state.User2.phoneNumber} ></Username>
                    <hr className="sp-no-pm sp-m3" />
                    <Password userId={this.state.User2._id} phoneNumber={this.state.User2.phoneNumber} ></Password>
                  </div>
                  <div className="card card-2">
                    <div className="header">
                      <p className="sp-no-pm">Personal Info</p>
                    </div>
                    <Name firstName={this.state.User2.firstName} lastName={this.state.User2.lastName} userId={this.state.User2._id} ></Name>
                    <hr className="sp-no-pm sp-m3" />
                    <Email email={this.state.User2.email} id={this.state.User2._id} ></Email>
                    <hr className="sp-no-pm sp-m3" />
                    <Gender gender={this.state.User2.gender} userId={this.state.User2._id}></Gender>
                    <hr className="sp-no-pm sp-m3" />
                    <Address city={this.state.User2.city} state={this.state.User2.state} userId={this.state.User2._id} ></Address>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState): AppState => ({
  User: state.User,
});

export default connect(
  mapStateToProps,
)(MyProfile);