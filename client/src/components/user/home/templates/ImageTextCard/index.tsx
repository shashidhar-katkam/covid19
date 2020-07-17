import * as React from "react";
import './styles.scss';
import { AppState } from "../../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../../Redux/models";
import NewsService from "../../../Service";
import { IUserC, IFileC } from "../../../../../models/models";
import Sources from "../../../../common/Templates/Sources";
import { NavLink } from "react-router-dom";
const TextTruncate = require('react-text-truncate');

interface ITopNews {
    Title: string;
    _id: string;
    Description: string;
    DateTime: string;
    User: IUserC;
    Files: IFileC[];
}
interface IState {
    AllInfo: ITopNews[];
    Index: number;
    isLoading: boolean;
    language: string;
    skip: number;
    stopRequests: boolean;

}

interface IProps {
    User: IUserState;
}

class ImageTextCard extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);

        this.state = {
            AllInfo: [],
            isLoading: false,
            Index: 0,
            language: this.props.User.language,
            skip: 0,
            stopRequests: false

        }
        this.newsService = new NewsService();
        this.NavBtnClicked = this.NavBtnClicked.bind(this);
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

                if (!this.state.stopRequests) {
                    if (this.state.Index > this.state.AllInfo.length - 5) {
                        this.newsService.getTopNews({ skip: this.state.skip }).then((res: any) => {
                            console.log(res);

                            if (res.status) {
                                if (res.data.length > 0) {
                                    let data = res.data;
                                    let allre: ITopNews[] = this.state.AllInfo;
                                    data.forEach((d: any) => {
                                        allre = [...allre, d];
                                    });
                                    this.setState((prevState: IState) => {
                                        return {
                                            AllInfo: allre,
                                            isLoading: false,
                                            skip: data.length > 0 ? prevState.skip + data.length : prevState.skip,
                                        }
                                    });
                                } else {
                                    this.setState({ isLoading: false, stopRequests: true });
                                }

                            } else {
                                this.setState({
                                    isLoading: false
                                });
                            }
                        });
                    }
                }

            } else {
                this.setState((prevStat: IState) => {
                    return { Index: 0 }
                });
            }
        }
    }

    componentWillReceiveProps(newProps: IProps) {
        if (this.state.language !== newProps.User.language) {
            this.setState({
                isLoading: true,
            });

            this.newsService.getTopNews({}).then((res: any) => {
                if (res.status) {
                    let data = res.data;
                    this.setState({
                        AllInfo: data,
                        isLoading: false,
                        language: newProps.User.language
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        language: newProps.User.language
                    });
                }
            });
        }
    }

    componentDidMount() {
        let thisObj = this;
        var myVar = setInterval(function () {
            if (!thisObj.state.stopRequests) {
                if (thisObj.state.AllInfo.length - 1 > thisObj.state.Index) {
                    thisObj.setState((prevStat: IState) => {
                        return { Index: Number(prevStat.Index) + 1 }
                    });

                    if (thisObj.state.Index > thisObj.state.AllInfo.length - 5) {

                        thisObj.newsService.getTopNews({ skip: thisObj.state.skip }).then((res: any) => {
                            console.log(res);
                            debugger;
                            if (res.status) {
                                if (res.data && res.data.length > 0) {
                                    let data = res.data;
                                    let allre: ITopNews[] = thisObj.state.AllInfo;
                                    data.forEach((d: any) => {
                                        allre = [...allre, d];
                                    });
                                    thisObj.setState((prevState: IState) => {
                                        return {
                                            AllInfo: allre,
                                            isLoading: false,
                                            skip: data.length > 0 ? prevState.skip + data.length : prevState.skip,
                                        }
                                    });
                                } else {
                                    thisObj.setState({ isLoading: false, stopRequests: true });
                                }
                            } else {
                                thisObj.setState({
                                    isLoading: false
                                });
                            }
                        });
                    }
                } else {
                    thisObj.setState((prevStat: IState) => {
                        return { Index: 0 }
                    });
                    //   clearInterval(myVar);
                }
            }
        }, 3000);

        this.newsService.getTopNews({}).then((res: any) => {
            console.log(res);
            if (res.status) {
                let data = res.data;
                this.setState({
                    AllInfo: data,
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });
    }

    showSlide(slideNumber: number) {
        this.setState((prevStat: IState) => {
            return { Index: slideNumber }
        });
    }

    public render(): JSX.Element {
        return (<>
            {this.state.AllInfo.length > 0 &&
                <div className="sp-image-card-wrappe1">
                    <div className="card sp-card-img">
                        <p className="heading" >{this.props.User.staticConstants.Constants.imageTextCardTitle}</p>
                        {/* <img className="sp-img" src={`${this.state.AllInfo[this.state.Index].Files}`} alt="cardd" /> */}
                        <Sources Sources={this.state.AllInfo[this.state.Index].Files} isThumbNail={true} onlyOne={true} />
                        <div className="sp-clearFix"></div>
                        <div className="sp-ml10">
                            <h5>{this.state.AllInfo[this.state.Index].Title}</h5>
                            <TextTruncate
                                line={3}
                                element="p"
                                truncateText="…"
                                text={this.state.AllInfo[this.state.Index].Description}
                            />
                            <NavLink className="read-more-li" to={`/newsi/${this.state.AllInfo[this.state.Index]._id}`} >Read More</NavLink>

                        </div>
                        <div className="overlay-img">
                            {(this.state.AllInfo.length - 1 > this.state.Index) && <button className="sp-nav-btn sp-btn-right" onClick={() => this.NavBtnClicked("next")}><i className="ms-Icon ms-Icon--ChevronRight" aria-hidden="true"></i></button>}
                            {(this.state.Index > 0) && <button className="sp-nav-btn sp-btn-left" onClick={() => this.NavBtnClicked("prev")}><i className="ms-Icon ms-Icon--ChevronLeft" aria-hidden="true"></i></button>}
                        </div>
                    </div>
                </div>
            }
        </>

        );
    }

}

//export default ImageTextCard;



const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(ImageTextCard);