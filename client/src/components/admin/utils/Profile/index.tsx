import * as React from "react";
import NewsService from '../../service';
import { IUser1 } from '../../../../models/models';
import '../../styles.scss';

interface IState {
    User: any;
    isLoading: boolean;
    userId: string;
}

interface IProps {
    userId: string;
}

class Profile extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = { isLoading: false, User: null, userId: this.props.userId }
        this.newsService = new NewsService();
    }

    public componentDidUpdate(newProps: IProps) {

        if (this.state.userId !== newProps.userId) {
            this.setState({ isLoading: true, User: null });
            this.newsService.getProfileById({ id: this.state.userId }).then((res: any) => {
                if (res.status) {
                    let data = res.data;
                    if (data && data.length > 0) {
                        this.setState({
                            User: data[0],
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }

        window.scrollTo(0, document.documentElement.scrollHeight);
    }

    public componentDidMount() {

        this.setState({ isLoading: true, User: null });
        this.newsService.getProfileById({ id: this.state.userId }).then((res: any) => {
            let data = res;
            if (res.status && res.data) {
                if (data) {
                    this.setState({
                        User: res.data[0],
                        isLoading: false
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            } else {
                this.setState({
                    isLoading: false
                });
            }
        });
    }

    UNSAFE_componentWillReceiveProps(newProps: IProps) {
        if (this.state.userId !== newProps.userId) {
            this.setState({
                userId: newProps.userId
            });
        }
    }

    public render(): JSX.Element {
        const User: IUser1 = this.state.User;
        return (
            <div>{this.state.isLoading && <p>loading...</p>}
                {
                    User && !this.state.isLoading &&
                    <div className="profile-info-2">
                        <img src={`http://localhost:7777${User.imagePath}`} className="avatar-2" alt="ds" />
                        <p className="profile-name sp-no-pm sp-mt10 capitalize">{` ${User.firstName} ${User.lastName} `}</p>
                        <p className="sp-no-pm sp-n sp-f12 sp-mt10" ><i className="ms-Icon ms-Icon--MapPin" aria-hidden="true"></i> {`${User.city}, ${User.state}`} </p>
                        <p className="sp-no-pm sp-n sp-f12" ><i className="ms-Icon ms-Icon--Mail" aria-hidden="true"></i> {`${User.email}`} </p>
                        <p className="sp-no-pm sp-n sp-f12 capitalize" ><i className="ms-Icon ms-Icon--Contact" aria-hidden="true"></i> {`${User.gender}`} </p>
                        <p className="sp-no-pm sp-n sp-f12 sp-mt10"><i className="ms-Icon ms-Icon--Telemarketer" aria-hidden="true"></i> {User.phoneNumber}</p>
                        <p className="sp-no-pm sp-n sp-f12 sp-mt10">User Type:   {User.userType === 1 ? 'Normal User' : User.userType === 3 ? 'Admin' : User.userType === 2 ? 'Self Admin' : 'Super Admin'}</p>
                        <hr className="" />
                    </div>
                }
            </div>
        );
    }
}

export default Profile;