import * as React from "react";
import './styles.scss';
import moment from 'moment';
interface IProps {
dateTime : string;
}
 
function TimeStamp(props: IProps) {
  return (
    <span className="time-stamp">{moment(props.dateTime).fromNow()}</span>
  );
}

export function TimeStamp2(props: IProps) {
  return (
    <span className="time-stamp">{moment(props.dateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}</span>
  );
}


export function TimeStamp3Right(props: IProps) {
  return (
    <span className="time-stamp-right">{moment(props.dateTime).fromNow()}</span>
  );
}

export default TimeStamp;