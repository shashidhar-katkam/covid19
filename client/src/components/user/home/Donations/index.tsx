import * as React from "react";
import { DefaultButton, IStackStyles, Dialog, DialogType, DialogFooter, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { connect } from "react-redux";
import './styles.scss';
import { IUserState } from "../../../../Redux/models";
import { AppState } from "../../../../Redux/app.store";
import Service from '../../Service';
import { IDialogPropss } from "../../../../models/models";
import Loading from "../../../common/Loading";

const stackStyles: Partial<IStackStyles> = { root: { color: "#0078d4" } };

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

}

class Donations extends React.Component<IProps, IState> {
    private service: Service;
    constructor(props: IProps) {
        super(props);
        this.state = {
            showModel: false,
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
                _id: this.props.User && this.props.User.User && this.props.User.User._id ? this.props.User.User._id : '',
                firstName: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                amount: ''
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
        const amount = (event.target.validity.valid || event.target.value === '') ? event.target.value : this.state.donationForm.amount;
        if (event.target.value === "") {
            errorMessage = 'Min Rs.10'
        } else if (!event.target.validity.valid) {
            errorMessage = this.props.User.staticConstants.Constants.onlyNumbersAllowed;
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
            console.log(this.state.donationForm);
            let requestObj: any = this.state.donationForm;
            requestObj._id = Date().toString();
            if (requestObj._id == '') {
                requestObj._id = null;
            }
            this.setState({
                isLoading: true
            });
            this.service.raiseDonationRequest(requestObj).then((res: any) => {
                debugger;
                console.log(res);
                if (res.status && res.statuscode === 23) {
                    this.setState({
                        response: res.data,
                        isLoading: false,
                        showModel: false,
                        donationForm: {
                            _id: this.props.User && this.props.User.User && this.props.User.User._id ? this.props.User.User._id : '',
                            firstName: this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : '',
                            phoneNumber: this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : '',
                            email: this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : '',
                            amount: ''
                        }
                    });
                    let data = res.data;
                    var thisObj = this;
                    let options = {
                        "key": data.key,
                        "amount": data.paymentInit.amount, // 2000 paise = INR 20, amount in paisa
                        "name": "Q GROUP MEDIA",
                        "currency": "INR",
                        "order_id": data.paymentInit.id,
                        "description": "Please complete the payment.",
                        "image": "http://localhost:7777/uploads/static_files/qnewslogo.jpg",
                        "handler": function (response: any) {
                            console.log(response);
                            thisObj.onPaymentSuccuess(response);
                        },
                        "prefill": {
                            "name": `${this.props.User && this.props.User.User && this.props.User.User.firstName ? this.props.User.User.firstName : ''}`,
                            "email": `${this.props.User && this.props.User.User && this.props.User.User.email ? this.props.User.User.email : ''}`,
                            "contact": `${this.props.User && this.props.User.User && this.props.User.User.phoneNumber ? this.props.User.User.phoneNumber : ''}`,
                        },
                        "theme": {
                            "color": "#0065b3"
                        }
                    };
                    var thisWindow: any = window;
                    let rzp: any = new thisWindow.Razorpay(options);
                    rzp.open();
                }
                else {
                    this.setState({
                        isLoading: false,
                        errormsg: res.statusmsg
                    });

                    setTimeout(() => {
                        this.setState({
                            errormsg: ''
                        });
                    }, 5000);
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
            <div className="donations c-style1" >
                <div className="c-btns">
                    <p className="d-txt">Please donate a small amount to raise Our (Journalist) voice.</p>
                    <p className="d-txt2">A small amount can help us to save Journalism and society</p>
                    <DefaultButton iconProps={{ iconName: 'Heart', styles: stackStyles }} className={`c-btn`} onClick={this._showDialog} text={this.props.User.staticConstants.Constants.donate} />
                </div>
            </div>
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