import * as React from "react";
import './styles.scss';
import NewsService from "../../../Service";
import { socket } from "../../../../../app";

interface IImages {
    fileNewName: string;
    filePath: string;
    fileType: number;

}

interface IState {
    AllInfo: IImages[];
    Index: number;
    isLoading: boolean;
    isLoadNext: boolean;
    skip: number;
}

interface IProps {

}

class ImageCard extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            AllInfo: [],
            Index: 0,
            isLoadNext: false,
            skip: 0
        }
        this.NavBtnClicked = this.NavBtnClicked.bind(this);
        this.newsService = new NewsService();
    }


    componentDidMount() {
        this.setState({ isLoading: true });
        this.newsService.getImages({}).then((res: any) => {
            console.log(res);
            if (res.status) {
                this.setState({
                    AllInfo: res.data,
                    skip: res.data.length
                });
            }
        });

        socket.on("ImageCard", (data: any) => {
            console.log(data);
            let files = this.state.AllInfo.filter(
                (file: any) => file._id !== data._id
            );
            this.setState((prevState: IState) => {
                return { AllInfo: files, Index: 0 };
            });
        });

    }

    public NavBtnClicked(type: any) {
        if (type === "prev") {
            if (this.state.Index > 0) {
                this.setState((prevStat: IState) => {
                    return { Index: Number(prevStat.Index) - 1 }
                });
            }
        }
        else {
            if (this.state.AllInfo.length - 1 > this.state.Index) {
                this.setState((prevStat: IState) => {
                    return { Index: Number(prevStat.Index) + 1 }
                });
            }
        }
        if (!this.state.isLoadNext) {
            if (this.state.Index > this.state.AllInfo.length - 5) {
                this.setState({
                    isLoadNext: true
                });

                this.newsService.getImages({ skip: this.state.skip }).then((res: any) => {
                    
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

    public render(): JSX.Element {
        return (<>
            {this.state.AllInfo && this.state.AllInfo.length > 0 &&
                <div className="sp-image-card-wrappe"  >
                    <div className="card sp-card-img">
                        <img className="sp-img" src={`http://localhost:7777${this.state.AllInfo[this.state.Index].filePath}`} alt="cardd" />
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

export default ImageCard;