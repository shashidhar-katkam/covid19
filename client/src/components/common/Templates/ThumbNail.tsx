import * as React from "react";
import './styles.scss';


interface IProps {
url : string;
}
 
function ThumbNail(props: IProps) {
  return (
    <img className="card-img-top sp-img" src={props.url} alt="Card cap" />
  );
}
export default ThumbNail;