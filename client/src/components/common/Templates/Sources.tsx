import * as React from "react";
import './styles.scss';
import Youtube from '../../common/Templates/Youtube';
import Template from '../../common/Templates';
import Image, { OthersImage } from '../../common/Templates/Image';
import { IFileC, MainFileType } from '../../../models/models';
import FacebookVideo from '../../common/Templates/facebook';
import LocalVideo from '../../common/Templates/localVideo';
import ThumbNail from '../../common/Templates/ThumbNail';
import Util from '../../../util';

interface IProps {
  Sources: IFileC[];
  onlyOne?: boolean;
  isThumbNail?: boolean;
}

class Sources extends React.Component<IProps, {}> {

  private infoBind(filesInfo: IFileC[]) {
    let temp;
    if (filesInfo.length === 1 || this.props.onlyOne) {
      return <>
        {(filesInfo[0].fileType === MainFileType.facebookVideo) && <FacebookVideo File={filesInfo[0]} />}
        {(filesInfo[0].fileType === MainFileType.youtubeVideo) && (this.props.isThumbNail ? <ThumbNail url={`https://i.ytimg.com/vi/${Util.extractYoutubeVideoID(filesInfo[0].filePath)}/hqdefault.jpg`} /> : <Youtube File={filesInfo[0]} />)}
        {(filesInfo[0].fileType === MainFileType.localImage) && <Image File={filesInfo[0]} />}
        {(filesInfo[0].fileType === MainFileType.othersImage) && <OthersImage File={filesInfo[0]} />}
        {(filesInfo[0].fileType === MainFileType.localVideo) && <LocalVideo isThumbNail={this.props.isThumbNail} File={filesInfo[0]} />}
      </>

    } else
      temp = <Template Sources={filesInfo}></Template>;
    return temp;
  }

  public render(): JSX.Element {
    return (
      <>
        {((this.props.Sources && this.props.Sources.length > 0) && this.infoBind(this.props.Sources))}
      </>
    );
  }

}

export default Sources;