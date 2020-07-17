import * as React from "react";
import Youtube from './Youtube';
import Image, { OthersImage } from './Image';
import FacebookVideo from './facebook';
import LocalVideo from './localVideo';
import { IFileC, MainFileType } from '../../../models/models';
import './styles.scss';

interface IState {
  Sources: IFileC[];
  CurrentIndex: number;
}

interface IProps {
  Sources: IFileC[];
}

class Template extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      Sources: this.props.Sources,
      CurrentIndex: 0
    }

    this._onNavBtnClicked = this._onNavBtnClicked.bind(this);
  }

  public _onNavBtnClicked(type: any) {
    if (type === "prev") {
      if (this.state.CurrentIndex > 0) {
        this.setState((prevStat: IState) => {
          return { CurrentIndex: Number(prevStat.CurrentIndex) - 1 }
        });
      }
    }
    else {
      if (this.state.Sources.length - 1 > this.state.CurrentIndex) {
        this.setState((prevStat: IState) => {
          return { CurrentIndex: Number(prevStat.CurrentIndex) + 1 }
        });
      }
    }
  }

  public render(): JSX.Element {
    return (
      <>
        <div className="card sp-main-video">
          {(this.state.Sources[this.state.CurrentIndex].fileType === MainFileType.facebookVideo) && <><FacebookVideo File={this.state.Sources[this.state.CurrentIndex]}></FacebookVideo></>}
          {(this.state.Sources[this.state.CurrentIndex].fileType === MainFileType.youtubeVideo) && <Youtube File={this.state.Sources[this.state.CurrentIndex]} />}
          {(this.state.Sources[this.state.CurrentIndex].fileType === MainFileType.localImage) && <Image File={this.state.Sources[this.state.CurrentIndex]} />}
          {(this.state.Sources[this.state.CurrentIndex].fileType === MainFileType.othersImage) && <OthersImage File={this.state.Sources[this.state.CurrentIndex]} />}
          {(this.state.Sources[this.state.CurrentIndex].fileType === MainFileType.localVideo) && <LocalVideo File={this.state.Sources[this.state.CurrentIndex]} />}
          {(this.state.Sources.length - 1 > this.state.CurrentIndex) && <button className="sp-nav-btn sp-btn-right" onClick={() => this._onNavBtnClicked("next")}><i className="ms-Icon ms-Icon--ChevronRight" aria-hidden="true"></i></button>}
          {(this.state.CurrentIndex > 0) && <button className="sp-nav-btn sp-btn-left" onClick={() => this._onNavBtnClicked("prev")}><i className="ms-Icon ms-Icon--ChevronLeft" aria-hidden="true"></i></button>}
        </div>
        <div className="sp-clearFix"></div>
      </>
    );
  }

}

export default Template;
