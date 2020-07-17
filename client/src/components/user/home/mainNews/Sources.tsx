import * as React from "react";
import Youtube from '../../../common/Templates/Youtube';
import Template from '../../../common/Templates';
import Image, { OthersImage } from '../../../common/Templates/Image';
import { IFileC, MainFileType } from '../../../../models/models';
import FacebookVideo from '../../../common/Templates/facebook';
import LocalVideo from '../../../common/Templates/localVideo';
import './styles.scss';


interface IProps {
  Sources: IFileC[];
}

class Sources extends React.Component<IProps, {}> {
  private infoBind(filesInfo: IFileC[]) {
    let temp;
    if (filesInfo.length === 1) {
      return <>
        {(filesInfo[0].fileType === MainFileType.facebookVideo) && <div className="video-container">  <FacebookVideo File={filesInfo[0]} /> </div>}
        {(filesInfo[0].fileType === MainFileType.youtubeVideo) && <div className="video-container">  <Youtube File={filesInfo[0]} /> </div>}
        {(filesInfo[0].fileType === MainFileType.localImage) && <div className="image-container"> <Image File={filesInfo[0]} /> </div>}
        {(filesInfo[0].fileType === MainFileType.othersImage) && <div className="image-container"> <OthersImage File={filesInfo[0]} /> </div>}
        {(filesInfo[0].fileType === MainFileType.localVideo) && <div className="video-container">  <LocalVideo File={filesInfo[0]} /> </div>}
      </>
    } else
      temp = <div className="image-container"><Template Sources={filesInfo}></Template> </div>;
    return temp;
  }

  public render(): JSX.Element {
    return (
      <>
        {(this.props.Sources.length > 0 && this.infoBind(this.props.Sources))}
      </>
    );
  }
}

export default Sources;