import * as React from "react";
import NewsService from "../../Service";

interface IState {
    User: any;
    isLoading: boolean;
    userId: string;
    totalNews: number
}

interface IProps {
    userId: string;
}

class Profile extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            User: null, userId: this.props.userId, totalNews: 0
        }
        this.newsService = new NewsService();
    }

    public componentDidUpdate(newProps: IProps) {
        if (this.state.userId !== newProps.userId) {
            this.setState({ isLoading: true });
            this.newsService.getProfileById({ id: this.state.userId }).then((res: any) => {
                if (res.status) {
                    let data = res.data;
                    this.setState({
                        User: data['userInfo'],
                        totalNews: data.data['count'],
                        isLoading: false
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            });
        }
    }

    public componentDidMount() {
        this.setState({ isLoading: true });
        this.newsService.getProfileById({ id: this.state.userId }).then((res: any) => {
            if (res.status) {
                let data = res.data;
                if (data) {
                    this.setState({
                        User: data['userInfo'],
                        isLoading: false,
                        totalNews: data['count']
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
        return (
            <>
                {
                    this.state.User && !this.state.isLoading &&
                    <div className="profile-info">
                        <img src={`http://localhost:7777${this.state.User.imagePath}`} alt="dd" className="avatar-2" />
                        <p className="profile-name sp-no-pm sp-m5">{` ${this.state.User.firstName} ${this.state.User.lastName} `}</p>
                        <p className="sp-no-pm sp-n sp-f12 sp-m5" ><i className="ms-Icon ms-Icon--MapPin" aria-hidden="true"></i> {`${this.state.User.city}, ${this.state.User.state}`} </p>
                        <p className="sp-n sp-f14">{this.state.totalNews} posts</p>
                        <hr className="" />
                    </div>
                }
            </>
        );
    }

}

export default Profile;