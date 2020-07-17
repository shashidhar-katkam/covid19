import * as React from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";

import AuthService from '../../../services/authService';

interface IProps {
    path: string;
}

class PrivateRoute extends React.Component<IProps, {}> {
    private authService: AuthService;
    constructor(props: IProps) {
        super(props);
        this.authService = new AuthService();
    }
    public render(): JSX.Element {
        let { path } = this.props;
        return (
            <Route
                path={path}
                render={({ location }) =>
                    this.authService.isLogged() ? (
                        this.props.children
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: { from: location }
                                }}
                            />
                        )
                }
            />
        );
    }

}

export default PrivateRoute;