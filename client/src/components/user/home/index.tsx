import * as React from "react";
import ListTemplate from './templates/ListTemplate/index';
import MainNews from './mainNews/index';
import ImageCard from "./templates/ImageCards";
import Privacy from "../Privacy";
import Navbar from "../Navbar/index";
import Secondnavbar from '../Navbar/Secondnavbar';
import ImageTextCard from "./templates/ImageTextCard";
import { DefaultButton, IStackStyles } from "office-ui-fabric-react";
const stackStyles: Partial<IStackStyles> = { root: { color: "#0078d4" } };
interface IProps {
}

interface IState {
    model: number;
}

class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            model: 0
        }
        this._onModelOpen = this._onModelOpen.bind(this);
        this.reRender = this.reRender.bind(this);
    }

    private reRender() {
        this.render();
    }

    private _onModelOpen(model: number) {
        if (this.state.model === model) {
            // this.setState({
            //     model: 0
            // });
        } else {
            this.setState({
                model: model
            });
        }
    }


    public render(): JSX.Element {
        return (<>
            <Navbar afterLanguageChange={this.reRender} />
            {/* <Secondnavbar /> */}
            <div className="sp-container main-container" >
                <div className="main-nav-items" >
                    <div className="c-btns">
                        <DefaultButton iconProps={{ iconName: 'HeartBroken', styles: stackStyles }} onClick={() => this._onModelOpen(1)} className={`c-btn ${this.state.model === 1 ? 'sp-active' : ''}`} text="Home" />
                        <DefaultButton iconProps={{ iconName: 'PageHeaderEdit', styles: stackStyles }} onClick={() => this._onModelOpen(2)} className={`c-btn c-btn2 ${this.state.model === 2 ? 'sp-active' : ''}`} text="ShareCare" />
                        <DefaultButton iconProps={{ iconName: 'PageHeaderEdit', styles: stackStyles }} onClick={() => this._onModelOpen(3)} className={`c-btn c-btn2 ${this.state.model === 3 ? 'sp-active' : ''}`} text="Help" />
                    </div>

                </div>
                <div className="ms-Grid sp-no-pm" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12 ms-md8 ms-lg7-5 ">
                            {
                                this.state.model ===1 && <MainNews></MainNews>
                            }
                            
                        </div>
                        <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4-5 ms-hiddenSm " >
                            {/* <div className="sticky-right1 cust-scroll" >
                                <ListTemplate></ListTemplate>
                                <ImageTextCard />
                                <ImageCard></ImageCard>
                                <Privacy />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
    }
}

export default Home;