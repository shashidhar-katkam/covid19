import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews } from '../../../models/models';
import NewsService from '../service';
import FilesDisplayList from '../utils/FilesDisplayList';
import ApproveForm from './EditMainNewsForm';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
  ComboBox, IComboBox, IComboBoxOption, Toggle, IToggleStyles
} from 'office-ui-fabric-react';
import Profile from '../utils/Profile';
import Util from '../../../util';
import Loading from "../../common/Loading";
const ShowMoreText = require('react-show-more-text');

const toggleStyles: Partial<IToggleStyles> = { pill: { backgroundColor: "#0078d4", } };
interface IFilter {
  UserId: string;
  IsTopTen: boolean;
  IsHeadlines: boolean;
  Show: boolean;
}

interface IState {
  allNews: ISavedNews[];
  isLoading: boolean;
  selectedItem: any;
  changeStatus: boolean;
  status: string;
  AllUsers: IComboBoxOption[];
  filter: IFilter,
  searchStatusMessage: string;
}

interface IProps {

}

class SearchNews extends React.PureComponent<IProps, IState> {
  private newsService: NewsService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      allNews: [],
      isLoading: false,
      selectedItem: null,
      changeStatus: false,
      status: '',
      AllUsers: [],
      filter: { UserId: '', IsTopTen: false, IsHeadlines: false, Show: false },
      searchStatusMessage: ''

    }
    this.newsService = new NewsService();
    this._onItemSelected = this._onItemSelected.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._afterStatusUpdated = this._afterStatusUpdated.bind(this);
    this._getUsersBySearch = this._getUsersBySearch.bind(this);
    this._onPendingValueChanged = this._onPendingValueChanged.bind(this);
    this._applyFilter = this._applyFilter.bind(this);
    this._onToggleIsTopTen = this._onToggleIsTopTen.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onToggleIsHeadlines = this._onToggleIsHeadlines.bind(this);
    this._onToggleIsShow = this._onToggleIsShow.bind(this);

    this.newsService.getAllUsersBySearch({ search: '' }).then((res: any) => {
      if (res.status) {
        let users = res.data;
        let AllUsers: IComboBoxOption[] = [];
        if (users) {
          users.forEach((user: any) => {
            AllUsers = [...AllUsers, { key: user._id, text: `${user.firstName} ${user.lastName}` }]
          });
          this.setState({
            AllUsers: AllUsers
          });
        }
      }
    });
  }

  private _getUsersBySearch(event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void {
    if (option && option.key) {
      this.setState({
        filter: { ...this.state.filter, UserId: option.key.toString() }
      })
    } else if (value === "") {
      this.setState({
        filter: { ...this.state.filter, UserId: '' }
      });
    }
  }

  private _onToggleIsTopTen(isChecked?: boolean) {
    if (isChecked !== undefined) {
      this.setState({
        filter: { ...this.state.filter, IsTopTen: isChecked }
      })
    }
  }

  private _onToggleIsShow(isChecked?: boolean) {
    if (isChecked !== undefined) {
      this.setState({
        filter: { ...this.state.filter, Show: isChecked }
      })
    }
  }

  private _onToggleIsHeadlines(isChecked?: boolean) {
    if (isChecked !== undefined) {
      this.setState({
        filter: { ...this.state.filter, IsHeadlines: isChecked }
      })
    }
  }

  private _applyFilter() {
    this.setState({ isLoading: true, selectedItem: null });
    let filter: any = {};
    if (this.state.filter.UserId !== "") {
      filter['User._id'] = this.state.filter.UserId;
    }
    if (this.state.filter.IsTopTen) {
      filter['IsTopTen'] = this.state.filter.IsTopTen;
    }
    if (this.state.filter.IsHeadlines) {
      filter['IsHeadlines'] = this.state.filter.IsHeadlines;
    }

    filter['Show'] = !this.state.filter.Show;

    this.newsService.getAllMainNewsForAdminByFilter(filter).then((res: any) => {
      if (res.status) {
        let data: ISavedNews[] = res.data;
        this.setState({
          allNews: data,
          searchStatusMessage: `${data.length} records found`,
          isLoading: false,
        });
      } else {
        this.setState({
          isLoading: false,
          searchStatusMessage: 'some error occured.'
        });
      }
    });
  }

  private _onPendingValueChanged(option?: IComboBoxOption, index?: number, value?: string): void {
    if (value !== undefined) {
      this.newsService.getAllUsersBySearch({ search: value }).then((res: any) => {
        if (res.status) {
          let users = res.data;
          let AllUsers: any[] = [];
          users.forEach((user: any) => {
            AllUsers = [...AllUsers, { key: user._id, text: `${user.firstName} ${user.lastName}` }]
          });
          this.setState({
            AllUsers: AllUsers
          });
        }
      });
    }
  }

  private _onItemSelected(event: any, data: any) {
    this.setState({
      changeStatus: false,
      selectedItem: data
    });
  }

  private updateNews(status: string) {
    this.setState((prevState: IState) => ({
      changeStatus: true,
      status: status,
    }));
  }

  private _closeDialog() {
    this.setState({
      changeStatus: false,
      status: ''
    });
  }

  private _afterStatusUpdated(id: string) {
    this.setState({
      selectedItem: null,
      changeStatus: false
    });
  }

  private _onSearch(event: any) {
    this.setState({
      filter: { UserId: '', IsTopTen: false, IsHeadlines: false, Show: false },
      isLoading: true,
    });

    this.newsService.getNewsByFilterAll({ filter: event.target.value }).then((res: any) => {
      if (res.status) {
        if (res.data.length > 0) {
          this.setState({
            allNews: res.data,
            searchStatusMessage: `${res.data.length} records found.`,
            isLoading: false
          });
        }
        else {
          this.setState({
            searchStatusMessage: `No records found.`,
            allNews: [],
            isLoading: false
          });
        }
      } else {
        this.setState({
          searchStatusMessage: `some error occured`,
          allNews: [],
          isLoading: false
        });
      }
    })
  }

  render(): JSX.Element {
    const { allNews, isLoading } = this.state;
    return (
      <div className="sp-mt10">
        <>
          <div className="news-dashbord">
            <span className="Title">Search</span>
            <div className="sp-clearFix">
            </div>
            <hr className="sp-hr" />
            <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                  <ComboBox
                    label="Filter by Name"
                    placeholder="Type name.."
                    style={{ width: "260px" }}
                    defaultSelectedKey={this.state.filter.UserId}
                    allowFreeform={true}
                    autoComplete={true ? 'on' : 'off'}
                    onChange={this._getUsersBySearch}
                    onPendingValueChanged={this._onPendingValueChanged}
                    options={this.state.AllUsers}
                  />
                </div>
                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                  <Toggle label="Hidden" checked={this.state.filter.Show} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleIsShow(checked)} />
                </div>
                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                  <Toggle label="Top Ten" checked={this.state.filter.IsTopTen} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleIsTopTen(checked)} />
                </div>
                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                  <Toggle label="Headlines" checked={this.state.filter.IsHeadlines} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleIsHeadlines(checked)} />

                  <style>
                    {` button.pill-121 {
    background: rgb(255, 133, 51) !important;
                     }
                     button.pill-121:hover {
                      background:#FF751A !important;
                                       }
                     
                     `  }
                  </style>
                </div>
                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                  <DefaultButton className="sp-btn-m sp-orange sp-mt30" onClick={this._applyFilter} text="Apply" />
                </div>
              </div>
            </div>
            <hr className="sp-hr sp-mt30" />

            <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                  <TextField label="Search" placeholder="Type something.." onChange={(event: any) => this._onSearch(event)} />
                </div>
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3" style={{ paddingTop: "35px" }}>
                  <p>{this.state.searchStatusMessage}</p>
                </div>
              </div>
            </div>
            <div>
            </div>
            <div className="sp-clearFix" ></div>
            {this.state.allNews.length > 0 && <>
              <div className="material-table">
                <MaterialTable
                  style={{ marginTop: "5px", padding: "5px", boxShadow: "none" }}
                  title="New posts"
                  columns={[
                    { title: 'Title', field: 'Title', tooltip: 'Title' },
                    { title: 'IsHeadlines', field: 'IsHeadlines' },
                    { title: 'Category', field: 'Category' },
                    { title: 'Date', field: 'DateTime' }
                  ]}
                  data={allNews}
                  actions={[
                    {
                      icon: 'edit',
                      tooltip: 'Select news',
                      onClick: this._onItemSelected
                    }
                  ]}
                  options={{
                    rowStyle: rowData => ({
                      backgroundColor: (this.state.selectedItem && this.state.selectedItem._id === rowData._id) ? '#EEE' : '#FFF'
                    })
                  }}
                ></MaterialTable>
              </div>        <div>
                {(this.state.selectedItem &&
                  <div className="selected-item">
                    <h4>News Information </h4>
                    <hr />
                    <div className="ms-Grid" >
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8 msg-details">
                          <h6 className="msg-headings">Title <span className="sp-float-right sp-pointer">
                            {Util.formatAMPM(this.state.selectedItem.DateTime)}
                          </span></h6>
                          <div className="sp-clearFix"></div>
                          <ShowMoreText
                            lines={2}
                            more='Show more'
                            less=' Hide'
                            anchorClass='show-more-link'
                            expanded={false}
                            keepNewLines={true}
                          >
                            {this.state.selectedItem.Title}
                          </ShowMoreText>
                          <h6 className="msg-headings sp-mt10">Description</h6>
                          <ShowMoreText
                            lines={3}
                            more='Show more'
                            less=' Hide'
                            anchorClass='show-more-link'
                            expanded={false}
                            keepNewLines={true}
                          >
                            {this.state.selectedItem.Description}
                          </ShowMoreText>
                          <FilesDisplayList files={this.state.selectedItem.Files}></FilesDisplayList>
                        </div>
                        <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                          <h6>Submitted by </h6>
                          {(this.state.selectedItem.User && this.state.selectedItem.User._id) ?
                            <Profile userId={this.state.selectedItem.User._id} /> : <p>Unknown</p>
                          }
                          <hr />
                          <h6>Reviewed by </h6>
                          {this.state.selectedItem.ReviewerId ?
                            <Profile userId={this.state.selectedItem.ReviewerId} /> : <p>Unknown</p>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <DefaultButton className="sp-btn-m sp-btn-process" onClick={() => this.updateNews('Approved')} text="Edit" />
                    </div>
                  </div>
                )}
                <p></p>
              </div>
              {(this.state.changeStatus && <ApproveForm _closeDialog={this._closeDialog} newsInfo={this.state.selectedItem} status={this.state.status} afterStatusUpdated={this._afterStatusUpdated}></ApproveForm>)}
            </>}
          </div>
        </>
        {isLoading && <Loading />}
      </div>
    );
  }
}

export default SearchNews;