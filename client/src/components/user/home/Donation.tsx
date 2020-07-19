import * as React from "react";
import { DefaultButton, IStackStyles, Dialog, DialogType, DialogFooter, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { connect } from "react-redux";
import './styles.scss';
import { IUserState } from "../../../Redux/models";
import { AppState } from "../../../Redux/app.store";
import Service from '../Service';
import { IDialogPropss } from "../../../models/models";
import Loading from "../../common/Loading";

const stackStyles: Partial<IStackStyles> = { root: { color: "#614746" } };

interface IDonationForm {
    _id: string;
    firstName: string;
    phoneNumber: string;
    email: string;
    amount: string;
}
interface IDonationFormErr {
    phoneNumberErr: string;
    emailErr: string;
    amountErr: string;
}
interface IState {
    showModel: boolean;
    donationForm: IDonationForm;
    donationFormErr: IDonationFormErr;
    isLoading: boolean;
    response: any;
    DialogProps2: IDialogPropss;
    errormsg: string;
}

interface IProps {
    User: IUserState;
    isShow: boolean;
    hideDonateModel: () => void;
}

class Donations extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            showModel: this.props.isShow,
            donationForm: {
                _id: this.props.User && this.props.User.User && this.props.User.User._id ? this.props.User.User._id : '',
                firstName: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                amount: ''
            },
            donationFormErr: {
                amountErr: '',
                phoneNumberErr: '',
                emailErr: ''
            },
            isLoading: false,
            response: null,
            DialogProps2: { show: false, message: '' },
            errormsg: ''

        }
        this.service = new Service();
        this._showDialog = this._showDialog.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._amountChangeHandle = this._amountChangeHandle.bind(this);
        this._inputChangeHandle = this._inputChangeHandle.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._closeDialog2 = this._closeDialog2.bind(this);
    }



    private _showDialog() {
        this.setState({
            showModel: true
        });

    }

    private _closeDialog() {
        this.setState({
            showModel: false,
            donationForm: {
                _id: this.props.User && this.props.User.User && this.props.User.User._id ? this.props.User.User._id : '',
                firstName: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                amount: ''
            }
        });
        this.props.hideDonateModel();
    }
    private _inputChangeHandle(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            donationForm: { ...this.state.donationForm, [event.target.name]: event.target.value },
        });
    }

    public _amountChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let errorMessage: string;
        const amount = (event.target.validity.valid || event.target.value === '') ? event.target.value : this.state.donationForm.amount;
        if (event.target.value === "") {
            errorMessage = 'Min Rs.10'
        } else if (!event.target.validity.valid) {
            errorMessage = "Only number are allowed";
        } else if (event.target.value !== "" && Number(event.target.value) < 10) {
            errorMessage = 'Min Rs.10'
        } else {
            errorMessage = "";
        }
        this.setState({
            donationForm: { ...this.state.donationForm, [event.target.name]: amount },
            donationFormErr: { ...this.state.donationFormErr, [event.target.name + 'Err']: errorMessage }
        });
    }

    private isFormValid = (): boolean => {
        let donationForm: IDonationForm = this.state.donationForm;
        let donationFormErr: IDonationFormErr = this.state.donationFormErr;
        let isFormValid: boolean = true;
        if (donationForm.amount === "") {
            donationFormErr.amountErr = 'Min Rs.10'
            isFormValid = false;
        } else if (donationForm.amount !== "" && Number(donationForm.amount) < 10) {
            donationFormErr.amountErr = 'Min Rs.10'
            isFormValid = false;
        }
        else {
            donationFormErr.phoneNumberErr = "";
        }

        this.setState({
            donationFormErr
        });
        return isFormValid;
    }

    private _submitForm() {
        if (this.isFormValid()) {
            this.setState({
                showModel: false
            });

        }
    }

    private _closeDialog2() {
        this.setState({
            DialogProps2: { show: false, message: '' }
        });

    }

    componentWillReceiveProps(newProps: IProps) {
        debugger;
        this.setState({
            showModel: this.props.isShow
        });

    }

    public render(): JSX.Element {
        return (<>
            {this.state.isLoading && <Loading />}
            <Dialog
                hidden={!this.state.showModel}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                closeButtonAriaLabel="Close"
                subText="Enter the amount you wish to donate"

            >
                <TextField label="Name"
                    placeholder="Please enter name"
                    name="firstName"
                    value={this.state.donationForm.firstName}
                    onChange={(event: any) => this._inputChangeHandle(event)}
                />

                <TextField label="Amount"
                    name="amount"
                    errorMessage={this.state.donationFormErr.amountErr}
                    value={this.state.donationForm.amount}
                    required
                    pattern="[0-9]*"
                    onChange={(event: any) => this._amountChangeHandle(event)}
                />
                <p className="refresh-warn">Don't refresh or reload the page once the payment start.</p>
                <p className="refresh-warn">You may need to provide phone number and email id to recieve confirmation message once donation completed.</p>
                <DialogFooter>
                    <PrimaryButton className="sp-main-btn" onClick={this._submitForm} text="Donate" />
                </DialogFooter>
            </Dialog>
            <Dialog
                hidden={!this.state.DialogProps2.show}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                modalProps={{
                    styles: { main: { maxWidth: 450, textAlign: "center" } },
                    isBlocking: true
                }}
            >
                <p>{this.state.DialogProps2.message}</p>
                <DefaultButton className="sp-btn-login" onClick={this._closeDialog2} text="Ok" />
            </Dialog>
        </>
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default connect(
    mapStateToProps,
)(Donations);