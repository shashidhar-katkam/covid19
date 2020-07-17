import * as React from "react";
import MaterialTable from 'material-table';
import { ISavedNews, IStatusForm, NewsType, IHelpDeskCategoryCount, HelpDeskType } from '../../../models/models';
import NewsService from '../service';
import FilesDisplayList from '../utils/FilesDisplayList';
import Service from '../service';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Profile from '../utils/Profile';
import Util from '../../../util';
import Loading from "../../common/Loading";
import EditHelpRequest from "./EditHelpRequest";
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
  newsCountInfo: IHelpDeskCategoryCount;
  status: string;
  currentFilter: string;
  skipIndex: number;
  currentRecords: number;
  pageInfo: IPageInfo;
}

interface IProps {

}

class MainHelpRequests extends React.PureComponent<IProps, IState> {
  private newsService: NewsService;
  private service: Service;
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
      newsCountInfo: { personal: 0, public: 0, all: 0 },
      skipIndex: 0,
      currentRecords: 0,
      currentFilter: 'All',
      pageInfo: { currentPage: 0, totalPages: 0 },

    }
    this.newsService = new NewsService();
    this.service = new Service();
    this._onItemSelected = this._onItemSelected.bind(this);
    this._closeDialog = this._closeDialog.bind(this);
    this._afterStatusUpdated = this._afterStatusUpdated.bind(this);
    this._reloadData = this._reloadData.bind(this);
    this._fetchNextOrPrevisousRecords = this._fetchNextOrPrevisousRecords.bind(this);
    this._toggleShowCompleteInfo = this._toggleShowCompleteInfo.bind(this);
    this._updateNews = this._updateNews.bind(this);
    this._onStatusFilterChange = this._onStatusFilterChange.bind(this);
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
    this.newsService.getHelpRequestsCountByCategory({}).then((res: any) => {
      if (res.status) {
        let newsCountInfo: any = {};
        res.data.forEach((c: any) => {
          newsCountInfo[c._id] = c.count;
        });
        if (newsCountInfo.personal === undefined) {
          newsCountInfo.personal = 0;
        }
        if (newsCountInfo.public === undefined) {
          newsCountInfo.public = 0;
        }
        newsCountInfo['all'] = newsCountInfo.personal + newsCountInfo.public;

        this.newsService.getAllEnHelpReqestsForAdmin({ skip: 0 }).then((res: any) => {
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

      this.newsService.getAllEnHelpReqestsForAdmin(filter).then((res: any) => {
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

      this.newsService.getAllEnHelpReqestsForAdmin(filter).then((res: any) => {
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

  private _afterStatusUpdated(id: string) {
    this._reloadData();
  }

  private _onStatusFilterChange(option: string) {
    if (option !== this.state.currentFilter) {
      this.setState({
        isLoading: true,
        selectedItem: null,
        changeStatus: false,
      });

      if (option === 'All') {
        this.newsService.getAllEnHelpReqestsForAdmin({ skip: 0 }).then((res: any) => {
          if (res.status) {
            let data: ISavedNews[] = res.data;
            this.setState({
              allNews: data,
              isLoading: false,
              skipIndex: data.length,
              pageInfo: this.getPageInfo(option, this.state.newsCountInfo.all, data.length),
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

      } else if (option === HelpDeskType.Personal) {
        this.newsService.getAllEnHelpReqestsForAdmin({ skip: 0, field: 'Category', value: HelpDeskType.Personal }).then((res: any) => {
          if (res.status) {
            let data: ISavedNews[] = res.data;
            this.setState({
              allNews: data,
              isLoading: false,
              skipIndex: data.length,
              pageInfo: this.getPageInfo(option, this.state.newsCountInfo.personal, data.length),
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

      } else if (option === HelpDeskType.Public) {
        this.newsService.getAllEnHelpReqestsForAdmin({ skip: 0, field: 'Category', value: HelpDeskType.Public }).then((res: any) => {
          if (res.status) {
            let data: ISavedNews[] = res.data;
            this.setState({
              allNews: data,
              isLoading: false,
              skipIndex: data.length,
              pageInfo: this.getPageInfo(option, this.state.newsCountInfo.public, data.length),
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
    this.setState({
      selectedItem: null,
      changeStatus: false,
      isLoading: true
    });

    this.newsService.getHelpRequestsCountByCategory({}).then((res: any) => {
      if (res.status) {
        let data: any[] = res.data;
        let newsCountInfo: any = {};
        data.forEach((c: any) => {
          newsCountInfo[c._id] = c.count;
        });
        if (newsCountInfo.personal === undefined) {
          newsCountInfo.personal = 0;
        }
        if (newsCountInfo.public === undefined) {
          newsCountInfo.public = 0;
        }
        newsCountInfo['all'] = newsCountInfo.personal + newsCountInfo.public;

        this.newsService.getAllEnHelpReqestsForAdmin({ skip: 0 }).then((res: any) => {
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
      <div className="sp-mt10">

        {this.state.newsCountInfo &&
          <div className="news-dashbord">
            <span className="Title"> News Information</span>
            <DefaultButton className="sp-btn-m sp-btn-black sp-float-right" onClick={this._reloadData} text="Reload" />
            <div className="sp-clearFix">
            </div>
            <hr className="sp-hr" />
            <div className="ms-Grid upload" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                  <div className="item-c">
                    <p className="item-title">Total</p>
                    <i className="ms-Icon ms-Icon--Album sp-icon sp-blue sp-float-left" onClick={() => this._onStatusFilterChange("All")} aria-hidden="true"></i>
                    <p className="item-count">
                      {this.state.newsCountInfo.all}
                    </p>
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                  <div className="item-c">
                    <p className="item-title">Personal</p>
                    <i className="ms-Icon ms-Icon--StatusCircleQuestionMark sp-icon sp-yellow sp-float-left" onClick={() => this._onStatusFilterChange(HelpDeskType.Personal)} aria-hidden="true"></i>
                    <p className="item-count">
                      {this.state.newsCountInfo.personal}
                    </p>
                  </div>
                </div>
                <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                  <div className="item-c">
                    <p className="item-title">Public</p>
                    <i className="ms-Icon ms-Icon--Emoji2 sp-icon sp-orange sp-float-left" onClick={() => this._onStatusFilterChange(HelpDeskType.Public)} aria-hidden="true"></i>
                    <p className="item-count">
                      {this.state.newsCountInfo.public}
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
                      <DefaultButton className="sp-btn-m sp-btn-process" onClick={() => this._updateNews('Approved')} text="Edit" />
                    </div>
                  </div>
                )}
                <p></p>
              </div>
              {(this.state.changeStatus && <EditHelpRequest _closeDialog={this._closeDialog} newsInfo={this.state.selectedItem} status={this.state.status} afterStatusUpdated={this._afterStatusUpdated} />)}
            </>}
          </div>
        }
        {isLoading && <Loading />}
      </div>
    );
  }
}

export default MainHelpRequests;