import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews, IStatusForm, IStatusFormErr, NewsStatus } from '../../../models/models';
import NewsService from '../service';
import FilesDisplayList from '../utils/FilesDisplayList';
import ApproveForm from './ApproveForm';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import {
    ComboBox, IComboBox, IComboBoxOption
} from 'office-ui-fabric-react';
import Profile from '../utils/Profile';
import Util from '../../../util';
import { Toggle } from "office-ui-fabric-react";
import Loading from "../../common/Loading";
const ShowMoreText = require('react-show-more-text');

interface IFilter {
    UserId: string;
    SelfAdminPosted: boolean;
}

interface IState {
    allNews: ISavedNews[];
    allNewsTemp: ISavedNews[];
    NewsInfo: any;
    isLoading: boolean;
    selectedItem: any;
    changeStatus: boolean;
    statusForm: IStatusForm;
    statusFormErr: IStatusFormErr;
    status: string;
    isShowCompleteInfo: boolean;
    currentFilter: string;
    AllUsers: IComboBoxOption[];
    showSelfAdminPosted: boolean;
    filter: IFilter
}

interface IProps {

}

class SearchUserNews extends React.PureComponent<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            allNews: [],
            allNewsTemp: [],
            isLoading: false,
            selectedItem: null,
            changeStatus: false,
            statusForm: { statusMessage: '', status: '' },
            statusFormErr: { CommentErr: '' },
            status: '',
            isShowCompleteInfo: false,
            NewsInfo: null,
            currentFilter: '',
            AllUsers: [],
            showSelfAdminPosted: false,
            filter: { UserId: '', SelfAdminPosted: false }
        }

        this.newsService = new NewsService();
        this._onItemSelected = this._onItemSelected.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._afterStatusUpdated = this._afterStatusUpdated.bind(this);
        this._reloadData = this._reloadData.bind(this);
        this._onStatusFilterChange = this._onStatusFilterChange.bind(this);
        this._toggleShowCompleteInfo = this._toggleShowCompleteInfo.bind(this);
        this._getUsersBySearch = this._getUsersBySearch.bind(this);
        this._onPendingValueChanged = this._onPendingValueChanged.bind(this);
        this._applyFilter = this._applyFilter.bind(this);
        this._updateNews = this._updateNews.bind(this);

        this.newsService.getAllUsersBySearch({ search: '' }).then((res: any) => {
            if (res.status) {
                let users = res.data;
                let AllUsers: IComboBoxOption[] = [];
                users.forEach((user: any) => {
                    AllUsers = [...AllUsers, { key: user._id, text: `${user.firstName} ${user.lastName}` }]
                });
                this.setState({
                    AllUsers: AllUsers
                });
            } else {

            }
        });
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.newsService.getAllUserPostedNews().then((res: any) => {
            if (res.status) {
                let data: ISavedNews[] = res.data;
                if (data && data.length > 0) {
                    let approvedItems: any[] = [];
                    let rejectedItems: any[] = [];
                    let pendingItems: any[] = [];
                    let submittedItems: any[] = [];
                    data.forEach((item: any) => {
                        if (item.Status === NewsStatus.Approved) {
                            approvedItems = [...approvedItems, item];
                        } else if (item.Status === NewsStatus.Rejected) {
                            rejectedItems = [...rejectedItems, item];
                        } else if (item.Status === NewsStatus.Process) {
                            pendingItems = [...pendingItems, item];
                        } else if (item.Status === NewsStatus.Submitted) {
                            submittedItems = [...submittedItems, item];
                        }
                    });
                    let dataa: any = {};
                    dataa['Rejected'] = rejectedItems.length;
                    dataa['Approved'] = approvedItems.length;
                    dataa['Process'] = pendingItems.length;
                    dataa['Submitted'] = submittedItems.length;
                    this.setState({
                        allNews: data,
                        allNewsTemp: data,
                        NewsInfo: dataa,
                        isLoading: false
                    });
                } else if (data && data.length === 0) {
                    let dataa: any = {};
                    dataa['Rejected'] = 0;
                    dataa['Approved'] = 0;
                    dataa['Submitted'] = 0;
                    dataa['Process'] = 0;
                    this.setState({
                        allNews: data,
                        allNewsTemp: data,
                        NewsInfo: dataa,
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
        //window.scrollTo(0, document.documentElement.scrollHeight);
    }

    private doCal(dat: any) {
        let data: ISavedNews[] = dat;
        if (data && data.length > 0) {
            let approvedItems: any[] = [];
            let rejectedItems: any[] = [];
            let pendingItems: any[] = [];
            let submittedItems: any[] = [];
            data.forEach((item: any) => {
                if (item.Status === NewsStatus.Approved) {
                    approvedItems = [...approvedItems, item];
                } else if (item.Status === NewsStatus.Rejected) {
                    rejectedItems = [...rejectedItems, item];
                } else if (item.Status === NewsStatus.Process) {
                    pendingItems = [...pendingItems, item];
                } else if (item.Status === NewsStatus.Submitted) {
                    submittedItems = [...submittedItems, item];
                }
            });
            let dataa: any = {};
            dataa['Rejected'] = rejectedItems.length;
            dataa['Approved'] = approvedItems.length;
            dataa['Process'] = pendingItems.length;
            dataa['Submitted'] = submittedItems.length;
            let filterdata = this.returnFilterData(data, this.state.currentFilter);
            this.setState({
                allNews: filterdata,
                allNewsTemp: data,
                NewsInfo: dataa,
                selectedItem: null,
                changeStatus: false,
                isLoading: false
            });
        } else if (data && data.length === 0) {
            let dataa: any = {};
            dataa['Rejected'] = 0;
            dataa['Approved'] = 0;
            dataa['Submitted'] = 0;
            dataa['Process'] = 0;
            this.setState({
                allNews: data,
                allNewsTemp: data,
                NewsInfo: dataa,
                selectedItem: null,
                changeStatus: false,
                isLoading: false
            });
        } else {
            this.setState({
                selectedItem: null,
                changeStatus: false,
                isLoading: false
            });
        }
    }

    // componentWillUpdate() {
    //   window.scrollTo(0, document.documentElement.scrollHeight);
    // }

    // UNSAFE_componentWillUpdate() {
    //   window.scrollTo(0, document.documentElement.scrollHeight);
    // }
    // componentDidCatch() {
    //   window.scrollTo(0, document.documentElement.scrollHeight);
    // }

    private _onItemSelected(event: any, data: any) {
        this.setState({
            changeStatus: false,
            selectedItem: data
        });
    }

    private _onStatusFilterChange(option: string) {
        if (option !== this.state.currentFilter) {
            this.setState({
                isLoading: true,
                selectedItem: null,
                changeStatus: false
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
                    if (item.Status === NewsStatus.Submitted) {
                        tempNews = [...tempNews, item];
                    }
                });
                this.setState({
                    allNews: tempNews,
                    isLoading: false,
                    currentFilter: option,
                    isShowCompleteInfo: true
                });
            } else if (option === NewsStatus.Process) {
                let tempNews: any[] = [];
                this.state.allNewsTemp.forEach((item: any) => {
                    if (item.Status === NewsStatus.Process) {
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

    private _onPendingValueChanged(option?: IComboBoxOption, index?: number, value?: string): void {
        if (value !== undefined) {
            this.newsService.getAllUsersBySearch({ search: value }).then((res: any) => {
                let users = res.data;
                let AllUsers: any[] = [];
                users.forEach((user: any) => {
                    AllUsers = [...AllUsers, { key: user._id, text: `${user.firstName} ${user.lastName}` }]
                });
                this.setState({
                    AllUsers: AllUsers
                });
            });
        }
    }

    private returnFilterData(allNewsTemp: any, option: string) {
        if (option === NewsStatus.Approved) {
            let tempNews: any[] = [];
            allNewsTemp.forEach((item: any) => {
                if (item.Status === NewsStatus.Approved) {
                    tempNews = [...tempNews, item];
                }
            });
            return tempNews;
        } else if (option === NewsStatus.Rejected) {
            let tempNews: any[] = [];
            allNewsTemp.forEach((item: any) => {
                if (item.Status === NewsStatus.Rejected) {
                    tempNews = [...tempNews, item];
                }
            });
            return tempNews;
        } else if (option === NewsStatus.Submitted) {
            let tempNews: any[] = [];
            allNewsTemp.forEach((item: any) => {
                if (item.Status === NewsStatus.Submitted) {
                    tempNews = [...tempNews, item];
                }
            });
            return tempNews;
        } else if (option === NewsStatus.Process) {
            let tempNews: any[] = [];
            allNewsTemp.forEach((item: any) => {
                if (item.Status === NewsStatus.Process) {
                    tempNews = [...tempNews, item];
                }
            });
            return tempNews;
        } else {
            return allNewsTemp;
        }
    }

    private _toggleShowCompleteInfo() {
        this.setState((prevState: IState) => {
            return { isShowCompleteInfo: !prevState.isShowCompleteInfo }
        });
    }

    private _onToggleSelfAdminPosted(isChecked?: boolean) {
        if (isChecked !== undefined) {
            this.setState({
                filter: { ...this.state.filter, SelfAdminPosted: isChecked }
            })
        }
    }

    private _applyFilter() {
        this.setState({ isLoading: true });
        this.newsService.getAllUserPostedNewsByFilter(this.state.filter).then((res: any) => {
            if (res.status) {
                let data: ISavedNews[] = res.data;
                if (data && data.length > 0) {
                    let approvedItems: any[] = [];
                    let rejectedItems: any[] = [];
                    let pendingItems: any[] = [];
                    let submittedItems: any[] = [];
                    data.forEach((item: any) => {
                        if (item.Status === NewsStatus.Approved) {
                            approvedItems = [...approvedItems, item];
                        } else if (item.Status === NewsStatus.Rejected) {
                            rejectedItems = [...rejectedItems, item];
                        } else if (item.Status === NewsStatus.Process) {
                            pendingItems = [...pendingItems, item];
                        } else if (item.Status === NewsStatus.Submitted) {
                            submittedItems = [...submittedItems, item];
                        }
                    });
                    let dataa: any = {};
                    dataa['Rejected'] = rejectedItems.length;
                    dataa['Approved'] = approvedItems.length;
                    dataa['Process'] = pendingItems.length;
                    dataa['Submitted'] = submittedItems.length;
                    this.setState({
                        allNews: data,
                        allNewsTemp: data,
                        NewsInfo: dataa,
                        isLoading: false
                    });
                } else if (data && data.length === 0) {
                    let dataa: any = {};
                    dataa['Rejected'] = 0;
                    dataa['Approved'] = 0;
                    dataa['Submitted'] = 0;
                    dataa['Process'] = 0;
                    this.setState({
                        allNews: data,
                        allNewsTemp: data,
                        NewsInfo: dataa,
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

    private _updateNews(status: string) {
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

    private _afterStatusUpdated(id: string, status?: string) {
        let d = this.state.allNewsTemp.filter((news: any) => {
            if (news._id === id) {
                news.Status = status;
                return news;
            } else {
                return news;
            }
        });

        this.doCal(d);
    }

    private _reloadData() {
        this.setState({ isLoading: true });
        this.newsService.getAllUserPostedNews().then((res: any) => {
            if (res.status) {
                let data: ISavedNews[] = res.data;
                if (data && data.length > 0) {
                    let approvedItems: any[] = [];
                    let rejectedItems: any[] = [];
                    let pendingItems: any[] = [];
                    let submittedItems: any[] = [];
                    data.forEach((item: any) => {
                        if (item.Status === NewsStatus.Approved) {
                            approvedItems = [...approvedItems, item];
                        } else if (item.Status === NewsStatus.Rejected) {
                            rejectedItems = [...rejectedItems, item];
                        } else if (item.Status === NewsStatus.Process) {
                            pendingItems = [...pendingItems, item];
                        } else if (item.Status === NewsStatus.Submitted) {
                            submittedItems = [...submittedItems, item];
                        }
                    });
                    let dataa: any = {};
                    dataa['Rejected'] = rejectedItems.length;
                    dataa['Approved'] = approvedItems.length;
                    dataa['Process'] = pendingItems.length;
                    dataa['Submitted'] = submittedItems.length;
                    this.setState({
                        allNews: data,
                        allNewsTemp: data,
                        NewsInfo: dataa,
                        isLoading: false
                    });
                } else if (data && data.length === 0) {
                    let dataa: any = {};
                    dataa['Rejected'] = 0;
                    dataa['Approved'] = 0;
                    dataa['Submitted'] = 0;
                    dataa['Process'] = 0;
                    this.setState({
                        allNews: data,
                        allNewsTemp: data,
                        NewsInfo: dataa,
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

    render(): JSX.Element {
        const { allNews, isLoading } = this.state;
        // window.scrollTo(0, document.documentElement.scrollHeight);
        return (
            <div>
                {isLoading && <Loading />}
                {this.state.NewsInfo &&
                    <div className="news-dashbord">
                        <span className="Title"> News Information</span>
                        <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
                        <div className="sp-clearFix">
                        </div>
                        <hr className="sp-hr" />
                        <div className="ms-Grid upload" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                    <p className="item-title">Total</p>
                                        <i className="ms-Icon ms-Icon--Album sp-icon sp-blue sp-float-left" onClick={() => this._onStatusFilterChange("All")} aria-hidden="true"></i>
                                 
                                        <p className="item-count">
                                            {this.state.NewsInfo.Rejected + this.state.NewsInfo.Approved + this.state.NewsInfo.Submitted + this.state.NewsInfo.Process}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                    <p className="item-title">Pending</p>
                                        <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-yellow sp-float-left" onClick={() => this._onStatusFilterChange(NewsStatus.Submitted)} aria-hidden="true"></i>
                                        
                                        <p className="item-count">
                                            {this.state.NewsInfo.Submitted}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                    <p className="item-title">Process</p>
                                        <i className="ms-Icon ms-Icon--Emoji2 sp-icon sp-orange sp-float-left" onClick={() => this._onStatusFilterChange(NewsStatus.Process)} aria-hidden="true"></i>
                                        

                                        <p className="item-count">
                                            {this.state.NewsInfo.Process}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                    <p className="item-title">Approved</p>
                                        <i className="ms-Icon ms-Icon--Like sp-icon sp-green sp-float-left" onClick={() => this._onStatusFilterChange(NewsStatus.Approved)} aria-hidden="true"></i>
                                        
                                        <p className="item-count">
                                            {this.state.NewsInfo.Approved}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                    <p className="item-title">Rejected</p>
                                        <i className="ms-Icon ms-Icon--Dislike sp-icon sp-red sp-float-left" onClick={() => this._onStatusFilterChange(NewsStatus.Rejected)} aria-hidden="true"></i>
                                        
                                        <p className="item-count">
                                            {this.state.NewsInfo.Rejected}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="sp-hr sp-mt30" />
                        <div className="ms-Grid" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                                    <ComboBox
                                        label="Filter by Name"
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
                                    <Toggle label="Self Admin Posted" checked={this.state.filter.SelfAdminPosted} onText="Yes" offText="No" onChange={(event: React.MouseEvent<HTMLElement>, checked?: boolean) => this._onToggleSelfAdminPosted(checked)} />
                                </div>
                                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                                    <DefaultButton className="sp-btn-m sp-btn-process sp-mt30" onClick={this._applyFilter} text="Apply" />
                                </div>
                            </div>
                        </div>
                        <hr className="sp-hr sp-mt30" />
                        <DefaultButton className="sp-btn-m view-all-button" onClick={this._toggleShowCompleteInfo} text={this.state.isShowCompleteInfo ? "Hide Complete Details" : "View Complete Details"} />
                        {this.state.isShowCompleteInfo && <div>
                            <MaterialTable
                               style={{ marginTop: "5px", padding: "5px", boxShadow: "none" }}
                                title="New posts"
                                columns={[
                                    { title: 'Title', field: 'Title', tooltip: 'Title' },
                                    { title: 'Status', field: 'Status', tooltip: 'Status' },
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
                                //isLoading={this.state.isLoading}
                                options={{
                                    rowStyle: rowData => ({
                                        backgroundColor: (this.state.selectedItem && this.state.selectedItem._id === rowData._id) ? '#EEE' : '#FFF'
                                    })
                                }}
                            ></MaterialTable>
                            <div>
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
                                                    {this.state.selectedItem.User ?
                                                        <Profile userId={this.state.selectedItem.User._id} /> : <p>Unknown</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="action-buttons">
                                            {this.state.selectedItem.Status !== "Approved" && <DefaultButton className="sp-btn-m sp-btn-success" onClick={() => this._updateNews('Approved')} text="Approve" />}
                                            {this.state.selectedItem.Status !== "Approved" && this.state.selectedItem.Status !== "Process" && <DefaultButton className="sp-btn-m sp-btn-process sp-ml10" onClick={() => this._updateNews('Process')} text="Process" />}
                                            {this.state.selectedItem.Status !== "Approved" && this.state.selectedItem.Status !== "Rejected" && <DefaultButton className="sp-btn-m sp-btn-danger sp-ml10" onClick={() => this._updateNews('Rejected')} text="Reject" />}
                                        </div>
                                    </div>
                                )}
                                <p></p>
                            </div>
                            {(this.state.changeStatus && <ApproveForm _closeDialog={this._closeDialog} newsInfo={this.state.selectedItem} status={this.state.status} afterStatusUpdated={this._afterStatusUpdated}></ApproveForm>)}
                        </div>}
                    </div>
                }
            </div>
        );
    }
}

export default SearchUserNews;