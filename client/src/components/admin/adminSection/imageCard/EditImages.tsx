import * as React from "react";
import Service from '../../service';
import '../../styles.scss';
import { PrimaryButton } from "office-ui-fabric-react";

interface IImages {
    _id: string;
    fileNewName: string;
    filePath: string;
    fileType: number;
    show: boolean;

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

class EditImages extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            AllInfo: [],
            Index: 0,
            isLoadNext: false,
            skip: 0
        }
        this._removeFile = this._removeFile.bind(this);
        this._onScrollEvent = this._onScrollEvent.bind(this);
        this.service = new Service();
    }


    componentDidMount() {
        let d: HTMLElement = document.getElementById("tempd") as HTMLElement;

        this.setState({ isLoading: true });
        this.service.getImages({}).then((res: any) => {
            console.log(res);
            if (res.status) {
                this.setState({
                    AllInfo: res.data,
                    skip: res.data.length,
                    isLoading: false
                });
            }
        });


        if (d) {
            d.addEventListener('scroll', this._onScrollEvent);
        }


    }

    componentWillUnmount() {
        let d: any = document.getElementById("tempd");
        if (d) {
            d.removeEventListener("scroll", this._onScrollEvent, { capture: false });
        }

    }


    _onScrollEvent() {
        let d: HTMLElement = document.getElementById("tempd") as HTMLElement;
        // console.log(d.scrollHeight);
        console.log(d.scrollTop);
        const totalHeight = d.scrollHeight;
        if (d.scrollTop > totalHeight - 1300 && !this.state.isLoadNext) {
            if (!this.state.isLoadNext) {
                this.setState({
                    isLoadNext: true
                });
                this.service.getImages({ skip: this.state.skip }).then((res: any) => {
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

    private _removeFile(id: string, currentStatus: boolean) {

        this.service.updateImage({ _id: id, show: !currentStatus }).then((res: any) => {
            //console.log(res);
            if (res.status) {
                let images = this.state.AllInfo;
                let temp = images.map((image: IImages) => {
                    if (image._id === id) {

                        image.show = !currentStatus;
                        return image;
                    } else {
                        return image;
                    }

                });
                this.setState({ AllInfo: temp });
            }
        })

    }
    public render(): JSX.Element {
        return (
            <div className="">
                <div className="edit-img" id="tempd">
                    {this.state.AllInfo && this.state.AllInfo.length > 0 &&
                        <>
                            {
                                this.state.AllInfo.map((image: IImages) => {
                                    return <div className="img-div" id={image._id}>
                                        <img className="sp-img" src={`http://localhost:7777${image.filePath}`} alt="cardd" />
                                        <PrimaryButton className="sp-main-btn" onClick={() => this._removeFile(image._id, image.show)} text={image.show ? 'hide' : 'show'} />
                                    </div>
                                })
                            }
                        </>
                    }
                </div>
            </div>
        );
    }
}

export default EditImages;