import * as React from "react";
import { NavLink } from "react-router-dom";
import './../styles.scss';
import Navbar from "../../Navbar";
import { PivotItem, Pivot } from "office-ui-fabric-react";
import Telugu from "./Telugu";
import English from "./English";
interface IState {

}

interface IProps {

}

class AboutUs extends React.Component<IProps, IState> {

    public render(): JSX.Element {
        return (
            <><Navbar />
                <div className="sp-container main-container" >
                    <div className="about-us">
                        <h5 className="title">Who we are</h5>
                        <hr />
                        <Pivot aria-label="Basic Pivot Example" >
                            <PivotItem
                                headerText="తెలుగు"
                                headerButtonProps={{
                                    'data-order': 1
                                }}
                            >
                                <Telugu />
                            </PivotItem>
                            <PivotItem
                                headerText="English"
                                headerButtonProps={{
                                    'data-order': 2
                                }}
                            >
                                <English />
                            </PivotItem>
                        </Pivot>

                        <style>
                            {
                                `
        
body {
    background-color: white !important;
}
        `
                            }

                        </style>
                    </div>
                </div>
            </>
        );
    }

}

export default AboutUs;