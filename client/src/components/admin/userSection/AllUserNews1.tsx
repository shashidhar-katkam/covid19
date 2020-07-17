import * as React from "react";
import MaterialTable from 'material-table';
import {
    ISavedNews, IStatusForm, IStatusFormErr,
    NewsStatus, IHelpRequestCountByStatus
} from '../../../models/models';
import NewsService from '../service';
import FilesDisplayList from '../utils/FilesDisplayList';
import ApproveForm from './ApproveForm';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Profile from '../utils/Profile';
import Util from '../../../util';
import Loading from "../../common/Loading";
const ShowMoreText = require('react-show-more-text');

interface IPageInfo {
    totalPages: number;
    currentPage: number;
}

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
    showSelfAdminPosted: boolean;
    skipIndex: number;
    filter: IFilter;
    pageInfo: IPageInfo;
    newsCountInfo: IHelpRequestCountByStatus;
    currentRecords: number;
}

interface IProps {

}

class AllUserNews1 extends React.PureComponent<IProps, IState> {
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
            showSelfAdminPosted: false,
            filter: { UserId: '', SelfAdminPosted: false },
            pageInfo: { currentPage: 0, totalPages: 0 },
            skipIndex: 0,
            currentRecords: 0,
            newsCountInfo: { Rejected: 0, Approved: 0, Process: 0, Submitted: 0, All: 0 },

        }
        this.newsService = new NewsService();
        this._onItemSelected = this._onItemSelected.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._afterStatusUpdated = this._afterStatusUpdated.bind(this);
        this._reloadData = this._reloadData.bind(this);
        this._onStatusFilterChange2 = this._onStatusFilterChange2.bind(this);
        this._toggleShowCompleteInfo = this._toggleShowCompleteInfo.bind(this);
        this._fetchNextOrPrevisousRecords = this._fetchNextOrPrevisousRecords.bind(this);
        this._updateNews = this._updateNews.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.newsService.getNewsCountByStatus({}).then((res: any) => {
            if (res.status) {
                let newsCountInfo: any = {};
                res.data.forEach((c: any) => {
                    newsCountInfo[c._id] = c.count;
                });
                if (newsCountInfo.Process === undefined) {
                    newsCountInfo.Process = 0;
                }
                if (newsCountInfo.Submitted === undefined) {
                    newsCountInfo.Submitted = 0;
                }
                if (newsCountInfo.Approved === undefined) {
                    newsCountInfo.Approved = 0;
                }
                if (newsCountInfo.Rejected === undefined) {
                    newsCountInfo.Rejected = 0;
                }
                newsCountInfo['All'] = newsCountInfo.Approved + newsCountInfo.Rejected + newsCountInfo.Submitted + newsCountInfo.Process;
                this.newsService.getAllUserNewsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            isLoading: false,
                            skipIndex: this.state.skipIndex + data.length,
                            pageInfo: this.getPageInfo(this.state.currentFilter, newsCountInfo.all, this.state.skipIndex + data.length),
                            currentRecords: data.length
                        });
                    } else {
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            isLoading: false
                        });
                    }
                });
            } else {
                this.setState({ isLoading: false });
            }
        });
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

    private getPageInfo(currentFilter: string, newsCount: number, skipIndex: number): IPageInfo {
        let totalPages: number = 0;
        let currentPage: number = 0;
        if (newsCount >= 500) {
            let f: number = newsCount / skipIndex
            totalPages = Math.round(f);
            currentPage = Math.round(skipIndex / 500);
        } else {
            totalPages = 1;
            currentPage = 1;
        }

        return { totalPages: totalPages, currentPage: currentPage };
    }

    private getPageInfo2(currentFilter: string, newsCount: number, skipIndex: number): IPageInfo {
        let currentPage: number = 0;
        if (newsCount >= 500) {
            currentPage = Math.round(skipIndex / 500);
        }
        else {
            currentPage = 1;
        }
        return { totalPages: this.state.pageInfo.totalPages, currentPage: currentPage };
    }

    private _fetchNextOrPrevisousRecords(where: string) {
        this.setState({
            isLoading: true
        });
        if (where === 'previous') {
            let filter: any = {};
            filter.skip = this.state.skipIndex - 500 - this.state.currentRecords;
            filter.field = "Status";
            if (this.state.currentFilter === NewsStatus.Submitted) {
                filter.value = NewsStatus.Submitted;
            } else if (this.state.currentFilter === NewsStatus.Process) {
                filter.value = NewsStatus.Process;
            } else if (this.state.currentFilter === NewsStatus.Approved) {
                filter.value = NewsStatus.Approved;
            } else if (this.state.currentFilter === NewsStatus.Rejected) {
                filter.value = NewsStatus.Rejected;
            }

            this.newsService.getAllUserNewsForAdmin(filter).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        skipIndex: this.state.skipIndex - 500 - this.state.currentRecords + data.length,
                        pageInfo: this.getPageInfo2(this.state.currentFilter, this.state.newsCountInfo.All, this.state.skipIndex - 500),
                        currentRecords: data.length
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });

        } else {
            let filter: any = {};
            filter.skip = this.state.skipIndex;
            filter.field = "Status";
            if (this.state.currentFilter === NewsStatus.Submitted) {
                filter.value = NewsStatus.Submitted;
            } else if (this.state.currentFilter === NewsStatus.Process) {
                filter.value = NewsStatus.Process;
            } else if (this.state.currentFilter === NewsStatus.Approved) {
                filter.value = NewsStatus.Approved;
            } else if (this.state.currentFilter === NewsStatus.Rejected) {
                filter.value = NewsStatus.Rejected;
            }

            this.newsService.getAllUserNewsForAdmin(filter).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        skipIndex: this.state.skipIndex + data.length,
                        currentRecords: data.length,
                        pageInfo: this.getPageInfo2(this.state.currentFilter, this.state.newsCountInfo.All, this.state.skipIndex + data.length)
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }
    }

    private _onStatusFilterChange2(option: string) {
        debugger;
        if (option !== this.state.currentFilter) {
            this.setState({
                isLoading: true,
                selectedItem: null,
                changeStatus: false,
            });

            if (option === 'All') {
                this.newsService.getAllUserNewsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.All, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === NewsStatus.Submitted) {
                this.newsService.getAllUserNewsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Submitted }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Submitted, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === NewsStatus.Rejected) {
                this.newsService.getAllUserNewsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Rejected }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Rejected, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === NewsStatus.Process) {
                this.newsService.getAllUserNewsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Process }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Process, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === NewsStatus.Approved) {
                this.newsService.getAllUserNewsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Approved }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Approved, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });
            }
        } else {
            this.setState({
                isShowCompleteInfo: true
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

    public _updateNews(status: string) {
        this.setState((prevState: IState) => ({
            changeStatus: true,
            status: status,
        }));
    }

    public _closeDialog() {
        this.setState({
            changeStatus: false,
            status: ''
        });
    }

    public _afterStatusUpdated(id: string, status?: string) {
        let d = this.state.allNews.filter((news: ISavedNews) => {
            return news._id !== id;
        });

        let newsCountInfo = this.state.newsCountInfo;
        if (this.state.selectedItem.Status === NewsStatus.Submitted) {
            if (status === NewsStatus.Approved) {
                newsCountInfo.Submitted = this.state.newsCountInfo.Submitted - 1;
                newsCountInfo.Approved = this.state.newsCountInfo.Approved + 1;
            } else if (status === NewsStatus.Process) {
                newsCountInfo.Submitted = this.state.newsCountInfo.Submitted - 1;
                newsCountInfo.Process = this.state.newsCountInfo.Process + 1;
            } else if (status === NewsStatus.Rejected) {
                newsCountInfo.Submitted = this.state.newsCountInfo.Submitted - 1;
                newsCountInfo.Rejected = this.state.newsCountInfo.Rejected + 1;
            }
        } else if (this.state.selectedItem.Status === NewsStatus.Process) {
            if (status === NewsStatus.Approved) {
                newsCountInfo.Process = this.state.newsCountInfo.Process - 1;
                newsCountInfo.Approved = this.state.newsCountInfo.Approved + 1;
            } else if (status === NewsStatus.Rejected) {
                newsCountInfo.Process = this.state.newsCountInfo.Process - 1;
                newsCountInfo.Rejected = this.state.newsCountInfo.Rejected + 1;
            }
        } else if (this.state.selectedItem.Status === NewsStatus.Rejected) {
            if (status === NewsStatus.Approved) {
                newsCountInfo.Rejected = this.state.newsCountInfo.Rejected - 1;
                newsCountInfo.Approved = this.state.newsCountInfo.Approved + 1;
            } else if (status === NewsStatus.Rejected) {
                newsCountInfo.Rejected = this.state.newsCountInfo.Rejected - 1;
                newsCountInfo.Process = this.state.newsCountInfo.Process + 1;
            }
        }
        this.setState({
            allNews: d,
            newsCountInfo,
            selectedItem: null,
            changeStatus: false
        });
    }

    private _reloadData() {
        this.setState({ isLoading: true });
        this.newsService.getNewsCountByStatus({}).then((res: any) => {
            if (res.status) {
                let newsCountInfo: any = {};
                res.data.forEach((c: any) => {
                    newsCountInfo[c._id] = c.count;
                });
                if (newsCountInfo.Process === undefined) {
                    newsCountInfo.Process = 0;
                }
                if (newsCountInfo.Submitted === undefined) {
                    newsCountInfo.Submitted = 0;
                }
                if (newsCountInfo.Approved === undefined) {
                    newsCountInfo.Approved = 0;
                }
                if (newsCountInfo.Rejected === undefined) {
                    newsCountInfo.Rejected = 0;
                }
                newsCountInfo['All'] = newsCountInfo.Approved + newsCountInfo.Rejected + newsCountInfo.Submitted + newsCountInfo.Process;

                this.newsService.getAllUserNewsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            isLoading: false,
                            skipIndex: this.state.skipIndex + data.length,
                            pageInfo: this.getPageInfo(this.state.currentFilter, newsCountInfo.all, this.state.skipIndex + data.length),
                            currentRecords: data.length
                        });

                    } else {
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            isLoading: false
                        });
                    }
                });
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
            <>
                {isLoading && <Loading />}
                {this.state.newsCountInfo &&
                    <div className="news-dashbord">
                        <span className="Title"> News Information</span>
                        <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
                        <div className="sp-clearFix">
                        </div>
                        <hr className="sp-hr" />
                        <div className="ms-Grid upload" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col sp-sm20">
                                    <div className="item-c">
                                        <p className="item-title">Total</p>
                                        <i className="ms-Icon ms-Icon--Album sp-icon sp-blue sp-float-left" onClick={() => this._onStatusFilterChange2("All")} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.All}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Pending</p>
                                        <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-yellow sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Submitted)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Submitted}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Process</p>
                                        <i className="ms-Icon ms-Icon--Emoji2 sp-icon sp-orange sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Process)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Process}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Approved</p>
                                        <i className="ms-Icon ms-Icon--Like sp-icon sp-green sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Approved)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Approved}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Rejected</p>
                                        <i className="ms-Icon ms-Icon--Dislike sp-icon sp-red sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Rejected)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Rejected}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="sp-hr sp-mt30" />
                        <DefaultButton className="sp-btn-m view-all-button" onClick={this._toggleShowCompleteInfo} text={this.state.isShowCompleteInfo ? "Hide Complete Details" : "View Complete Details"} />
                        {this.state.isShowCompleteInfo && <>
                            <div className="material-table">
                                <div className="pagination">
                                    <span className={`nav-btn ${this.state.pageInfo.currentPage === 1 ? 'sp-hide' : ''}`} onClick={() => this._fetchNextOrPrevisousRecords('previous')} title="Previous Page" >&laquo;</span>
                                    <span title="Current Page"  >{`Page ${this.state.pageInfo.currentPage} of ${this.state.pageInfo.totalPages}`} </span>
                                    <span className={`nav-btn ${this.state.pageInfo.currentPage === this.state.pageInfo.totalPages ? 'sp-hide' : ''}`} onClick={() => this._fetchNextOrPrevisousRecords('next')} title="Next Page" >&raquo;</span>
                                </div>
                                <div className="sp-clearFix"></div>
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
                                    //  isLoading={this.state.isLoading}
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
                            </div>
                        </>
                        }
                    </div>
                }
            </>
        );
    }
}

export default AllUserNews1;