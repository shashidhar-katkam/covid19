import * as React from "react";
import Navbar from "../Navbar/index";
import Stories from './stories';
import Help from './help';
import Main from './main';
import { DefaultButton, IStackStyles } from "office-ui-fabric-react";
const stackStyles: Partial<IStackStyles> = { root: { color: "#E55346" } };
interface IProps {
}

interface IState {
    model: number;
}

class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            model: 1
        }
        this._onModelOpen = this._onModelOpen.bind(this);
        this.reRender = this.reRender.bind(this);
    }

    private reRender() {
        this.render();
    }

    private _onModelOpen(model: number) {
        if (this.state.model === model) {
        } else {
            this.setState({
                model: model
            });
        }
    }


    public render(): JSX.Element {
        return (<>
            <Navbar afterLanguageChange={this.reRender} />
            <div className="sp-container13 main-container" style={{
                backgroundImage: `url("https://raw.githubusercontent.com/bimalendu04/file_Host/master/ShareCare%20(1).png")`
            }} >
            </div >
            <div>
                <p>asdfg</p>
            </div>
        </>
        );
    }
}

export default Home;