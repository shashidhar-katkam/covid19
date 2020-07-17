import * as React from "react";
import { NewsStatus } from '../../../models/models';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import Util from '../../../util';
import FilesDisplayList1 from "../../admin/utils/FileDisplayList1";
import './styles.scss';
import { connect } from "react-redux";
import { AppState } from "../../../Redux/app.store";
import { IUserState } from "../../../Redux/models";
const ShowMoreText = require('react-show-more-text');

interface INewsInfo {
    _id: string;
    Title: string
    Description: string;
    DateTime: string;
    Status: string;
    StatusMessage: string;
    Files: []
}
interface IState {
    Item: INewsInfo;
}

interface IProps {
    Item: INewsInfo;
    User: IUserState;
}

class NewsDetails extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            Item: this.props.Item
        }
    }
    componentWillReceiveProps(newProps: IProps) {
        if (this.state.Item._id !== newProps.Item._id) {
            this.setState({
                Item: newProps.Item
            });
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                {(this.state.Item &&
                    <div className="selected-item">
                        <h5>News Information </h5>
                        <hr />
                        <div className="ms-Grid" >
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-sm12 ms-md7 ms-lg7 msg-details">
                                    <h6 className="msg-headings">Title <span className="sp-float-right sp-pointer">
                                        {Util.formatAMPM(this.state.Item.DateTime)}
                                    </span></h6>
                                    <div className="sp-clearFix"></div>
                                    <ShowMoreText
                                        lines={2}
                                        more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                        anchorClass='show-more-link'
                                        expanded={false}
                                        keepNewLines={true}
                                    >
                                        {this.state.Item.Title}
                                    </ShowMoreText>
                                    <h6 className="msg-headings sp-mt10">Description</h6>
                                    <ShowMoreText
                                        lines={4}
                                        more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                        anchorClass='show-more-link'
                                        expanded={false}
                                        keepNewLines={true}
                                    >
                                        {this.state.Item.Description}
                                    </ShowMoreText>
                                    <FilesDisplayList1 files={this.state.Item.Files} />
                                </div>
                                <div className="ms-Grid-col ms-sm12 ms-md5 ms-lg5">
                                    <h6 className="msg-headings sp-mt10">Status</h6>
                                    {this.state.Item.Status === NewsStatus.Approved &&
                                        <DefaultButton className="sp-btn-m sp-green" text="Approved" />
                                    }
                                    {(this.state.Item.Status == NewsStatus.Process || this.state.Item.Status == NewsStatus.Submitted) &&
                                        <DefaultButton className="sp-btn-m sp-yellow" text="Not Approved" />
                                    }
                                    {this.state.Item.Status == NewsStatus.Rejected &&
                                        <DefaultButton className="sp-btn-m sp-red" text="Rejected" />
                                    }
                                    {this.state.Item.StatusMessage && <div>
                                        <h6 className="msg-headings sp-mt10">Comment</h6>
                                        <ShowMoreText
                                            lines={3}
                                            more={this.props.User.staticConstants.Constants.readMore}
                                        less={this.props.User.staticConstants.Constants.readLess}
                                            anchorClass='show-more-link'
                                            expanded={false}
                                            keepNewLines={true}
                                        >
                                            {this.state.Item.StatusMessage}
                                        </ShowMoreText>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}


const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(NewsDetails);