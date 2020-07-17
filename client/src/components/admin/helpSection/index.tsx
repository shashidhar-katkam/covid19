import * as React from "react";
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import MainHelpRequests from "./MainHelpRequests";
import AllUserHelps from './AllUserHelps';

class AdminSection extends React.PureComponent<{}, {}> {
    
  render(): JSX.Element {
    return (
      <div className="sp-mt10">
        <Pivot aria-label="Basic Pivot Example" >
          <PivotItem
            headerText="User Requests"
            headerButtonProps={{
              'data-order': 1,
              'data-title': 'My Files Title',
            }}
          >
            <AllUserHelps />
          </PivotItem>
          <PivotItem
            headerText="Monitor Requests"
            headerButtonProps={{
              'data-order': 2,
              'data-title': 'My fge',
            }}
          >
            <MainHelpRequests />
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}

export default AdminSection;