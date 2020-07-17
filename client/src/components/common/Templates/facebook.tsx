import * as React from "react";
import './styles.scss';
import { IFileC } from '../../../models/models';

interface IProps {
  File: IFileC;
}


function FacebookVideo(props: IProps) {
  return (
    <iframe id={props.File._id + Date().toString()} src={`https://www.facebook.com/plugins/video.php?href=${props.File.filePath}&width=500&show_text=false&height=280&appId`} width="100%" height="280px" scrolling="no" frameBorder="0" className="sp-fb-iframe" allow="encrypted-media" allowFullScreen={true} title={props.File.originalName} ></iframe>
  );
}
export default FacebookVideo;
