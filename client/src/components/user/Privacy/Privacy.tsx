import * as React from "react";
import { NavLink } from "react-router-dom";
import './styles.scss';
import Navbar from "../Navbar";
interface IState {

}

interface IProps {

}

class PrivacyC extends React.Component<IProps, IState> {

    public render(): JSX.Element {
        return (
            <>
                <Navbar />
                <div className="sp-container main-container" >
                    <div className="privacy-c">
                        <h5 className="title">Privacy policy</h5>
                        <hr />
                        <div>
                            <h6> SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?</h6>
                            <p>
                                When you register to our site, we collect the personal information you give us such as your name, address and email address, phone number to identify you. We will store your details in our secure server.
                                When you browse our store, we also automatically receive your computer’s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
                                Email marketing (if applicable): With your permission, we may send you emails about our store, new products and other updates.
                                </p>
                                <p>Once you registered to our site means you are giving the permissions to access your basic information like phone number, name, gender, address. We may contact you to verify your identity.</p>
                            <h6> SECTION 2 - SECURITY </h6>
                            <p>To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.</p>
                            <p>When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements. </p>
                            <h6> SECTION 3 - COOKIES </h6>
                            <p>
                                Generally we store some cookies in your browser for unique identification of the user, and to maintan cart.
                                </p>
                            <h6>
                                SECTION 4 - AGE OF CONSENT</h6>
                            <p>By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                                    </p>
                            <h6> SECTION 5 - CHANGES TO THIS PRIVACY POLICY </h6>
                            <p>
                                We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
                                If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
                                    </p>
                            <h6>   QUESTIONS AND CONTACT INFORMATION </h6>
                            <p>If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at support@Journalism.com
                                </p>
                        </div>
                    </div>
                    <div className="privacy">
                <span className="title-a1">Q Group Media © 2020</span>
                <br/>
                <NavLink exact to="/terms">Terms
                </NavLink>
                <NavLink exact to="/about-us">About Us
                </NavLink>
                
                <NavLink exact to="/contact-us">Contact Us
                </NavLink>
            </div>
                </div>

               
            </>
        );
    }

}

export default PrivacyC;