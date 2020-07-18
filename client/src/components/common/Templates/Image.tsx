import * as React from "react";
import './styles.scss';
import { IFileC } from '../../../models/models';

interface IProps {
  File: IFileC;
}

function Image(props: IProps) {
  return (
    <img className="sp-img" src={`${props.File.filePath}`} alt="no image" />
  );
}


export function OthersImage(props: IProps) {
  return (
    <img className="sp-img" src={props.File.filePath} alt="no image" />
  );
}

export default Image;