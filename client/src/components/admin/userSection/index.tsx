import * as React from "react";
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import AllUserNews1 from "./AllUserNews1";
import SearchUserNews from "./SearchUserNews";

interface IState {
}

interface IProps {
}

class AllUserNews extends React.PureComponent<IProps, IState> {
  
  public render(): JSX.Element {
    return (
        <Pivot aria-label="Basic Pivot Example" >
          <PivotItem
            headerText="User News"
            headerButtonProps={{
              'data-order': 1,
              'data-title': 'My Files Title',
            }}
          >
            <AllUserNews1 />
          </PivotItem>
          <PivotItem
            headerText="Search News"
            headerButtonProps={{
              'data-order': 2,
              'data-title': 'My Files Title',
            }}
          >
            <SearchUserNews />
          </PivotItem>
        </Pivot>
    );
  }
}

export default AllUserNews;