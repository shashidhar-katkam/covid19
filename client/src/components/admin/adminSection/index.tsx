import * as React from "react";
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import CreateNews from "./CreateNews";
import SearchNews from "./SearchNews";
import MainNews from "./MainNews";
import AddImages from "./imageCard/AddImages";
import AddFiles from "./mainCard/AddFiles";

class AdminSection extends React.PureComponent<{}, {}> {
  render(): JSX.Element {
    return (
      <div className="sp-mt10 sp-mb100">
        <Pivot aria-label="Basic Pivot Example" >
          <PivotItem
            headerText="Create News"
            headerButtonProps={{
              'data-order': 1
            }}
          >
            <CreateNews />
          </PivotItem>
          <PivotItem
            headerText="All News"
            headerButtonProps={{
              'data-order': 2
            }}
          >
            <MainNews />
          </PivotItem>
          <PivotItem
            headerText="Search News"
            headerButtonProps={{
              'data-order': 3
            }}>
            <SearchNews />
          </PivotItem>
          <PivotItem
            headerText="Side Card"
            headerButtonProps={{
              'data-order': 4
            }}
          >
            <AddImages />
          </PivotItem>
          <PivotItem
            headerText="Main Card"
            headerButtonProps={{
              'data-order': 5
            }}
          >
            <AddFiles />
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}

export default AdminSection;