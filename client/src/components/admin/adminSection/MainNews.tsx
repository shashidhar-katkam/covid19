import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews, IStatusForm, INewsCategoryCount, NewsType } from '../../../models/models';
import NewsService from '../service';
import FilesDisplayList from '../utils/FilesDisplayList';
import EditMainNews from './EditMainNewsForm';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Profile from '../utils/Profile';
import Util from '../../../util';
import InLoading from "../../common/InLoading";
import Loading from "../../common/Loading";
const ShowMoreText = require('react-show-more-text');

interface IPageInfo {
    totalPages: number;
    currentPage: number;
}

interface IState {
    allNews: ISavedNews[];
    isLoading: boolean;
    isLoading2: boolean;
    selectedItem: any;
    changeStatus: boolean;
    statusForm: IStatusForm;
    isShowCompleteInfo: boolean;
    newsCountInfo: INewsCategoryCount;
    status: string;
    currentFilter: string;
    skipIndex: number;
    currentRecords: number;
    pageInfo: IPageInfo;
}

interface IProps {

}

class MainNews extends React.PureComponent<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            allNews: [],
            isLoading: false,
            isLoading2: false,
            selectedItem: null,
            changeStatus: false,
            statusForm: { statusMessage: '', status: '' },
            status: '',
            isShowCompleteInfo: false,
            newsCountInfo: { article: 0, info: 0, news: 0, all: 0 },
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
        this.newsService.getNewsCountByCategory({}).then((res: any) => {
            if (res.status) {
                let newsCountInfo: any = {};
                if (res.data && res.data.length > 0) {
                    res.data.forEach((c: any) => {
                        newsCountInfo[c._id] = c.count;
                    });
                }
                if (newsCountInfo.article === undefined) {
                    newsCountInfo.article = 0;
                }
                if (newsCountInfo.info === undefined) {
                    newsCountInfo.info = 0;
                }
                if (newsCountInfo.news === undefined) {
                    newsCountInfo.news = 0;
                }
                newsCountInfo['all'] = newsCountInfo.article + newsCountInfo.info + newsCountInfo.news;
                this.newsService.getAllMainNewsForAdmin({ skip: this.state.skipIndex }).then((res: any) => {
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

    componentDidUpdate() {
        window.scrollTo(0, document.documentElement.scrollHeight);
    }

    private _fetchNextOrPrevisousRecords(where: string) {
        this.setState({
            isLoading: true
        });
        if (where === 'previous') {
            let filter: any = {};
            filter.skip = this.state.skipIndex - 500 - this.state.currentRecords;
            if (this.state.currentFilter === NewsType.New) {
                filter.field = "Category";
                filter.value = NewsType.New;
            } else if (this.state.currentFilter === NewsType.Article) {
                filter.field = "Category";
                filter.value = NewsType.Article;
            } else if (this.state.currentFilter === NewsType.Info) {
                filter.field = "Category";
                filter.value = NewsType.Info;
            }

            this.newsService.getAllMainNewsForAdmin(filter).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        skipIndex: this.state.skipIndex - 500 - this.state.currentRecords + data.length,
                        pageInfo: this.getPageInfo2(this.state.currentFilter, this.state.newsCountInfo.all, this.state.skipIndex - 500),
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
            if (this.state.currentFilter === NewsType.New) {
                filter.field = "Category";
                filter.value = NewsType.New;
            } else if (this.state.currentFilter === NewsType.Article) {
                filter.field = "Category";
                filter.value = NewsType.Article;
            } else if (this.state.currentFilter === NewsType.Info) {
                filter.field = "Category";
                filter.value = NewsType.Info;
            }
            this.newsService.getAllMainNewsForAdmin(filter).then((res: any) => {
                if (res.status) {
                    let data: ISavedNews[] = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        skipIndex: this.state.skipIndex + data.length,
                        currentRecords: data.length,
                        pageInfo: this.getPageInfo2(this.state.currentFilter, this.state.newsCountInfo.all, this.state.skipIndex + data.length)
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

    public _afterStatusUpdated(id: string) {
        // let d = this.state.allNews.filter((news: ISavedNews) => {
        //     return news._id !== id;
        // });
        // this.setState({
        //     // allNews: d,
        //     selectedItem: null,
        //     changeStatus: false
        // });

        this._reloadData();

    }

    private _onStatusFilterChange2(option: string) {
        if (option !== this.state.currentFilter) {
            this.setState({
                isLoading2: true,
                selectedItem: null,
                changeStatus: false,
            });

            if (option === 'All') {
                this.newsService.getAllMainNewsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading2: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.all, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading2: false
                        });
                    }
                });
            } else if (option === NewsType.New) {
                this.newsService.getAllMainNewsForAdmin({ skip: 0, field: 'Category', value: NewsType.New }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading2: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.news, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading2: false
                        });
                    }
                });
            } else if (option === NewsType.Article) {
                this.newsService.getAllMainNewsForAdmin({ skip: 0, field: 'Category', value: NewsType.Article }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading2: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.article, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading2: false
                        });
                    }
                });

            } else if (option === NewsType.Info) {
                this.newsService.getAllMainNewsForAdmin({ skip: 0, field: 'Category', value: NewsType.Info }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            allNews: data,
                            isLoading2: false,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo(option, this.state.newsCountInfo.info, data.length),
                            currentRecords: data.length,
                            currentFilter: option,
                            isShowCompleteInfo: true
                        });
                    } else {
                        this.setState({
                            isLoading2: false
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
        this.setState({
            isLoading2: true,
            selectedItem: null,
            isShowCompleteInfo: false,
            changeStatus: false
        });
        this.newsService.getNewsCountByCategory({}).then((res: any) => {
            if (res.status) {
                let newsCountInfo: any = {};
                if (res.data && res.data.length > 0) {
                    res.data.forEach((c: any) => {
                        newsCountInfo[c._id] = c.count;
                    });
                }
                if (newsCountInfo.article === undefined) {
                    newsCountInfo.article = 0;
                }
                if (newsCountInfo.info === undefined) {
                    newsCountInfo.info = 0;
                }
                if (newsCountInfo.news === undefined) {
                    newsCountInfo.news = 0;
                }
                newsCountInfo['all'] = newsCountInfo.article + newsCountInfo.info + newsCountInfo.news;
                this.newsService.getAllMainNewsForAdmin({ skip: 0 }).then((res: any) => {
                    if (res.status) {
                        let data: ISavedNews[] = res.data;
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            allNews: data,
                            skipIndex: data.length,
                            pageInfo: this.getPageInfo('All', newsCountInfo.all, data.length),
                            currentRecords: data.length,
                            currentFilter: 'All',
                            isLoading2: false,
                        });
                    } else {
                        this.setState({
                            newsCountInfo: newsCountInfo,
                            isLoading2: false
                        });
                    }
                });
            } else {
                this.setState({
                    isLoading2: false
                });
            }
        });
    }

    public render(): JSX.Element {
        const { allNews, isLoading, isLoading2 } = this.state;

        return (
            <div style={{ height: '100% !important', minHeight: '100%' }}>
                {isLoading && <InLoading />}
                {isLoading2 && <Loading />}
                {!isLoading && this.state.newsCountInfo &&
                    <div className="news-dashbord">
                        <span className="Title"> News Information</span>
                        <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
                        <div className="sp-clearFix">
                        </div>
                        <hr className="sp-hr" />
                        <div className="ms-Grid upload" dir="ltr">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                                    <div className="item-c">
                                        <p className="item-title">Total</p>
                                        <i className="ms-Icon ms-Icon--Album sp-icon sp-blue sp-float-left" onClick={() => this._onStatusFilterChange2("All")} aria-hidden="true"></i>

                                        <p className="item-count">
                                            {this.state.newsCountInfo.article + this.state.newsCountInfo.info + this.state.newsCountInfo.news}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                                    <div className="item-c">
                                        <p className="item-title">News</p>
                                        <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-yellow sp-float-left" onClick={() => this._onStatusFilterChange2(NewsType.New)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.news}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                                    <div className="item-c">
                                        <p className="item-title">Info</p>
                                        <i className="ms-Icon ms-Icon--Emoji2 sp-icon sp-red sp-float-left" onClick={() => this._onStatusFilterChange2(NewsType.Info)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.info}
                                        </p>
                                    </div>
                                </div>
                                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">
                                    <div className="item-c">
                                        <p className="item-title">Article</p>
                                        <i className="ms-Icon ms-Icon--Like sp-icon sp-green sp-float-left" onClick={() => this._onStatusFilterChange2(NewsType.Article)} aria-hidden="true"></i>
                                        <p className="item-count">
                                            {this.state.newsCountInfo.article}
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
                            </div>
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
                                                    {this.state.selectedItem.Analysis1 !== null && this.state.selectedItem.Analysis1 !== undefined && this.state.selectedItem.Analysis1 !== '' &&
                                                        <>
                                                            <p className="an-heading">Analysis 1:</p>
                                                            <div className="an-text">
                                                                <ShowMoreText
                                                                    lines={3}
                                                                    more={'Readmore'}
                                                                    less={'hide'}
                                                                    anchorClass='show-more-link'
                                                                    expanded={false}
                                                                    keepNewLines={true}
                                                                >
                                                                    {this.state.selectedItem.Analysis1}
                                                                </ShowMoreText>
                                                            </div>
                                                        </>}
                                                    {this.state.selectedItem.Analysis2 !== null && this.state.selectedItem.Analysis2 !== undefined && this.state.selectedItem.Analysis2 !== '' &&
                                                        <>
                                                            <p className="an-heading">Analysis 2:</p>
                                                            <div className="an-text">
                                                                <ShowMoreText
                                                                    lines={3}
                                                                    more={'Readmore'}
                                                                    less={'hide'}
                                                                    anchorClass='show-more-link'
                                                                    expanded={false}
                                                                    keepNewLines={true}
                                                                >
                                                                    {this.state.selectedItem.Analysis2}
                                                                </ShowMoreText>
                                                            </div>
                                                        </>}
                                                    {this.state.selectedItem.Analysis3 !== null && this.state.selectedItem.Analysis3 !== undefined && this.state.selectedItem.Analysis3 !== '' &&
                                                        <>
                                                            <p className="an-heading">Analysis 3:</p>
                                                            <div className="an-text">
                                                                <ShowMoreText
                                                                    lines={3}
                                                                    more={'Readmore'}
                                                                    less={'hide'}
                                                                    anchorClass='show-more-link'
                                                                    expanded={false}
                                                                    keepNewLines={true}
                                                                >
                                                                    {this.state.selectedItem.Analysis3}
                                                                </ShowMoreText>
                                                            </div>
                                                        </>}


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
                                            <DefaultButton className="sp-btn-m sp-orange" onClick={() => this._updateNews('Approved')} text="Edit" />
                                        </div>
                                    </div>
                                )}
                                <p></p>
                            </div>
                            {(this.state.changeStatus && <EditMainNews _closeDialog={this._closeDialog} newsInfo={this.state.selectedItem} status={this.state.status} afterStatusUpdated={this._afterStatusUpdated}></EditMainNews>)}
                        </>}
                    </div>
                }
            </div>
        );
    }
}

export default MainNews;