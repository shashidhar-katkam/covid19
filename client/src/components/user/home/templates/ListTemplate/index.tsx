import * as React from "react";
import NewsService from '../../../Service';
import './styles.scss';
import { NavLink } from "react-router-dom";
import { AppState } from "../../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../../Redux/models";
import Shimmer1 from "../../../../common/Loading/Shimmers";
const TextTruncate = require('react-text-truncate');

interface IHeadLine {
  _id: string;
  Title: string;
  Description: string;
}

interface IState {
  headLines: IHeadLine[];
  isLoading: boolean;
  language: string;
}

interface IProps {
  User: IUserState;
}

class ListTemplate extends React.Component<IProps, IState> {
  private newsService: NewsService;
  constructor(props: IProps) {
    super(props);
    this.state = {
      headLines: [],
      isLoading: false,
      language: this.props.User.language
    }
    this.newsService = new NewsService();
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    this.newsService.getHeadlines().then((res: any) => {
      if (res.status) {
        let data = res.data;
        this.setState({
          headLines: data,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  componentWillReceiveProps(newProps: IProps) {
    if (this.state.language !== newProps.User.language) {
      this.setState({
        isLoading: true,
      });

      this.newsService.getHeadlines().then((res: any) => {
        if (res.status) {
          let data = res.data;
          this.setState({
            headLines: data,
            isLoading: false,
            language: newProps.User.language
          });
        } else {
          this.setState({
            isLoading: false,
            language: newProps.User.language
          });
        }
      });
    }
  }

  render(): JSX.Element {
    if (this.state.isLoading) {
      return <div className="list-template" >
        <div>
          <p className="heading" >{this.props.User.staticConstants.Constants.headLines}</p>
        </div>
        <div className="shimmer-wrapper">
          <Shimmer1 />
          <hr className="sp-hr" />
          <Shimmer1 />
          <hr className="sp-hr" />
          <Shimmer1 />
        </div>
      </div>
    }

    return (<>
      {this.state.headLines && this.state.headLines.length > 0 &&
        <div className="list-template" >
          <div>
            <h4 className="heading">{this.props.User.staticConstants.Constants.headLines}</h4>
          </div>
          <div className="sp-headline">
            {this.state.headLines.map((headLine: IHeadLine, index: number) => {
              return <div key={headLine._id}>
                <NavLink className="sp-f13" to={`/newsi/${headLine._id}`}>
                  <TextTruncate
                    line={1}
                    element="p"
                    truncateText="…"
                    text={headLine.Title}
                  />
                </NavLink>
                {index !== this.state.headLines.length - 1 && <hr />}
              </div>
            })}
          </div>
        </div>
      }
    </>
    );
  }
}


const mapStateToProps = (state: AppState): AppState => ({
  User: state.User,
});

export default connect(
  mapStateToProps,
)(ListTemplate);