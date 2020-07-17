import * as React from "react";
import { NavLink } from "react-router-dom";
import './styles.scss';
interface IState {

}

interface IProps {

}

class Privacy extends React.Component<IProps, IState> {

    public render(): JSX.Element {
        return (
            <div className="privacy">
                <NavLink exact to="/privacy">Privacy
                </NavLink>
                <NavLink exact to="/terms">Terms
                </NavLink>
                <NavLink exact to="/about-us">About Us
                </NavLink>
                <NavLink exact to="/contact-us">Contact Us
                </NavLink>
                <br />
                <span className="title-a1">Q Group Media © 2020</span>
            </div>
        );
    }

}

export default Privacy;