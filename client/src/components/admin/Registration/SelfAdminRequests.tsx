import * as React from "react";
import MaterialTable from 'material-table';
import { UserType } from '../../../models/models';
import NewsService from '../service';
import Service from '../service';
import { Dialog, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from "office-ui-fabric-react";
import Loading from "../../common/Loading";

interface IState {
  allNews: any[];
  isLoading: boolean;
  selectedItem: any;
  showDialog: boolean;
  statusMessage: string;
  updateField: string;
  newsCount: any;
  statusMessageErr: string;
  status: any;
}

interface IProps {

}

class SelfAdminRequests extends React.PureComponent<IProps, IState> {
  private newsService: NewsService;
  private service: Service;
  constructor(props: IProps) {
    super(props);
    this.state = {
      allNews: [],
      isLoading: false,
      selectedItem: null,
      showDialog: false,
      updateField: '',
      newsCount: null,
      statusMessage: '',
      statusMessageErr: '',
      status: null

    }
    this.newsService = new NewsService();
    this.service = new Service();
    this._onItemSelected = this._onItemSelected.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._submit = this._submit.bind(this);
    this._updateUser = this._updateUser.bind(this);
    this._statusMessageChangeHandle = this._statusMessageChangeHandle.bind(this);
    this._reloadData = this._reloadData.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.newsService.getAllSelfAdminRequests().then((res: any) => {
      if (res.status) {
        let data: [] = res.data;
        if (data) {
          this.setState({
            allNews: data ? data : [],
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      } else {
        this.setState({
          isLoading: false
        });
      }
    });

  }

  private _onItemSelected(event: any, data: any) {
    this.setState({
      isLoading: true
    });
    this.newsService.getUserDetailsByIdAndNewsCount({ id: data.userId }).then((res: any) => {
      if (res.status) {
        let data = res.data;
        this.setState({
          selectedItem: data.userInfo,
          newsCount: data.count,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  private _updateUser(field: string, status: number) {
    this.setState({
      updateField: field,
      status: status,
      showDialog: true
    });
  }

  private _submit() {
    if (this.state.statusMessage !== '') {
      this.setState({
        isLoading: true
      });
      this.service.updateProfileForSelfAdmin({
        field: this.state.updateField,
        data: { id: this.state.selectedItem._id, status: this.state.status, statusMsg: this.state.statusMessage }
      }).then((res: any) => {
        if (res.status) {
          this.setState({
            selectedItem: null,
            showDialog: false,
            status: null,
            statusMessage: '',
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        statusMessageErr: 'Please Enter comment'
      });
    }
  }

  public _closeDialog() {
    this.setState({
      statusMessage: '',
      showDialog: false,
    });
  }

  public _statusMessageChangeHandle = (event: any): void => {
    let erorMessage: string;
    let db = event.target.value;
    if (event.target.value) {
      if (event.target.value === "") {
        erorMessage = "Please enter Comment.";
      } else {
        erorMessage = "";
      }
    } else {
      erorMessage = "Please enter Comment.";
    }

    this.setState((prevState: IState) => ({
      statusMessage: db,
      statusMessageErr: erorMessage
    }));
  }

  private _reloadData() {
    this.setState({ isLoading: true });
    this.newsService.getAllSelfAdminRequests().then((res: any) => {
      if (res.status) {
        let data: [] = res.data;
        if (data) {
          this.setState({
            allNews: data ? data : [],
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  public render(): JSX.Element {
    const { allNews, isLoading } = this.state;
    return (
      <div>
        {isLoading && <Loading />}
        <div className="news-dashbord">
          <span className="Title"> Users Information</span>
          <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
          <div className="sp-clearFix" > </div>
          <hr className="sp-hr sp-m10" />
          <MaterialTable
            title="Self Admin Requests"
            style={{ marginTop: "5px", padding: "5px" }}
            columns={[
              { title: 'Id', field: 'userId' }
            ]}
            data={allNews}
            actions={[
              {
                icon: 'save',
                tooltip: 'Action',
                onClick: this._onItemSelected
              }
            ]}
            onFilterChange={() => { alert('d') }}
            //isLoading={isLoading}
            options={{
              rowStyle: rowData => ({
                backgroundColor: (this.state.selectedItem && this.state.selectedItem._id === rowData._id) ? '#EEE' : '#FFF'
              })
            }}
          ></MaterialTable>
          <div>
            {(this.state.selectedItem &&
              <div>
                <div className="ms-Grid" >
                  <div className="ms-Grid-row user-profile3">
                    <div className="ms-Grid-col ms-sm4">
                      <div className="">
                        <p className="profile-name sp-no-pm ms-fontSize-28 sp-mt10 capitalize">{` ${this.state.selectedItem.firstName} ${this.state.selectedItem.lastName} `}</p>
                        <p className="sp-no-pm sp-n ms-fontSize-18 sp-mt10" ><i className="ms-Icon ms-Icon--MapPin" aria-hidden="true"></i> {`${this.state.selectedItem.city}, ${this.state.selectedItem.state}`} </p>
                        <p className="sp-no-pm sp-n ms-fontSize-18" ><i className="ms-Icon ms-Icon--Mail" aria-hidden="true"></i> {`${this.state.selectedItem.email}`} </p>
                        <p className="sp-no-pm sp-n ms-fontSize-18 capitalize" ><i className="ms-Icon ms-Icon--Contact" aria-hidden="true"></i> {`${this.state.selectedItem.gender}`} </p>
                        <p className="sp-no-pm sp-n ms-fontSize-18 sp-mt10"><i className="ms-Icon ms-Icon--Telemarketer" aria-hidden="true"></i> +91 {this.state.selectedItem.phoneNumber}</p>
                        <p className="sp-no-pm sp-n ms-fontSize-18 sp-mt10"><i className="ms-Icon ms-Icon--Telemarketer" aria-hidden="true"></i>Total Posts : {this.state.newsCount}</p>
                      </div>
                    </div>
                    <div className="ms-Grid-col ms-sm4">
                      <img alt="ss" src={`http://localhost:7777${this.state.selectedItem.imagePath}`} className="avatar-3" />
                    </div>

                  </div>
                </div>
                <hr className="" />
                <div className="action-buttons">
                  <p>Make as Self Admin</p>
                  <DefaultButton className="sp-btn-m sp-btn-danger sp-ml10" onClick={() => this._updateUser('userType', UserType.SelftAdmin)} text="SelfAdmin" />
                </div>
              </div>
            )}
            <p></p>
          </div>

        </div>
        <Dialog
          hidden={!this.state.showDialog}
          onDismiss={this._closeDialog}
          modalProps={{
            styles: { main: { maxWidth: 450 }, },
            isBlocking: true
          }}
        >
          <TextField label="Comment" multiline={true} placeholder="Enter Description" name="Description" errorMessage={this.state.statusMessageErr} value={this.state.statusMessage} onChange={this._statusMessageChangeHandle} required />
          <DialogFooter>
            <DefaultButton onClick={this._submit} className="sp-main-btn float-right btn-login" text="Ok" />
            <DefaultButton onClick={this._closeDialog} className="float-right btn-login" text="Cancel" />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

export default SelfAdminRequests;