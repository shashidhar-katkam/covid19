import * as React from "react";
import './styles.scss';
import { IFileC } from '../../../models/models';

interface IProps {
  File: IFileC;
  isThumbNail?: boolean;
}

interface IState {
}

class LocalVideo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    let thisObj = this;

    window.addEventListener('scroll', function () {
      var element: any = document.querySelector(`#${thisObj.props.File._id.substring(1, 10)}`);
      if (element) {
        var position = element.getBoundingClientRect();
        if (position.top >= 0 && position.bottom <= window.innerHeight) {
        }
        if (position.top < window.innerHeight && position.bottom >= 0) {
          element.pause();
        }
      }
    });
  }

  render(): JSX.Element {
    return (<>
      <div className={`${this.props.isThumbNail ? 'hover-ef' : 'sp-hide'}`}>
      </div>
      <video id={this.props.File._id.substring(1, 10)} width="100%" height="100%" controls >
        <source src={`http://localhost:7777${this.props.File.filePath}`} type="video/mp4" />
          Your browser does not support the video tag.
      </video>
    </>
    );
  }
}

export default LocalVideo;

