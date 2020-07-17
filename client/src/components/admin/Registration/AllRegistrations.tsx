import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews, AccountStatus, UserType } from '../../../models/models';
import NewsService from '../service';
import Service from '../service';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Loading from "../../common/Loading";
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';


const options: IDropdownOption[] = [
    { key: 'Everything Ok', text: 'Everything Ok' },
    { key: 'Wrong Details Provided', text: 'Wrong Details' }

];


interface IPageInfo {
    totalPages: number;
    currentPage: number;
}

export interface IUserStatusCount {
    Registered: number,
    Verified: number;
    Blocked: number;
    Rejected: number;
    All: number;

}

interface IState {
    allNews: any[];
    allNewsTemp: any[];
    isLoading: boolean;
    selectedItem: any;
    showDialog: boolean;
    statusMessage: string;
    updateField: string;
    statusMessageErr: string;
    status: any;
    isShowCompleteInfo: boolean;
    UsersInfo: any;
    currentFilter: number;
    newsCountInfo: IUserStatusCount;
    skipIndex: number;
    pageInfo: IPageInfo;
    currentFilter1: string;
    currentRecords: number;
}

interface IProps {

}

class AllRegistration extends React.PureComponent<IProps, IState> {
    private newsService: NewsService;
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            allNews: [],
            allNewsTemp: [],
            isLoading: false,
            selectedItem: null,
            showDialog: false,
            statusMessage: '',
            statusMessageErr: '',
            status: null,
            updateField: '',
            isShowCompleteInfo: false,
            UsersInfo: null,
            currentFilter: 1,
            skipIndex: 0,
            newsCountInfo: { Registered: 0, Verified: 0, Blocked: 0, Rejected: 0, All: 0 },
            pageInfo: { currentPage: 0, totalPages: 0 },
            currentFilter1: 'All',
            currentRecords: 0

        }
        this.newsService = new NewsService();
        this.service = new Service();
        this.OnItemSelected = this.OnItemSelected.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this.submit = this.submit.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.toggleShowCompleteInfo = this.toggleShowCompleteInfo.bind(this);
        this.reloadData = this.reloadData.bind(this);
        this.commentChangeHandle = this.commentChangeHandle.bind(this);
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
        this.newsService.getUsersCountByAccountStatus({}).then((res: any) => {
            if (res.status) {
                let newsCountInfo: any = {};
                if (res.data && res.data.length > 0) {
                    res.data.forEach((c: any) => {
                        if (c._id === 1) {
                            newsCountInfo['Registered'] = c.count;
                        } else if (c._id === 2) {
                            newsCountInfo['Verified'] = c.count;
                        } else if (c._id === 3) {
                            newsCountInfo['Blocked'] = c.count;
                        } else if (c._id === 4) {
                            newsCountInfo['Rejected'] = c.count;
                        }
                    });
                }
                if (newsCountInfo.Registered === undefined) {
                    newsCountInfo.Registered = 0;
                }
                if (newsCountInfo.Verified === undefined) {
                    newsCountInfo.Verified = 0;
                }
                if (newsCountInfo.Blocked === undefined) {
                    newsCountInfo.Blocked = 0;
                }
                if (newsCountInfo.Rejected === undefined) {
                    newsCountInfo.Rejected = 0;
                }
                newsCountInfo['All'] = newsCountInfo.Registered + newsCountInfo.Verified + newsCountInfo.Blocked + newsCountInfo.Rejected;
                this.newsService.getAllUsersByFilter3({ skip: this.state.skipIndex }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            isLoading: false,
                            skipIndex: this.state.skipIndex + data.length,
                            pageInfo: this.getPageInfo(this.state.currentFilter1, newsCountInfo.all, this.state.skipIndex + data.length),
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

    private toggleShowCompleteInfo() {
        this.setState((prevState: IState) => {
            return { isShowCompleteInfo: !prevState.isShowCompleteInfo }
        });
    }

    private OnItemSelected(event: any, data: any) {
        this.setState({
            selectedItem: data

        });
    }
    public updateUser(field: string, status: number | string) {
        this.setState({
            updateField: field,
            status: status,
            showDialog: true
        });
    }

    private fetchNextOrPrevisousRecords(where: string) {
        this.setState({
            isLoading: true
        });
        if (where === 'previous') {
            let filter: any = {};
            filter.skip = this.state.skipIndex - 500 - this.state.currentRecords;
            filter.field = "accountStatus";
            if (this.state.currentFilter === AccountStatus.Registered) {
                filter.value = AccountStatus.Registered;
            } else if (this.state.currentFilter === AccountStatus.Verified) {
                filter.value = AccountStatus.Verified;
            } else if (this.state.currentFilter === AccountStatus.Blocked) {
                filter.value = AccountStatus.Blocked;
            } else if (this.state.currentFilter === AccountStatus.Rejected) {
                filter.value = AccountStatus.Rejected;
            }


            this.newsService.getAllUsersByFilter3(filter).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        skipIndex: this.state.skipIndex - 500 - this.state.currentRecords + data.length,
                        pageInfo: this.getPageInfo2(this.state.currentFilter1, this.state.newsCountInfo.All, this.state.skipIndex - 500),
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
            filter.field = "accountStatus";
            if (this.state.currentFilter === AccountStatus.Registered) {
                filter.value = AccountStatus.Registered;
            } else if (this.state.currentFilter === AccountStatus.Verified) {
                filter.value = AccountStatus.Verified;
            } else if (this.state.currentFilter === AccountStatus.Blocked) {
                filter.value = AccountStatus.Blocked;
            } else if (this.state.currentFilter === AccountStatus.Rejected) {
                filter.value = AccountStatus.Rejected;
            }

            this.newsService.getAllUsersByFilter3(filter).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        skipIndex: this.state.skipIndex + data.length,
                        currentRecords: data.length,
                        pageInfo: this.getPageInfo2(this.state.currentFilter1, this.state.newsCountInfo.All, this.state.skipIndex + data.length)
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }
    }

    private submit() {
        if (this.state.statusMessage !== '') {
            this.service.updateProfile({
                field: this.state.updateField,
                data: { id: this.state.selectedItem._id, status: this.state.status, statusMsg: this.state.statusMessage }
            }).then((res: any) => {
                if (res.status) {
                    let d: any[] = [];
                    if (this.state.updateField === "accountStatus") {
                        this.state.allNews.forEach((news: any) => {
                            if (news._id !== this.state.selectedItem._id) {
                                d = [...d, news]
                            }
                        });
                        let newsCountInfo = this.state.newsCountInfo;
                        if (this.state.selectedItem.accountStatus === 1) {
                            if (this.state.status === AccountStatus.Verified) {
                                newsCountInfo.Registered = this.state.newsCountInfo.Registered - 1;
                                newsCountInfo.Verified = this.state.newsCountInfo.Verified + 1;
                            } else if (this.state.status === AccountStatus.Blocked) {
                                newsCountInfo.Registered = this.state.newsCountInfo.Registered - 1;
                                newsCountInfo.Blocked = this.state.newsCountInfo.Blocked + 1;
                            } if (this.state.status === AccountStatus.Rejected) {
                                newsCountInfo.Registered = this.state.newsCountInfo.Registered - 1;
                                newsCountInfo.Rejected = this.state.newsCountInfo.Rejected + 1;
                            }
                        } else if (this.state.selectedItem.accountStatus === 2) {
                            if (this.state.status === AccountStatus.Blocked) {
                                newsCountInfo.Verified = this.state.newsCountInfo.Verified - 1;
                                newsCountInfo.Blocked = this.state.newsCountInfo.Blocked + 1;
                            }
                        } else if (this.state.selectedItem.accountStatus === 3) {
                            if (this.state.status === AccountStatus.Verified) {
                                newsCountInfo.Blocked = this.state.newsCountInfo.Blocked - 1;
                                newsCountInfo.Verified = this.state.newsCountInfo.Verified + 1;
                            }
                        } else if (this.state.selectedItem.accountStatus === 4) {
                            if (this.state.status === AccountStatus.Verified) {
                                newsCountInfo.Rejected = this.state.newsCountInfo.Rejected - 1;
                                newsCountInfo.Verified = this.state.newsCountInfo.Verified + 1;

                            }
                        }
                        this.setState({
                            allNews: d,
                            newsCountInfo: newsCountInfo,
                            selectedItem: null,
                            showDialog: false,
                            status: null,
                            statusMessage: '',
                            updateField: '',
                            isLoading: false
                        });
                    } else {
                        d = this.state.allNews.filter((news: any) => {
                            if (news._id === this.state.selectedItem._id) {
                                news.userType = this.state.status;
                                return news;
                            } else {
                                return news;
                            }
                        });
                        this.setState({
                            allNews: d,
                            selectedItem: null,
                            showDialog: false,
                            status: null,
                            statusMessage: '',
                            updateField: '',
                            isLoading: false
                        });
                    }
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        } else {
            this.setState({
                statusMessageErr: 'Please select Comment.'
            });
        }
    }

    private _closeDialog() {
        this.setState({
            statusMessage: '',
            showDialog: false,
        });
    }


    private commentChangeHandle(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption,) {
        if (option) {
            this.setState({
                statusMessage: option.key as string
            });
        }

    }

    private onStatusFilterChange2(option: string) {
        if (option !== this.state.currentFilter1) {
            this.setState({
                isLoading: true,
                selectedItem: null,
            });

            if (option === 'All') {
                this.newsService.getAllUsersByFilter3({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.All, data.length),
                            currentRecords: data.length,
                            currentFilter1: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === 'Registered') {
                this.newsService.getAllUsersByFilter3({ skip: 0, field: 'accountStatus', value: AccountStatus.Registered }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Registered, data.length),
                            currentRecords: data.length,
                            currentFilter1: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === 'Verified') {
                this.newsService.getAllUsersByFilter3({ skip: 0, field: 'accountStatus', value: AccountStatus.Verified }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Verified, data.length),
                            currentRecords: data.length,
                            currentFilter1: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });

            } else if (option === 'Blocked') {
                this.newsService.getAllUsersByFilter3({ skip: 0, field: 'accountStatus', value: AccountStatus.Blocked }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Blocked, data.length),
                            currentRecords: data.length,
                            currentFilter1: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });
            } else if (option === 'Rejected') {
                this.newsService.getAllUsersByFilter3({ skip: 0, field: 'accountStatus', value: AccountStatus.Rejected }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.Rejected, data.length),
                            currentRecords: data.length,
                            currentFilter1: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                });
            }
        }
        else {
            this.setState({
                isShowCompleteInfo: true
            });
        }
    }

    private reloadData() {
        this.setState({ isLoading: true });
        this.newsService.getUsersCountByAccountStatus({}).then((res: any) => {
            if (res.status) {
                let newsCountInfo: any = {};
                if (res.data && res.data.length > 0) {
                    res.data.forEach((c: any) => {
                        if (c._id === 1) {
                            newsCountInfo['Registered'] = c.count;
                        } else if (c._id === 2) {
                            newsCountInfo['Verified'] = c.count;
                        } else if (c._id === 3) {
                            newsCountInfo['Blocked'] = c.count;
                        } else if (c._id === 4) {
                            newsCountInfo['Rejected'] = c.count;
                        }
                    });
                }
                if (newsCountInfo.Registered === undefined) {
                    newsCountInfo.Registered = 0;
                }
                if (newsCountInfo.Verified === undefined) {
                    newsCountInfo.Verified = 0;
                }
                if (newsCountInfo.Blocked === undefined) {
                    newsCountInfo.Blocked = 0;
                }
                if (newsCountInfo.Rejected === undefined) {
                    newsCountInfo.Rejected = 0;
                }
                newsCountInfo['All'] = newsCountInfo.Registered + newsCountInfo.Verified + newsCountInfo.Blocked + newsCountInfo.Rejected;
                this.newsService.getAllUsersByFilter3({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            isLoading: false,
                            skipIndex: this.state.skipIndex + data.length,
                            pageInfo: this.getPageInfo(this.state.currentFilter1, newsCountInfo.all, this.state.skipIndex + data.length),
                            currentRecords: data.length
                        });

                    } else {
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            isLoading: false
                        });
                    }
                });
            }
            else {
                this.setState({
                    isLoading: false
                });
            }
        });
    }

    render(): JSX.Element {
        const { allNews, isLoading } = this.state;
        return (
            <div>
                {isLoading && <Loading />}
                {this.state.newsCountInfo &&
                    <div className="news-dashbord">
                        <span className="Title"> Users Information</span>
                        <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this.reloadData} text="Reload" />
                        <div className="sp-clearFix">
                        </div>
                        <hr className="sp-hr" />
                        <div className="ms-Grid upload" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Total</p>
                                        <i className="ms-Icon ms-Icon--Album sp-icon sp-blue sp-float-left" onClick={() => this.onStatusFilterChange2('All')} aria-hidden="true"></i>

                                        <p className="item-count">
                                            {this.state.newsCountInfo.All}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Pending</p>
                                        <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-yellow sp-float-left" onClick={() => this.onStatusFilterChange2('Registered')} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Registered}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Active</p>
                                        <i className="ms-Icon ms-Icon--Like sp-icon sp-green sp-float-left" onClick={() => this.onStatusFilterChange2('Verified')} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Verified}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Blocked</p>
                                        <i className="ms-Icon ms-Icon--StatusCircleBlock sp-icon sp-orange sp-float-left" onClick={() => this.onStatusFilterChange2('Blocked')} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Blocked}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col sp-sm20 ">
                                    <div className="item-c">
                                        <p className="item-title">Rejected</p>
                                        <i className="ms-Icon ms-Icon--Dislike sp-icon sp-red sp-float-left" onClick={() => this.onStatusFilterChange2('Rejected')} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.Rejected}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="sp-hr sp-mt30" />
                        <DefaultButton className="sp-btn-m view-all-button" onClick={this.toggleShowCompleteInfo} text={this.state.isShowCompleteInfo ? "Hide Complete Details" : "View Complete Details"} />
                        {this.state.isShowCompleteInfo && <>
                            <div className="material-table">
                                <div className="pagination">
                                    <span className={`nav-btn ${this.state.pageInfo.currentPage === 1 ? 'sp-hide' : ''}`} onClick={() => this.fetchNextOrPrevisousRecords('previous')} title="Previous Page" >&laquo;</span>
                                    <span title="Current Page"  >{`Page ${this.state.pageInfo.currentPage} of ${this.state.pageInfo.totalPages}`} </span>
                                    <span className={`nav-btn ${this.state.pageInfo.currentPage === this.state.pageInfo.totalPages ? 'sp-hide' : ''}`} onClick={() => this.fetchNextOrPrevisousRecords('next')} title="Next Page" >&raquo;</span>
                                </div>
                                <div className="sp-clearFix"></div>
                                <MaterialTable
                                    title="New Registered Users"
                                    style={{ marginTop: "5px", padding: "5px", boxShadow: "none" }}

                                    columns={[
                                        { title: 'First Name', field: 'firstName', tooltip: 'F Name' },
                                        { title: 'Last Name', field: 'lastName', tooltip: 'L Name' },
                                        { title: 'Phone Number', field: 'phoneNumber' },
                                        { title: 'City', field: 'city' },
                                        { title: 'State', field: 'state' },
                                        { title: 'Gender', field: 'gender' }
                                    ]}
                                    data={allNews}
                                    actions={[
                                        {
                                            icon: 'save',
                                            tooltip: 'Save User',
                                            onClick: this.OnItemSelected
                                        }
                                    ]}
                                    onFilterChange={() => { alert('d') }}
                                    options={{
                                        rowStyle: rowData => ({
                                            backgroundColor: (this.state.selectedItem && this.state.selectedItem._id === rowData._id) ? '#EEE' : '#FFF'
                                        })
                                    }}
                                ></MaterialTable>
                            </div>

                            <div>
                                {this.state.selectedItem &&
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
                                                        <p className="sp-no-pm sp-n ms-fontSize-18 sp-mt10"><i className="ms-Icon ms-Icon--Telemarketer" aria-hidden="true"></i>{this.state.selectedItem.accountStatus}</p>
                                                        <p className="sp-no-pm sp-n ms-fontSize-18 sp-mt10">User Type:   {this.state.selectedItem.accountStatus === AccountStatus.Registered ? 'New User' : this.state.selectedItem.accountStatus === AccountStatus.Verified ? 'Active User' : this.state.selectedItem.accountStatus === AccountStatus.Blocked ? 'Blocked User' : 'Rejected User'}</p>
                                                        <p className="sp-no-pm sp-n ms-fontSize-18 sp-mt10">User Privilige:   {this.state.selectedItem.userType === 1 ? 'Normal User' : this.state.selectedItem.userType === 3 ? 'Admin' : this.state.selectedItem.userType === 2 ? 'Self Admin' : 'Super Admin'}</p>
                                                    </div>
                                                </div>
                                                <div className="ms-Grid-col ms-sm4">
                                                    <img src={`http://localhost:7777${this.state.selectedItem.imagePath}`} className="avatar-3" alt="d" />
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="" />
                                        <div className="action-buttons">
                                            {(this.state.selectedItem.accountStatus === AccountStatus.Registered) &&
                                                <DefaultButton className="sp-btn-m sp-green" onClick={() => this.updateUser('accountStatus', AccountStatus.Verified)} text="Approve" />}
                                            {(this.state.selectedItem.accountStatus === AccountStatus.Registered) &&
                                                <DefaultButton className="sp-btn-m sp-red sp-ml10" onClick={() => this.updateUser('accountStatus', AccountStatus.Rejected)} text="Reject" />}
                                            {(this.state.selectedItem.accountStatus === AccountStatus.Verified) &&
                                                <DefaultButton className="sp-btn-m sp-red sp-ml10" onClick={() => this.updateUser('accountStatus', AccountStatus.Blocked)} text="Block" />}
                                            {(this.state.selectedItem.accountStatus === AccountStatus.Blocked) &&
                                                <DefaultButton className="sp-btn-m sp-green sp-ml10" onClick={() => this.updateUser('accountStatus', AccountStatus.Verified)} text="Unblock" />}
                                            {(this.state.selectedItem.accountStatus === AccountStatus.Rejected) &&
                                                <DefaultButton className="sp-btn-m sp-green sp-ml10" onClick={() => this.updateUser('accountStatus', AccountStatus.Verified)} text="Approve" />}
                                            {(this.state.selectedItem.accountStatus === AccountStatus.Verified) && <>
                                                {(this.state.selectedItem.userType !== UserType.Normal) &&
                                                    <DefaultButton className="sp-btn-m sp-black sp-ml10" onClick={() => this.updateUser('userType', UserType.Normal)} text="Make as Normal User" />}
                                                {(this.state.selectedItem.userType !== UserType.Admin) &&
                                                    <DefaultButton className="sp-btn-m sp-yellow sp-ml10" onClick={() => this.updateUser('userType', UserType.Admin)} text="Make as Admin" />}
                                                {(this.state.selectedItem.userType !== UserType.SuperAdmin) &&
                                                    <DefaultButton className="sp-btn-m sp-green sp-ml10" onClick={() => this.updateUser('userType', UserType.SuperAdmin)} text="Make as Super Admin" />}
                                            </>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </>}
                    </div>
                }

                <Dialog
                    hidden={!this.state.showDialog}
                    onDismiss={this._closeDialog}
                    //  dialogContentProps={{
                    //      type: DialogType.normal,
                    //      title: 'Sign In',
                    //      closeButtonAriaLabel: 'Close',
                    //  }}

                    modalProps={{
                        styles: { main: { maxWidth: 450 }, },
                        //  containerClassName: "register-form-dialog",
                        //  onDismissed: this.loginCancel,
                        isBlocking: true
                    }}
                >
                    <Dropdown
                        label="Comment"
                        options={options}
                        errorMessage={this.state.statusMessageErr}
                        selectedKey={this.state.statusMessage}
                        onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => this.commentChangeHandle(event, option)} required
                    />
                    <DialogFooter>
                        <DefaultButton onClick={this.submit} className="sp-main-btn float-right btn-login" text="Ok" />
                        <DefaultButton onClick={this._closeDialog} className="float-right btn-login" text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }
}

export default AllRegistration;