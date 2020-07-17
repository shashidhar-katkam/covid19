import * as React from "react";
import './styles.scss';
import { INewsInfoC, MainNewsModel } from '../../../models/models';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import NewsService from '../Service';
import { socket } from "../../../app";
import Analysis from "../home/templates/Analysis";

interface IState {
    AllInfo: any[];
    Index: number;
    allNews: INewsInfoC[];
    isLoading: boolean;
    scrollPosition: number;
    skipTotal: number;
    skipNewsId?: string;
    isLoadNext: boolean;
}

interface IProps extends RouteComponentProps {
    skipNewsId?: string;
}

class Main extends React.Component<IProps, IState> {
    private language: string;
    ddd = localStorage.getItem('language');
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            AllInfo: [],
            Index: 0,
            allNews: [],
            isLoading: false,
            scrollPosition: 0,
            skipTotal: 0,
            skipNewsId: this.props.skipNewsId,
            isLoadNext: false

        }
        this.language = this.ddd ? this.ddd : 'en';

        this.NavBtnClicked = this.NavBtnClicked.bind(this);
        this.newsService = new NewsService();
        this.showNews = this.showNews.bind(this);
        this.onScrollEvent = this.onScrollEvent.bind(this);
        this._onUserClick = this._onUserClick.bind(this);
    }

    componentWillReceiveProps(newProps: IProps) {

        if (this.state.skipNewsId !== newProps.skipNewsId) {
            this.setState({
                skipNewsId: newProps.skipNewsId
            });
        }
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
        if (window.pageYOffset > totalHeight - 1300 && !this.state.isLoadNext) {
            this.setState({
                isLoadNext: true
            });

            this.newsService.getOnlyNews({ skip: this.state.skipTotal, category: 'news', skipNewsId: this.state.skipNewsId }).then((res: any) => {
                if (res.status) {
                    let data = res.data;
                    let records: [] = data;
                    let allre: INewsInfoC[] = this.state.allNews;
                    records.forEach((d: any) => {
                        allre = [...allre, d];
                    });
                    this.setState((prevState: IState) => {
                        return {
                            allNews: allre,
                            isLoading: false,
                            scrollPosition: window.scrollY,
                            skipTotal: prevState.skipTotal + data.length,
                            isLoadNext: false
                        }
                    });
                } else {
                    this.setState({
                        isLoadNext: false
                    });
                }
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
        this.newsService.getOnlyNews({ skip: this.state.skipTotal, category: 'news', skipNewsId: this.state.skipNewsId }).then((res: any) => {
            if (res.status) {
                let data = res.data;
                this.setState({
                    allNews: data,
                    isLoading: false,
                    scrollPosition: window.scrollY,
                    skipTotal: 20
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
        this.props.history.push(`/newsi/${id}`);
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.state.allNews && this.state.allNews.length > 0 && this.state.allNews.map((news: INewsInfoC) => {
                    return <Analysis news={news} />
                })}
            </div>
        );
    }
}

export default withRouter(Main);