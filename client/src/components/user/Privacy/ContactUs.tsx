import * as React from "react";
import { NavLink } from "react-router-dom";
import './styles.scss';
import Navbar from "../Navbar";
import NeedHelp from "./NeedHelp";


interface IState {
    showNeedHelp: boolean;

}



class ContactUs extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {

            showNeedHelp: false
        }
    }

    render(): JSX.Element {
        return (<>
        <Navbar />
            <div className="sp-container main-container" >
                <div className="ms-Grid sp-mt40" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 return-policy ">
                            <h5 className="title">Contact Us</h5>
                            <hr />
                           
                            <p >Would you like to contact us. <span className="span-link" onClick={() => this.setState({ showNeedHelp: true })} >click here</span> </p>
                        </div>
                    </div>
                </div>
                {this.state.showNeedHelp && <NeedHelp showDialog={true} afterCancel={() => { this.setState({ showNeedHelp: false }) }} />}

                <div className="privacy">
                        <span className="title-a1">Q Group Media © 2020</span>
                        <br />
                        <NavLink exact to="/privacy">Privacy
                </NavLink>
                        <NavLink exact to="/terms">Terms
                </NavLink>
                        <NavLink exact to="/about-us">About Us
                </NavLink>

                    </div>
            </div>
        </>)
    }

}

export default ContactUs;
