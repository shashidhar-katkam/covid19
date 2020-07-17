import * as React from "react";
import './styles.scss';
import { connect } from "react-redux";
import { IUserState } from "../../Redux/models";
import { AppState } from "../../Redux/app.store";
const ShowMoreText = require('react-show-more-text');
const TextTruncate = require('react-text-truncate');

interface IProps {
  Title: string;
  Description: string;
  User: IUserState;
  Source?: string;
}

function NewsTD(props: IProps) {
  return (<div className="news-td">
    <TextTruncate
      line={2}
      element="h6"
      truncateText="…"
      text={props.Title}
    />
    <ShowMoreText
      lines={3}
      more={props.User.staticConstants.Constants.readMore}
      less={props.User.staticConstants.Constants.readLess}
      anchorClass='show-more-link'
      expanded={false}
      keepNewLines={true}
    >
      {props.Description}
    </ShowMoreText>
    {props.Source && <p className="original-source"><a target="_blank" href={props.Source}>Original Source</a></p>}
  </div>
  );
}

const mapStateToProps = (state: AppState): AppState => ({
  User: state.User,
});

export default connect(
  mapStateToProps,
)(NewsTD);