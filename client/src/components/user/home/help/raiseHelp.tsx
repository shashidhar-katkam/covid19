import * as React from "react";
import { DefaultButton, IStackStyles, Dialog, DialogType, DialogFooter, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { connect } from "react-redux";
import './styles.scss';
import { IUserState } from "../../../../Redux/models";
import { AppState } from "../../../../Redux/app.store";
import Service from '../../Service';
import { IDialogPropss } from "../../../../models/models";
import Loading from "../../../common/Loading";

const stackStyles: Partial<IStackStyles> = { root: { color: "#E55346" } };

interface IDonationForm {
    name: string;
    phoneNumber: string;
    email: string;
    problem: string;
    expect: string;
}
interface IDonationFormErr {
    nameErr: string;
    phoneNumberErr: string;
    emailErr: string;
    problemErr: string;
    expectErr: string;
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

}

class RaiseHelp extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            showModel: false,
            donationForm: {
                // _id: this.props.User && this.props.User.User && this.props.User.User._id ? this.props.User.User._id : '',
                name: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                problem: '',
                expect: ''
            },
            donationFormErr: {
                phoneNumberErr: '',
                nameErr: '',
                emailErr: '',
                problemErr: '',
                expectErr: ''
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
        this.onPaymentSuccuess = this.onPaymentSuccuess.bind(this);
        this._closeDialog2 = this._closeDialog2.bind(this);
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
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
                name: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                problem: '',
                expect: ''
            }
        });
    }
    private _inputChangeHandle(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            donationForm: { ...this.state.donationForm, [event.target.name]: event.target.value },
        });
    }

    public _amountChangeHandle = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let errorMessage: string;
        const amount = (event.target.validity.valid || event.target.value === '') ? event.target.value : this.state.donationForm.phoneNumber;
        if (event.target.value === "") {
            errorMessage = 'Required'
        } else if (!event.target.validity.valid) {
            errorMessage = "Only number are allowed";
        } else {
            errorMessage = "";
        }
        this.setState({
            donationForm: { ...this.state.donationForm, [event.target.name]: amount },
            donationFormErr: { ...this.state.donationFormErr, [event.target.name + 'Err']: errorMessage }
        });
    }

    private onPaymentSuccuess(obj: any) {
        debugger;
        if (obj && obj.razorpay_payment_id) {
            this.setState({ isLoading: true });
            let objee: any = {};
            objee.PaymentSuccess = obj;
            objee.paymentInit = this.state.response.paymentInit;
            objee.orderId = this.state.response.orderId;

            this.service.updateDonationRequest(objee).then((res: any) => {
                console.log(res);
                debugger;
                if (res.status) {
                    this.setState({
                        DialogProps2: { show: true, message: 'Thanks for donating.' },
                        isLoading: false
                    });
                } else {
                    this.setState({
                        DialogProps2: { show: true, message: res.message },
                        isLoading: false
                    });
                }
            });
        }
    }


    private isFormValid = (): boolean => {
        let donationForm: IDonationForm = this.state.donationForm;
        let donationFormErr: IDonationFormErr = this.state.donationFormErr;
        let isFormValid: boolean = true;
        if (donationForm.phoneNumber === "") {
            donationFormErr.phoneNumberErr = 'Required'
            isFormValid = false;
        }
        else {
            donationFormErr.phoneNumberErr = "";
        }

        if (donationForm.phoneNumber === "") {
            donationFormErr.phoneNumberErr = "Required";
            isFormValid = false;
        } else if (donationForm.phoneNumber.length < 10) {
            donationFormErr.phoneNumberErr = "Enter valid mobile number"
            isFormValid = false;
        } else {
            donationFormErr.phoneNumberErr = "";
        }

        if (donationForm.problem === "") {
            donationFormErr.problemErr = 'Required'
            isFormValid = false;
        }
        else {
            donationFormErr.problemErr = "";
        }

        if (donationForm.expect === "") {
            donationFormErr.expectErr = 'Required'
            isFormValid = false;
        }
        else {
            donationFormErr.expectErr = "";
        }

        this.setState({
            donationFormErr
        });
        return isFormValid;
    }

    private _submitForm() {
        if (this.isFormValid()) {
            console.log(this.state.donationForm);
            let requestObj: any = this.state.donationForm;

            this.setState({
                isLoading: true
            });
            this.service.raiseHelpRequest1(requestObj).then((res: any) => {
                debugger;
                console.log(res);

                if (res.status) {

                    this.setState({
                        showModel: false,
                        donationForm: {
                            name: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                            phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                            email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                            problem: '',
                            expect: ''
                        },
                        donationFormErr: {
                            phoneNumberErr: '',
                            nameErr: '',
                            emailErr: '',
                            problemErr: '',
                            expectErr: ''
                        },
                        DialogProps2: { show: true, message: "Thanks for reaching out. We will help you." },
                        isLoading: false
                    });
                }

            });
        }
    }

    private _closeDialog2() {
        this.setState({
            DialogProps2: { show: false, message: '' }
        });

    }

    public render(): JSX.Element {
        return (<>
            {this.state.isLoading && <Loading />}
            <div className="raise-help c-style1" >
                <div className="c-btns">
                    <p className="d-txt ms-fontSize-24">Do you need any help?</p>
                    <p className="d-txt2">Please let our community know that you are seeking something</p>
                    <DefaultButton iconProps={{ iconName: 'Heart', styles: stackStyles }} className={`c-btn`} onClick={this._showDialog} text="Request" />

                </div>
                {
                    this.state.showModel && <div>
                        <TextField label="Name"
                            placeholder="Please enter name"
                            name="name"
                            value={this.state.donationForm.name}
                            required
                            errorMessage={this.state.donationFormErr.nameErr}
                            onChange={(event: any) => this._inputChangeHandle(event)}
                        />
                        <TextField label="Phone Number"
                            placeholder="Please enter mobile number."
                            name="phoneNumber"
                            pattern="[0-9]*"
                            required
                            minLength={10} prefix="+91" maxLength={10}
                            errorMessage={this.state.donationFormErr.phoneNumberErr}
                            value={this.state.donationForm.phoneNumber}
                            onChange={(event: any) => this._amountChangeHandle(event)}
                        />
                        <TextField label="How can we help You?"
                            placeholder="Describe your problem"
                            name="problem"
                            multiline={true}
                            rows={3}
                            required
                            errorMessage={this.state.donationFormErr.problemErr}
                            value={this.state.donationForm.problem}
                            onChange={(event: any) => this._inputChangeHandle(event)}
                        />
                        <TextField label="Location"
                            placeholder="please mention your address."
                            name="expect"
                            multiline={true}
                            rows={3}
                            required
                            value={this.state.donationForm.expect}
                            errorMessage={this.state.donationFormErr.expectErr}
                            onChange={(event: any) => this._inputChangeHandle(event)}
                        />
                        <DefaultButton onClick={this._submitForm} className="sp-main-btn btn-register" text="Send" />
                    </div>
                }
            </div>
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
)(RaiseHelp);