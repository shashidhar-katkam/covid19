import * as React from "react";
import './styles.scss';
import { IFileC } from "../../../../../models/models";
import NewsService from "../../../Service";
import Sources from "../../../../common/Templates/Sources";
import { socket } from '../../../../../app';
import { Shimmer3 } from "../../../../common/Loading/Shimmers";
import { AppState } from "../../../../../Redux/app.store";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { IUserState } from "../../../../../Redux/models";

interface IImages {
    _id: string;
    title: string;
    titleTe: string;
    files: IFileC[];
}

interface IState {
    AllInfo: IImages[];
    Index: number;
    isLoading: boolean;
    isLoadNext: boolean;
    skip: number;
}

interface IProps {
    User: IUserState;
}

class ImageCarousel extends React.Component<IProps, IState> {
    private newsService: NewsService;
    private language: string;
    ddd = localStorage.getItem('language');
    constructor(props: IProps) {
        super(props);
        this.state = {
            AllInfo: [],
            Index: 0,
            isLoading: false,
            skip: 0,
            isLoadNext: false
        }
        this.language = this.ddd ? this.ddd : 'en';
        this.NavBtnClicked = this.NavBtnClicked.bind(this);
        this.newsService = new NewsService();
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

        if (!this.state.isLoadNext) {
            if (this.state.Index > this.state.AllInfo.length - 5) {
                this.setState({
                    isLoadNext: true
                });

                this.newsService.getImagesM({ skip: this.state.skip }).then((res: any) => {
                    if (res.status) {
                        let newImages: IImages[] = res.data;
                        let oldImages = this.state.AllInfo;
                        newImages.forEach((image) => {
                            oldImages = [...oldImages, image];
                        });
                        this.setState({
                            AllInfo: oldImages,
                            isLoadNext: false,
                            skip: this.state.skip + newImages.length
                        });
                    } else {
                        this.setState({
                            isLoadNext: false
                        });
                    }
                });
            }
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.newsService.getImagesM({}).then((res: any) => {
            console.log(res);
            if (res.status) {
                this.setState({
                    AllInfo: res.data,
                    skip: res.data.length,
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });

        socket.on("MainCard", (data: any) => {
            console.log(data);
            let files = this.state.AllInfo.filter(
                (file: any) => file._id !== data._id
            );

            this.setState(() => {
                return { AllInfo: files, Index: 0 };
            });
        });
    }

    showSlide(slideNumber: number) {
        this.setState(() => {
            return { Index: slideNumber }
        });
    }

    componentWillReceiveProps(newProps: IProps) {
        if (this.language !== newProps.User.language) {
            this.language = newProps.User.language;
        }
    }

    public render(): JSX.Element {
        return (<>
            {this.state.isLoading && <>
                <div className="shimmer-main-w"> <Shimmer3 /> </div>
            </>}
            {(this.state.AllInfo && this.state.AllInfo.length > 0) &&
                <div className="sp-carousel-c c-style1">
                    <div className="sp-carousel1">
                        <Sources Sources={this.state.AllInfo[this.state.Index].files} onlyOne={true} />
                        {(this.state.AllInfo.length - 1 > this.state.Index) && <button className="sp-nav-btn sp-btn-right1" onClick={() => this.NavBtnClicked("next")}><i className="ms-Icon ms-Icon--ChevronRight" aria-hidden="true"></i></button>}
                        {(this.state.Index > 0) && <button className="sp-nav-btn sp-btn-left1" onClick={() => this.NavBtnClicked("prev")}><i className="ms-Icon ms-Icon--ChevronLeft" aria-hidden="true"></i></button>}
                    </div>
                    <p className="sp-carousel-title">
                        {this.language == 'en' ? this.state.AllInfo[this.state.Index].title : this.state.AllInfo[this.state.Index].titleTe}
                    </p>
                </div>
            }
        </>
        );
    }
}

//export default ImageCarousel;




const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(ImageCarousel);