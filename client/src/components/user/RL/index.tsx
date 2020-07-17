import * as React from "react";
import Register from './RegisterForm';
import LoginForm from './LoginForm';
import { FormType } from '../../../models/models';
import EmailVerifyForm from "./EmailVerify";
import ForgetPasswrdForm from "./ForgetPasswordForm";
import { AppState } from "../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../Redux/models";
import './styles.scss';

interface IState {
    isLoginDialogEnabled: boolean;
    Form: number;
    userLoginId: string;
}

interface IProps {
    isLoginDialogEnabled: boolean;
    afterLogin(): void;
    User: IUserState;
}

class RL extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoginDialogEnabled: this.props.isLoginDialogEnabled,
            Form: FormType.Login,
            userLoginId: ''
        }
        this._formHandle = this._formHandle.bind(this);
    }

    componentWillReceiveProps(newProps: IProps) {
        this.setState({
            Form: (newProps.isLoginDialogEnabled ? 1 : 0)
        });
    }

    public _formHandle(id: number, userLoginId?: string) {
        if (userLoginId) {
            this.setState({
                Form: id,
                userLoginId: userLoginId
            });
            if (id === 3) {
                this.props.afterLogin();
            }
        } else {
            this.setState({
                Form: id
            });
        }
    }


    public render(): JSX.Element {
        return (
            <>
                {this.state.Form === FormType.Login && <LoginForm showDialog={true} formHandle={this._formHandle} afterLogin={this.props.afterLogin} ></LoginForm>}
                {this.state.Form === FormType.Register && <Register isLoginDialogEnabled={true} afterLogin={this.props.afterLogin} formHandle={this._formHandle} ></Register>}
                {this.state.Form === FormType.EMailVerify && <EmailVerifyForm userLoginId={this.state.userLoginId} showDialog={true} formHandle={this._formHandle} afterLogin={this.props.afterLogin} />}
                {this.state.Form === FormType.ForgetPassword && <ForgetPasswrdForm showDialog={true} formHandle={this._formHandle} afterLogin={this.props.afterLogin} />}
            </>
        );
    }

}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(RL);
