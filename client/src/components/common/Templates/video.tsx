import * as React from "react";
import ReactPlayer from 'react-player'
import './styles.scss';

function Video(props: any) {
  return (
    <div className="fb-video-player">
    <ReactPlayer controls width="100%" height="100%" url={props.Source.Url} />
  </div>
  );
}
export default Video;