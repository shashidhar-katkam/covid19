import * as React from "react";
import './styles.scss';
import { INewsInfoC } from '../../../models/models';
import { match } from "react-router-dom";
import NewsService from '../Service';
import Main from "./Main";
import Navbar from "../Navbar";
import Secondnavbar from "../Navbar/Secondnavbar";
import ListTemplate from "../home/templates/ListTemplate";
import ImageCard from "../home/templates/ImageCards";
import Privacy from "../Privacy";
import Analysis from "../home/templates/Analysis";
import { Shimmer3 } from "../../common/Loading/Shimmers";
import ImageTextCard from "../home/templates/ImageTextCard";

interface IState {
    routeId: string;
    isLoading: boolean;
    newsInfo: any;
}

interface IDetailParams {
    id: string;
}
interface IProps {
    match?: match<IDetailParams>;
}

class NewsInfo extends React.Component<IProps, IState> {
    private service: NewsService;
    constructor(props: IProps) {
        super(props);
        let routeInfo: any = this.props.match;
        this.state = {
            routeId: routeInfo.params.id,
            isLoading: false,
            newsInfo: null
        }

        this.service = new NewsService();
        this.service.getNewsbyID({ id: this.state.routeId }).then((res: any) => {
            if (res && res.status && res.data) {
                this.setState({
                    newsInfo: res.data[0],
                });
            }

        });
    }


    componentWillReceiveProps(newProps: IProps) {
        let routeInfo: any = newProps.match;
        let routeId = routeInfo.params.id;
        if (this.state.routeId !== routeId) {
            this.setState({
                isLoading: true,
                newsInfo: null
            });
            this.service.getNewsbyID({ id: routeId }).then((res: any) => {
                if (res && res.status && res.data) {
                    this.setState({
                        newsInfo: res.data[0],
                        routeId: routeId,
                        isLoading: false
                    });
                    window.scrollTo(0, 0);
                } else {
                    this.setState({
                        isLoading: false
                    });
                }

            });
        }
    }


    public render(): JSX.Element {
        let newsInfo: INewsInfoC = this.state.newsInfo;
        return (
            <>
                <Navbar />
                {/* <Secondnavbar /> */}
                <div className="sp-container main-container" >
                    <div className="ms-Grid" dir="ltr">
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-sm12 ms-md8 ms-lg7-5 ">
                                {this.state.isLoading &&
                                    <div className="shimmer-main-w"> <Shimmer3 /> </div>}
                                {newsInfo &&
                                    <div className="news-info1">
                                        <Analysis news={newsInfo} />
                                    </div>
                                }
                                <Main skipNewsId={this.state.routeId} />
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

export default NewsInfo;