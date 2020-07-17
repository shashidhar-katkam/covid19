import * as React from "react";
import NewsService from '../Service';
import { URLs } from '../../../constants/constants';
import './styles.scss';
import ReduxService from "../../../Redux/service";

interface typ {
    isShow: boolean;
    value: string;
    errorMessage: string;
}


interface IState {
    image: typ;
    userId: string;
}

interface IProps {
    imagePath: string;
    userId: string
    onImageChange(newImgPath: string): void;
}

class Image extends React.Component<IProps, IState> {
    private service: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            image: {
                isShow: false,
                value: this.props.imagePath,
                errorMessage: ""
            },
            userId: this.props.userId
        }
        this.service = new NewsService();
        this._onSucess = this._onSucess.bind(this);
        this._onChangeHandler = this._onChangeHandler.bind(this);
        this._onProgress = this._onProgress.bind(this);
    }

    public _onSucess(some: any) {
        if (some && some.response && some.response.success) {
            this.service.updateProfile({
                field: 'imagePath',
                data: { imagePath: some.response.filePath, id: this.state.userId }
            }).then(() => {
                this.setState({
                    image: { ...this.state.image, value: some.response.filePath }
                });

                ReduxService.updateUserImage(some.response.filePath);
                this.props.onImageChange(some.response.filePath);
            });

        }
    }

    public _onProgress(some: any) {

    }

    _onChangeHandler(event: any, _onSucess: any, _onProgress: any) {
        if (event.target.files[0]) {
            if (event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/x-png' || event.target.files[0].type === 'image/gif' || event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/jpg') {
                let datae: any = event.target.files[0];
                const data = new FormData();
                data.append('file', event.target.files[0]);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", `http://localhost:7777/use${URLs.uploadProfilePic}`);
                xhr.upload.addEventListener("progress", function (this, evt) {
                    if (evt.lengthComputable) {
                        let percentComplete: any = evt.loaded / evt.total;
                        let df: any = percentComplete.toFixed(2) * 100;
                        datae.progress = df.toFixed(0);
                        let db = datae;
                        db.progress = df.toFixed(0);
                        _onProgress(db);
                    }
                }, false);
                xhr.onloadstart = function (e) {

                }
                xhr.onloadend = function (e) {

                }
                xhr.send(data);
                xhr.onreadystatechange =
                    function () {
                        if (this.readyState === 4 && this.status === 200) {
                            var res = JSON.parse(this.response);
                            datae.response = res;
                            var de = datae
                            _onSucess(de);
                        }
                    };
            } else {
                this.setState({
                    image: { ...this.state.image, errorMessage: 'Please select image only.' }
                });
            }
        }
    }
    render(): JSX.Element {
        return (
            <>
                <img src={`http://localhost:7777${this.state.image.value}`} className="avatar-3" alt="dd" />
                <input type="file" name="photo" accept="image/x-png,image/gif,image/jpeg" id="photo" className="display-none" onChange={(event: any) => this._onChangeHandler(event, this._onSucess, this._onProgress)} />
                <label className="cursor upload-photo" htmlFor="photo">change</label>
                <span className="sp-danger">{this.state.image.errorMessage}</span>
            </>);
    }

}

export default Image;