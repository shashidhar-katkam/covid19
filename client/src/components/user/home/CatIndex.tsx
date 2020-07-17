import * as React from "react";
import './styles.scss';
import { INewsInfoC, MainNewsModel } from '../../../models/models';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import NewsService from '../Service';
import { socket } from "../../../app";
import ListTemplate from "./templates/ListTemplate";
import ImageCard from "./templates/ImageCards";
import Actions from "./compose";
import Navbar from "../Navbar";
import Secondnavbar from "../Navbar/Secondnavbar";
import Privacy from "../Privacy";
import { Shimmer3 } from "../../common/Loading/Shimmers";
import Analysis from "./templates/Analysis";
import ImageTextCard from "./templates/ImageTextCard";


interface IState {
    AllInfo: any[];
    Index: number;
    allNews: INewsInfoC[];
    isLoading: boolean;
    scrollPosition: number;
    skipTotal: number;
    skipNewsId?: string;
    filter: string;
    stopRequests: boolean;
}

interface IProps extends RouteComponentProps {
    skipNewsId?: string;
}

class CatIndex extends React.Component<IProps, IState> {
    private language: string;
    ddd = localStorage.getItem('language');
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        let routeInfo: any = this.props.match;

        this.state = {
            filter: routeInfo.params.filter,
            AllInfo: [],
            Index: 0,
            allNews: [],
            isLoading: false,
            scrollPosition: 0,
            skipTotal: 0,
            skipNewsId: this.props.skipNewsId,
            stopRequests: false
        }
        this.language = this.ddd ? this.ddd : 'en';
        this.NavBtnClicked = this.NavBtnClicked.bind(this);
        this.newsService = new NewsService();
        this.showNews = this.showNews.bind(this);
        this.onScrollEvent = this.onScrollEvent.bind(this);
        this._onUserClick = this._onUserClick.bind(this);
    }

    public NavBtnClicked(type: any) {
        if (type === "prev") {
            if (this.state.Index > 0) {
                this.setState((prevStat: IState) => {
                    return { Index: Number(prevStat.Index) - 1 }
                });
            }
            else {
                this.setState((prevStat: IState) => {
                    return { Index: prevStat.AllInfo.length - 1 }
                });
            }
        }
        else {
            if (this.state.AllInfo.length - 1 > this.state.Index) {
                this.setState((prevStat: IState) => {
                    return { Index: Number(prevStat.Index) + 1 }
                });
            } else {
                this.setState(() => {
                    return { Index: 0 }
                });
            }
        }
    }

    onScrollEvent() {
        const totalHeight = document.documentElement.scrollHeight;
        if (window.pageYOffset > totalHeight - 1300 && !this.state.isLoading && !this.state.stopRequests) {
            this.setState({
                isLoading: true
            });
            this.newsService.getOnlyNews({ skip: this.state.skipTotal, category: this.state.filter, skipNewsId: this.state.skipNewsId }).then((res: any) => {
                if (res.status) {
                    if (res.data && res.data.length > 0) {
                        let data = res.data;
                        let records: [] = data;
                        let allre: INewsInfoC[] = this.state.allNews;
                        records.forEach((d: any) => {
                            allre = [...allre, d];
                        });
                        if (allre.length > 100) {

                            allre.splice(0, 10);
                        }
                        this.setState((prevState: IState) => {
                            return {
                                allNews: allre,
                                scrollPosition: window.scrollY,
                                skipTotal: prevState.skipTotal + res.data.length,
                                isLoading: false,

                            }
                        });
                    } else {
                        this.setState({ isLoading: false, stopRequests: true });
                    }

                } else {
                    this.setState({ isLoading: false, stopRequests: true });
                }
            });
        }
    }

    componentWillReceiveProps(newProps: IProps) {
        let routeInfo: any = newProps.match;
        let filter = routeInfo.params.filter;
        if (this.state.filter !== filter) {
            this.setState({
                allNews: [],
                isLoading: true
            });
            this.newsService.getOnlyNews({ skip: 0, category: filter }).then((res: any) => {
                if (res.status) {
                    let data = res.data;
                    this.setState({
                        allNews: data,
                        isLoading: false,
                        scrollPosition: window.scrollY,
                        skipTotal: data.length,
                        filter: filter
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        filter: filter
                    });
                }
                window.scrollTo(0, 0);
            });
        }
    }

    componentDidUpdate() {
        window.addEventListener('scroll', this.onScrollEvent);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScrollEvent, { capture: false });
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        this.newsService.getOnlyNews({ skip: this.state.skipTotal, category: this.state.filter, skipNewsId: this.state.skipNewsId }).then((res: any) => {
            if (res.status) {
                let data = res.data;
                this.setState({
                    allNews: data,
                    isLoading: false,
                    scrollPosition: window.scrollY,
                    skipTotal: 10
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });

        socket.on("NewsUpdated", (data: any) => {
            if (this.language === 'en') {
                let newsInfo: any = data.English;
                let allNews: INewsInfoC[] = this.state.allNews;
                let tempNews: INewsInfoC[] = [];
                allNews.forEach((news: INewsInfoC) => {
                    if (news._id === newsInfo._id) {
                        if (newsInfo.Show) {
                            tempNews = [...tempNews, new MainNewsModel(newsInfo)]
                        }
                    } else {
                        tempNews = [...tempNews, news];
                    }
                });
                this.setState({
                    allNews: tempNews
                });
            } else if (this.language === 'te') {
                let newsInfo: any = data.Telugu;
                let allNews: INewsInfoC[] = this.state.allNews;
                let tempNews: INewsInfoC[] = [];
                allNews.forEach((news: INewsInfoC) => {
                    if (news._id === newsInfo._id) {
                        if (newsInfo.Show) {
                            tempNews = [...tempNews, newsInfo]
                        }
                    } else {
                        tempNews = [...tempNews, news];
                    }
                });
                this.setState({
                    allNews: tempNews
                });
            }
        });
    }

    showSlide(slideNumber: number) {
        this.setState(() => {
            return { Index: slideNumber }
        });
    }

    private _onUserClick(id: string) {
        if (id !== null) {
            this.props.history.push(`/user/${id}`);
        }
    }

    showNews(id: string) {
        this.props.history.push(`/infoi/${id}`);
    }

    public render(): JSX.Element {
        return (<>
            <Navbar />
            {/* <Secondnavbar /> */}
            <div className="sp-container main-container" >
                <div className="ms-Grid sp-no-pm" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md8 ms-lg7-5 ">
                            <div className="main-container-wrapper">
                                <Actions />

                                {this.state.allNews && this.state.allNews.length > 0 && this.state.allNews.map((news: INewsInfoC) => {
                                    return <Analysis news={news} />

                                })}

                                {this.state.isLoading && <>
                                    <div className="shimmer-main-w"> <Shimmer3 /> </div>
                                    <div className="shimmer-main-w"> <Shimmer3 /> </div> </>}
                            </div>
                        </div>
                        <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4-5 ms-hiddenSm " >
                            <div className="sticky-right1 cust-scroll" >
                                <ListTemplate></ListTemplate>
                                <ImageTextCard />
                                <ImageCard></ImageCard>
                                <Privacy />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
    }
}

export default withRouter(CatIndex);