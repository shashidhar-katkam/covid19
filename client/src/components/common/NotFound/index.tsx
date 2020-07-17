import * as React from "react";
import { NavLink } from "react-router-dom";


class NotFound extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="sp-mt40">
        <h4>The Requested page not found.</h4>
        <NavLink exact to="/">
          Click
        </NavLink> here to go home page.
      </div>
    );
  }

}

export default NotFound;