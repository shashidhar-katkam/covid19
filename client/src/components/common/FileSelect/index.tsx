import * as React from "react";
import { IFileAndUser,MainFileType } from "../../../models/models";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import Service from '../../admin/service';
import Loading from "../../common/Loading";
import FacebookVideo from "../../common/Templates/facebook";
import Youtube from "../../common/Templates/Youtube";
import Image, { OthersImage } from "../../common/Templates/Image";
import LocalVideo from "../../common/Templates/localVideo";
import './styles.scss';
import { PrimaryButton, DefaultButton, filteredAssign } from "office-ui-fabric-react";

interface IState {
    isLoading: boolean;
    AllFiles: IFileAndUser[];
    selectedFiles: IFileAndUser[];
    isShowFileSelectionModel: boolean;
    isLoadNext: boolean;
    filter: string;
    skip: number;
    currentScrollPosition: number;
}

interface IProps {
    //isShow: boolean;
    afterFilesSelected: Function;
    afterSelectionFilesCancel: Function;
}

class FileSelect extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            AllFiles: [],
            selectedFiles: [],
            isShowFileSelectionModel: true,
            isLoadNext: false,
            skip: 0,
            filter: '',
            currentScrollPosition: 0
        }

        this.service = new Service();
        this._closeDialog = this._closeDialog.bind(this);
        this._selectFile = this._selectFile.bind(this);
        this._onScrollEvent = this._onScrollEvent.bind(this);
        this._onSearch = this._onSearch.bind(this);
    }



    componentDidMount() {
        this.setState({
            isLoading: true
        });
        this.service.getAllFiles({}).then((res: any) => {
            if (res.status) {
                this.setState({
                    AllFiles: res.data,
                    isLoading: false,
                    skip: res.data.length,
                    isShowFileSelectionModel: true
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });

    }


    _onScrollEvent() {
        let d: HTMLElement = document.getElementById("fileSelect") as HTMLElement;
        const totalHeight = d.scrollHeight;
        if (d.scrollTop > totalHeight - 1300 && !this.state.isLoadNext) {
            this.setState({
                isLoadNext: true
            });

            if (this.state.filter == "") {
                this.service.getAllFiles({ skip: this.state.skip }).then((res: any) => {
                    if (res.status) {
                        let data: IFileAndUser[] = res.data;
                        let allFiles: IFileAndUser[] = this.state.AllFiles;

                        data.forEach((d1: any) => {
                            allFiles = [...allFiles, d1];
                        });

                        this.setState((prevState: IState) => {
                            return {
                                AllFiles: allFiles,
                                currentScrollPosition: d.scrollHeight,
                                skip: this.state.skip + data.length,
                                isLoadNext: false
                            }
                        });
                    } else {
                        this.setState({
                            isLoadNext: false
                        });
                    }
                });
            } else {
                this.service.getFilesByFilterAll({ skip: this.state.skip, filter: this.state.filter }).then((res: any) => {
                    if (res.status) {
                        let data: IFileAndUser[] = res.data;
                        let allFiles: IFileAndUser[] = this.state.AllFiles;

                        data.forEach((d1: any) => {
                            allFiles = [...allFiles, d1];
                        });

                        this.setState((prevState: IState) => {
                            return {
                                AllFiles: allFiles,
                                currentScrollPosition: d.scrollHeight,
                                skip: this.state.skip + data.length,
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
    }

    componentDidUpdate() {
        let d: HTMLElement = document.getElementById("fileSelect") as HTMLElement;
        if (d) {
            d.addEventListener('scroll', this._onScrollEvent);
        }

    }

    componentWillUnmount() {
        let d: HTMLElement = document.getElementById("fileSelect") as HTMLElement;
        if (d) {
            d.removeEventListener("scroll", this._onScrollEvent, { capture: false });
        }

    }

    private _selectFile(fileInfo: IFileAndUser) {
        let isSelected = false;
        this.state.selectedFiles.forEach((file: IFileAndUser) => {
            if (file.fileNewName === fileInfo.fileNewName) {
                isSelected = true;
            }
        });
        if (!isSelected) {
            this.setState((prevState: IState) => {
                return {
                    ...prevState,
                    selectedFiles: [...prevState.selectedFiles, fileInfo]
                }
            });
        }
    }

    private _closeDialog() {
        this.setState({
            isShowFileSelectionModel: false
        });
        this.props.afterSelectionFilesCancel();

    }

    private _onSearch(event: any) {
        this.setState({
            isLoading: true,
            filter: event.target.value
        });

        this.service.getFilesByFilterAll({ filter: event.target.value }).then((res: any) => {
            if (res.status) {
                if (res.data.length > 0) {
                    this.setState({
                        AllFiles: res.data,
                        currentScrollPosition: 0,
                        skip: res.data.length,
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        currentScrollPosition: 0,
                        AllFiles: [],
                        isLoading: false
                    });
                }
            } else {
                this.setState({
                    AllFiles: [],
                    isLoading: false
                });
            }
        });
    }

    render(): JSX.Element {
        return (
            <Dialog
                hidden={!this.state.isShowFileSelectionModel}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                modalProps={{
                    styles: { main: { maxWidth: "100%" } },
                    isModeless: true,
                    containerClassName: "files-selection",
                    onDismissed: this._closeDialog
                }}
            >
                <div>
                    <TextField label="Search" placeholder="Type something.." onChange={(event: any) => this._onSearch(event)} />
                </div>
                {this.state.selectedFiles.length > 0 &&
                    <p className="sp-no-pm ">{this.state.selectedFiles.length} files Selected </p>
                }
                <div className="files-selection-co" id="fileSelect">
                    {this.state.isLoading && <Loading />}
                    {this.state.AllFiles.map((filesInfo: IFileAndUser) => {
                        return <div className="files-select" id={filesInfo._id}>
                            {(filesInfo.fileType === MainFileType.facebookVideo) && <div className="video-co">  <FacebookVideo File={filesInfo} /> </div>}
                            {(filesInfo.fileType === MainFileType.youtubeVideo) && <div className="video-co">  <Youtube File={filesInfo} /> </div>}
                            {(filesInfo.fileType === MainFileType.localImage) && <div className="image-co"> <Image File={filesInfo} /> </div>}
                            {(filesInfo.fileType === MainFileType.othersImage) && <div className="image-co"> <OthersImage File={filesInfo} /> </div>}
                            {(filesInfo.fileType === MainFileType.localVideo) && <div className="video-co">  <LocalVideo File={filesInfo} /> </div>}
                            <div className="sp-clearFix"> </div>
                            <button className="btn-edit btn-action" onClick={() => this._selectFile(filesInfo)} >Select</button>
                        </div>
                    })}
                </div>
                <div className="sp-clearFix"></div>
                <DialogFooter>
                    <PrimaryButton onClick={() => this.props.afterFilesSelected(this.state.selectedFiles)} text="Import" />
                    <DefaultButton onClick={this._closeDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        );
    }

}

export default FileSelect;