import * as React from "react";
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import SelfAdminRequests from "./SelfAdminRequests";
import AllRegistration from "./AllRegistrations";

interface IState {
}

interface IProps {
}

class Registration extends React.PureComponent<IProps, IState> {

  render(): JSX.Element {
    return (
      <div>
        <Pivot aria-label="Basic Pivot Example" >
          <PivotItem
            headerText="Registrations"
            headerButtonProps={{
              'data-order': 1,
              'data-title': 'My Files Title',
            }}
          >
            <AllRegistration />
          </PivotItem>
          <PivotItem
            headerText="Self Admin Requests"
            headerButtonProps={{
              'data-order': 2,
              'data-title': 'Seld admin',
            }}
          >
            <SelfAdminRequests />
          </PivotItem>
        </Pivot>
    </div>
    );
  }
}

export default Registration;