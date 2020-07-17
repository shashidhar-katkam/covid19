import * as React from "react";
import { DefaultButton, IStackStyles } from 'office-ui-fabric-react';
import Compose from './ComposeNews';
import { connect } from "react-redux";
import NeedHelp from './NeedHelp';
import './styles.scss';
import { IUserState } from "../../../../Redux/models";
import { AppState } from "../../../../Redux/app.store";

const stackStyles: Partial<IStackStyles> = { root: { color: "#0078d4" } };

interface IState {
  model: number;
}

interface IProps {
  User: IUserState;

}

class Actions extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      model: 0
    }
    this._onModelOpen = this._onModelOpen.bind(this);
  }

  private _onModelOpen(model: number) {
    if (this.state.model === model) {
      this.setState({
        model: 0
      });
    } else {
      this.setState({
        model: model
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div className="compose-co c-style1" >
        <div className="c-btns">
          <DefaultButton iconProps={{ iconName: 'HeartBroken', styles: stackStyles }} onClick={() => this._onModelOpen(1)} className={`c-btn ${this.state.model === 1 ? 'sp-active' : ''}`} text={this.props.User.staticConstants.Constants.needHelp} />
          <DefaultButton iconProps={{ iconName: 'PageHeaderEdit', styles: stackStyles }} onClick={() => this._onModelOpen(2)} className={`c-btn c-btn2 ${this.state.model === 2 ? 'sp-active' : ''}`} text={this.props.User.staticConstants.Constants.postNews} />
        </div>
        {this.state.model === 1 &&
          <NeedHelp />
        }
        {this.state.model === 2 &&
          <Compose />
        }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState): AppState => ({
  User: state.User,
});

export default connect(
  mapStateToProps,
)(Actions);