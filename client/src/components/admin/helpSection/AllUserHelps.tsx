import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews, IStatusForm, NewsStatus, IHelpRequestCountByStatus } from '../../../models/models';
import NewsService from '../service';
import FilesDisplayList from '../utils/FilesDisplayList';
import ApproveForm from './ApproveForm';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Profile from '../utils/Profile';
import Util from '../../../util';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import Loading from "../../common/Loading";
const ShowMoreText = require('react-show-more-text');

interface IPageInfo {
    totalPages: number;
    currentPage: number;
}

interface IState {
    allNews: ISavedNews[];
    isLoading: boolean;
    selectedItem: any;
    changeStatus: boolean;
    statusForm: IStatusForm;
    isShowCompleteInfo: boolean;
    newsCountInfo: IHelpRequestCountByStatus;
    status: string;
    currentFilter: string;
    skipIndex: number;
    currentRecords: number;
    pageInfo: IPageInfo;
}

interface IProps {

}

class AllUserHelps extends React.PureComponent<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            allNews: [],
            isLoading: false,
            selectedItem: null,
            changeStatus: false,
            statusForm: { statusMessage: '', status: '' },
            status: '',
            isShowCompleteInfo: false,
            newsCountInfo: { Rejected: 0, Approved: 0, Process: 0, Submitted: 0, All: 0 },
            skipIndex: 0,
            currentRecords: 0,
            currentFilter: 'All',
            pageInfo: { currentPage: 0, totalPages: 0 }

        }
        this.newsService = new NewsService();
        this._onItemSelected = this._onItemSelected.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._afterStatusUpdated = this._afterStatusUpdated.bind(this);
        this._reloadData = this._reloadData.bind(this);
        this._onStatusFilterChange = this._onStatusFilterChange.bind(this);
        this._fetchNextOrPrevisousRecords = this._fetchNextOrPrevisousRecords.bind(this);
        this._toggleShowCompleteInfo = this._toggleShowCompleteInfo.bind(this);
        this._updateNews = this._updateNews.bind(this);
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

    componentDidMount() {
        this.setState({ isLoading: true });
        this.newsService.getHelpRequestsCountByStatus({}).then((res: any) => {
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

                this.newsService.getAllHelpReqestsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            isLoading: false,
                            skipIndex: this.state.skipIndex + data.length,
                            pageInfo: this.getPageInfo(this.state.currentFilter, newsCountInfo.All, this.state.skipIndex + data.length),
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

            this.newsService.getAllHelpReqestsForAdmin(filter).then((res: any) => {
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
            this.newsService.getAllHelpReqestsForAdmin(filter).then((res: any) => {
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

    private _onItemSelected(event: any, data: any) {
        this.setState({
            changeStatus: false,
            selectedItem: data
        });
    }

    private _toggleShowCompleteInfo() {
        this.setState((prevState: IState) => {
            return { isShowCompleteInfo: !prevState.isShowCompleteInfo }
        });
    }

    private _onStatusFilterChange(option?: IDropdownOption) {
        let filterQuery;
        if (option) {
            if (option.key === "all") {
                filterQuery = {};
            } else {
                filterQuery = {
                    field: "Category",
                    value: option.key
                }
            }
            this.setState({ isLoading: true });
            this.newsService.getAllHelpReqestsForAdmin(filterQuery).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }
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

    private _onStatusFilterChange2(option: string) {
        if (option !== this.state.currentFilter) {
            this.setState({
                isLoading: true,
                selectedItem: null,
                changeStatus: false,
            });

            if (option === 'All') {
                this.newsService.getAllHelpReqestsForAdmin({ skip: 0 }).then((res: any) => {
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
                this.newsService.getAllHelpReqestsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Submitted }).then((res: any) => {
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
                this.newsService.getAllHelpReqestsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Rejected }).then((res: any) => {
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
                this.newsService.getAllHelpReqestsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Process }).then((res: any) => {
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
                this.newsService.getAllHelpReqestsForAdmin({ skip: 0, field: 'Status', value: NewsStatus.Approved }).then((res: any) => {
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

    private _reloadData() {
        this.setState({ isLoading: true });
        this.newsService.getHelpRequestsCountByStatus({}).then((res: any) => {
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
                this.newsService.getAllHelpReqestsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo('All', newsCountInfo.all, data.length),
                            currentRecords: data.length,
                            currentFilter: 'All',
                            isLoading: false,
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

    render(): JSX.Element {
        const { allNews, isLoading } = this.state;
        return (
            <>
                {this.state.newsCountInfo &&
                    <div className="news-dashbord">
                        <span className="Title"> Help Desk Statistics</span>
                        <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
                        <div className="sp-clearFix">
                        </div>
                        <hr className="sp-hr" />
                        <div className="ms-Grid upload" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col sp-sm20">
                                    <div className="item-c">
                                        <p className="item-title">Total</p>
                                        <i className="ms-Icon ms-Icon--Album sp-icon sp-orange sp-float-left" onClick={() => this._onStatusFilterChange2("All")} aria-hidden="true"></i>

                                        <p className="item-count">
                                            {this.state.newsCountInfo.All}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20">
                                    <div className="item-c">
                                        <p className="item-title">Submitted</p>
                                        <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-blue sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Submitted)} aria-hidden="true"></i>

                                        <p className="item-count">
                                            {this.state.newsCountInfo.Submitted}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20">
                                    <div className="item-c">
                                        <p className="item-title">Process</p>
                                        <i className="ms-Icon ms-Icon--Emoji2 sp-icon sp-yellow sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Process)} aria-hidden="true"></i>

                                        <p className="item-count">
                                            {this.state.newsCountInfo.Process}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20">
                                    <div className="item-c">
                                        <p className="item-title">Approved</p>
                                        <i className="ms-Icon ms-Icon--Like sp-icon sp-green sp-float-left" onClick={() => this._onStatusFilterChange2(NewsStatus.Approved)} aria-hidden="true"></i>

                                        <p className="item-count">
                                            {this.state.newsCountInfo.Approved}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20">
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
                        <div className="sp-clearFix" ></div>
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
                                        { title: 'Description', field: 'Description' },
                                        { title: 'Status', field: 'Status' },
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
                            </div>
                            <div>
                                {(this.state.selectedItem &&
                                    <div className="selected-item">
                                        <h4>Request Details </h4>
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
                                            {this.state.selectedItem.Status !== "Approved" && <DefaultButton className="sp-btn-m sp-btn-success" onClick={() => this._updateNews('Approved')} text="Approve" />}
                                            {this.state.selectedItem.Status !== "Approved" && this.state.selectedItem.Status !== "Process" && <DefaultButton className="sp-btn-m sp-btn-process sp-ml10" onClick={() => this._updateNews('Process')} text="Process" />}
                                            {this.state.selectedItem.Status !== "Approved" && this.state.selectedItem.Status !== "Rejected" && <DefaultButton className="sp-btn-m sp-btn-danger sp-ml10" onClick={() => this._updateNews('Rejected')} text="Reject" />}
                                        </div>
                                    </div>
                                )}
                                <p></p>
                            </div>
                            {(this.state.changeStatus && <ApproveForm _closeDialog={this._closeDialog} newsInfo={this.state.selectedItem} status={this.state.status} afterStatusUpdated={this._afterStatusUpdated}></ApproveForm>)}
                        </>}
                    </div>
                }
                {isLoading && <Loading />}
            </>
        );

    }
}

export default AllUserHelps;