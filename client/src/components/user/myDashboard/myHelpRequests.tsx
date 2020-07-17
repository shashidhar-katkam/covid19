import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews, NewsStatus, IDialogPropss } from '../../../models/models';
import Service from '../Service';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import './styles.scss';
import HelpRequestDetails from "./HelpRequestDetails";
import Loading from "../../common/Loading";
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';


interface IState {
  allNews: ISavedNews[];
  allNewsTemp: ISavedNews[];
  data: any;
  isLoading: boolean;
  isShowCompleteInfo: boolean;
  currentFilter: string;
  DialogProps: IDialogPropss;
  selectedItem: any;
}

interface IProps {
}

class MyHelpRequets extends React.Component<IProps, IState> {
  private service: Service;
  constructor(props: IProps) {
    super(props);
    this.state = {
      allNews: [],
      allNewsTemp: [],
      data: null,
      currentFilter: '',
      isLoading: false,
      isShowCompleteInfo: false,
      selectedItem: null,
      DialogProps: { show: false, message: '' }
    }
    this.service = new Service();
    this._onItemSelected = this._onItemSelected.bind(this);
    this._reloadData = this._reloadData.bind(this);
    this._onStatusFilterChange = this._onStatusFilterChange.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._toggleShowCompleteInfo = this._toggleShowCompleteInfo.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.service.getMyHelpRequests().then((res: any) => {
      
      if (res.status) {


        let data: ISavedNews[] = res.data;
        if (data && data.length > 0) {
          let approvedItems: any[] = [];
          let rejectedItems: any[] = [];
          let pendingItems: any[] = [];
          data.forEach((item: any) => {
            if (item.Status === NewsStatus.Approved) {
              approvedItems = [...approvedItems, item];
            } else if (item.Status === NewsStatus.Rejected) {
              rejectedItems = [...rejectedItems, item];
            } else if (item.Status === NewsStatus.Process || item.Status === NewsStatus.Submitted) {
              pendingItems = [...pendingItems, item];
            }
          });
          let dataa: any = {};
          dataa['Rejected'] = rejectedItems.length;
          dataa['Approved'] = approvedItems.length;
          dataa['Submitted'] = pendingItems.length;

          this.setState({
            allNews: data,
            allNewsTemp: data,
            data: dataa,
            isLoading: false
          });
        } else if (data && data.length === 0) {
          let dataa: any = {};
          dataa['Rejected'] = 0;
          dataa['Approved'] = 0;
          dataa['Submitted'] = 0;

          this.setState({
            allNews: data,
            allNewsTemp: data,
            data: dataa,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      } else {
        this.setState({
          DialogProps: { show: true, message: res.message },
          isLoading: false
        });
      }

    });

  }

  private _closeDialog() {
    this.setState({
      DialogProps: { show: false, message: '' }
    });
  }

  private _reloadData() {
    this.setState({ isLoading: true, currentFilter: '' });
    this.service.getAllNewsPostedByMe().then((res: any) => {
      if (res.status) {
        let data: ISavedNews[] = res.data;
        if (data && data.length > 0) {

          let approvedItems: any[] = [];
          let rejectedItems: any[] = [];
          let pendingItems: any[] = [];
          data.forEach((item: any) => {
            if (item.Status === NewsStatus.Approved) {
              approvedItems = [...approvedItems, item];
            } else if (item.Status === NewsStatus.Rejected) {
              rejectedItems = [...rejectedItems, item];
            } else if (item.Status === NewsStatus.Process || item.Status === NewsStatus.Submitted) {
              pendingItems = [...pendingItems, item];
            }
          });
          let dataa: any = {};
          dataa['Rejected'] = rejectedItems.length;
          dataa['Approved'] = approvedItems.length;
          dataa['Submitted'] = pendingItems.length;

          this.setState({
            allNews: data,
            allNewsTemp: data,
            data: dataa,
            isLoading: false
          });
        } else if (data && data.length === 0) {
          let dataa: any = {};
          dataa['Rejected'] = 0;
          dataa['Approved'] = 0;
          dataa['Submitted'] = 0;

          this.setState({
            allNews: data,
            allNewsTemp: data,
            data: dataa,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      } else {
        this.setState({ isLoading: false });
      }
    });
  }

  private _onStatusFilterChange(option: string) {
    if (option !== this.state.currentFilter) {
      this.setState({
        isLoading: true,
        selectedItem: null
      });
      if (option === NewsStatus.Approved) {
        let tempNews: any[] = [];
        this.state.allNewsTemp.forEach((item: any) => {
          if (item.Status === NewsStatus.Approved) {
            tempNews = [...tempNews, item];
          }
        });
        this.setState({
          allNews: tempNews,
          isLoading: false,
          currentFilter: option,
          isShowCompleteInfo: true
        });
      } else if (option === NewsStatus.Rejected) {
        let tempNews: any[] = [];
        this.state.allNewsTemp.forEach((item: any) => {
          if (item.Status === NewsStatus.Rejected) {
            tempNews = [...tempNews, item];
          }
        });

        this.setState({
          allNews: tempNews,
          isLoading: false,
          currentFilter: option,
          isShowCompleteInfo: true

        });
      } else if (option === NewsStatus.Submitted) {
        let tempNews: any[] = [];
        this.state.allNewsTemp.forEach((item: any) => {
          if (item.Status === NewsStatus.Submitted || item.Status === NewsStatus.Process) {
            tempNews = [...tempNews, item];
          }
        });

        this.setState({
          allNews: tempNews,
          isLoading: false,
          currentFilter: option,
          isShowCompleteInfo: true

        });
      } else {
        this.setState({
          allNews: this.state.allNewsTemp,
          isLoading: false,
          currentFilter: option,
          isShowCompleteInfo: true
        });
      }
    }
  }

  private _toggleShowCompleteInfo() {
    this.setState((prevState: IState) => {
      return { isShowCompleteInfo: !prevState.isShowCompleteInfo }
    });
  }

  private _onItemSelected(event: any, data: any) {
    this.setState({
      selectedItem: data
    });
  }

  render(): JSX.Element {
    const { allNews, isLoading } = this.state;
    return (
      <div>
        {isLoading && <Loading />}
        {this.state.data &&
          <div className="news-dashbord">
            <span className="Title"> News Information</span>
            <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
            <div className="sp-clearFix">
            </div>
            <hr className="sp-hr" />
            <div className="ms-Grid upload" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ">
                  <div className="item-c">
                    <i className="ms-Icon ms-Icon--Album sp-icon sp-blue sp-float-left" onClick={() => this._onStatusFilterChange("All")} aria-hidden="true"></i>
                    <p className="item-title">Total</p>
                    <p className="item-count">
                      {this.state.data.Rejected + this.state.data.Approved + this.state.data.Submitted}
                    </p>
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ">
                  <div className="item-c">
                    <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-yellow sp-float-left" onClick={() => this._onStatusFilterChange("Submitted")} aria-hidden="true"></i>
                    <p className="item-title">Pending</p>
                    <p className="item-count">
                      {this.state.data.Submitted}
                    </p>
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ">
                  <div className="item-c">
                    <i className="ms-Icon ms-Icon--Like sp-icon sp-green sp-float-left" onClick={() => this._onStatusFilterChange("Approved")} aria-hidden="true"></i>
                    <p className="item-title">Approved</p>
                    <p className="item-count">
                      {this.state.data.Approved}
                    </p>
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 ">
                  <div className="item-c">
                    <i className="ms-Icon ms-Icon--Dislike sp-icon sp-red sp-float-left" onClick={() => this._onStatusFilterChange("Rejected")} aria-hidden="true"></i>
                    <p className="item-title">Rejected</p>
                    <p className="item-count">
                      {this.state.data.Rejected}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="sp-hr sp-mt30" />
            <DefaultButton className="sp-btn-m view-all-button" onClick={this._toggleShowCompleteInfo} text={this.state.isShowCompleteInfo ? "Hide details" : "View details"} />
            {this.state.isShowCompleteInfo && <div>
              <MaterialTable
               style={{ marginTop: "5px", padding: "5px", boxShadow: "none" }}
                title="Help"
                columns={[
                  { title: 'Title', field: 'Title', tooltip: 'Title' },
                  { title: 'Description', field: 'Description' }
                ]}
                data={allNews}
                actions={[
                  {
                    icon: 'edit',
                    tooltip: 'Select news',
                    onClick: this._onItemSelected
                  }
                ]}
                isLoading={this.state.isLoading}
                options={{
                  rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedItem && this.state.selectedItem._id === rowData._id) ? '#EEE' : '#FFF'
                  })
                }}
              ></MaterialTable>
              <div>
                {(this.state.selectedItem &&
                  <HelpRequestDetails Item={this.state.selectedItem} />
                )}
                <p></p>
              </div>
            </div>}
          </div>
        }
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

export default MyHelpRequets;