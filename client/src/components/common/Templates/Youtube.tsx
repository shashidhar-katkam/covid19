import * as React from "react";
import './styles.scss';
import { IFileC } from '../../../models/models';
const YTPlayer = require('yt-player');

interface IProps {
  File: IFileC;
}

interface IState {
  playerRef: any;
  currentId: string;
  File: IFileC;
}

class Youtube extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      playerRef: null,
      currentId: '',
      File: this.props.File
    }
  }

  componentDidMount() {
    let thisObj = this;
    let link = this.state.File.filePath;
    let linkL = link.length;
    let ddd = link.substring(linkL - 11);
    const player = new YTPlayer(`#${this.state.File._id.substring(1, 10)}`, { width: '100%', height: '280' });
    player.load(ddd);
    window.addEventListener('scroll', function () {
      var element = document.querySelector(`#${thisObj.props.File._id.substring(1, 10)}`);
      if (element) {
        var position = element.getBoundingClientRect();
        if (position.top >= 0 && position.bottom <= window.innerHeight) {
        }
        if (position.top < window.innerHeight && position.bottom >= 0) {
          if (player.getState() == 'playing') {
            player.pause();
          }
        }
      }
    });

    this.setState({
      playerRef: player,
      currentId: this.state.File._id.substring(1, 10)
    });
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.File) {
      if (this.state.File._id !== newProps.File._id) {
        this.setState({
          File: newProps.File
        });
      }
    }
  }
  componentWillUnmount() {
    if (this.state.playerRef) {
      this.state.playerRef.destroy();
    }
  }

  render(): JSX.Element {
    console.log(this.state.File);
    return (
      <>
        
        {(this.state.File !== null && this.state.File !== undefined) &&
          <div id={this.state.File._id.substring(1, 10)}></div>}
      </>
    );
  }
}

export default Youtube;