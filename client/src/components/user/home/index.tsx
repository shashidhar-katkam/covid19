import * as React from "react";
import Navbar from "../Navbar/index";
import styles from './styles.module.scss';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import mapDataIN from "@highcharts/map-collection/countries/in/custom/in-all-disputed.geo.json";
import mapDataWorld from "@highcharts/map-collection/custom/world-eckert3-highres.geo.json";
import { DefaultButton } from "office-ui-fabric-react";
import { AppState } from "../../../Redux/app.store";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IUserState } from "../../../Redux/models";
import Donations from "./Donation";

const dataIndia = require('./dataindia');
const dataWorld = require('./dataworld');


interface IProps extends RouteComponentProps {
    User: IUserState;
}

interface IState {
    model: number;
    covidDataIndia: {
        confirmed: number;
        deceased: number;
        recovered: number;
    };
    covidDataWorld: {
        confirmed: number;
        deceased: number;
        recovered: number;
    };
    showDonateModel: boolean;
}

class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            model: 1,
            covidDataIndia: {
                confirmed: 0,
                deceased: 0,
                recovered: 0
            },
            covidDataWorld: {
                confirmed: 0,
                deceased: 0,
                recovered: 0
            },
            showDonateModel: false
        }
        this._onModelOpen = this._onModelOpen.bind(this);
        this.reRender = this.reRender.bind(this);
        this.hideDonateModel = this.hideDonateModel.bind(this);
        this.showDonateModel = this.showDonateModel.bind(this);
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

    private goToFacts() {
        this.props.history.push('/corona');
    }

    private showDonateModel() {
        this.setState({
            showDonateModel: true
        })
    }

    private hideDonateModel() {
        this.setState({
            showDonateModel: false
        });
    }


    public getIndiaData() {
        // 'https://api.covidindiatracker.com/state_data.json'
        fetch('https://api.covidindiatracker.com/total.json', {
            method: 'GET'
        }).then(response => {
            return response.json();
        }).then(indiaData => {
            this.setState({
                covidDataIndia: {
                    confirmed: indiaData.confirmed,
                    deceased: indiaData.deaths,
                    recovered: indiaData.recovered
                }
            });
        })
    }

    public getWorldData() {
        fetch('https://api.covid19api.com/summary', {
            method: 'GET'
        }).then(response => {
            return response.json();
        }).then(WorldData => {
            this.setState({
                covidDataWorld: {
                    confirmed: WorldData.Global.TotalConfirmed as number,
                    deceased: WorldData.Global.TotalDeaths as number,
                    recovered: WorldData.Global.TotalRecovered as number
                }
            });
        })
    }


    componentDidMount() {

        this.getIndiaData();
        this.getWorldData();
    }


    public render(): JSX.Element {
        const mapOptionsIndia = {
            chart: {
                map: 'countries/in/custom/in-all-disputed',
                backgroundColor: 'transparent'
            },

            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            mapNavigation: {
                enabled: false
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}:</b>{point.value}'
            },
            legend: {
                enabled: false
            },
            series: [{
                data: dataIndia,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                },

                mapData: mapDataIN,
            }]
        }
        const mapOptionsWorld = {
            chart: {
                map: 'countries/in/custom/in-all-disputed',
                backgroundColor: 'transparent'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },

            mapNavigation: {
                enabled: false
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}:</b>{point.x}'
            },
            legend: {
                enabled: false
            },
            series: [{
                data: dataWorld,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                },

                mapData: mapDataWorld,
            }]
        }


        return (<>
            <Navbar afterLanguageChange={this.reRender} />
            <div className="sp-container13 main-container" style={{
                backgroundImage: `url("https://raw.githubusercontent.com/bimalendu04/file_Host/master/ShareCare1%20(1).png")`
            }} >
            </div >
            <div className={styles.homePageContainer}>
                <div className={styles.parallax}></div>
                <div className={styles.wrapper}>
                    <div className={styles.mapContainer}>
                        <div className={styles.worldMap}>
                            {/* <HighchartsReact
                                constructorType={'mapChart'}
                                highcharts={Highcharts}
                                options={mapOptionsWorld}
                            /> */}
                            <img src="http://localhost:7777/uploads/static_files/worldmap.jpg" alt="worldmap" />
                            <div className={styles.totalValueContainer}>
                                <div className={styles.total}>
                                    Confirmed: <b>{this.state.covidDataWorld.confirmed}</b>
                                </div>
                                <div className={styles.recovered}>
                                    Recovered: <b>{this.state.covidDataWorld.recovered}</b>
                                </div>
                                <div className={styles.deaths}>
                                    Deceased: <b>{this.state.covidDataWorld.deceased}</b>
                                </div>
                            </div>
                        </div>
                        <div className={styles.indiaMap}>
                            <img src="http://localhost:7777/uploads/static_files/indiamap.jpg" alt="indiamap" />
                            <div className={styles.totalValueContainer}>
                                <div className={styles.total}>
                                    Confirmed: <b>{this.state.covidDataIndia.confirmed}</b>
                                </div>
                                <div className={styles.recovered}>
                                    Recovered: <b>{this.state.covidDataIndia.recovered}</b>
                                </div>
                                <div className={styles.deaths}>
                                    Deceased: <b>{this.state.covidDataIndia.deceased}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div></div>
                    <div className={styles.covidDetailsBrief}>
                        <div className={styles.details}>
                            <div className={styles.title}>Get the facts about Corona Virus</div>
                            <div className={styles.subTitle}>Take steps to care for yourself and help protect others in your home and community.</div>
                            <div className={styles.learnMore}>
                                <DefaultButton className="sp-main-btn learn-more" onClick={() => this.goToFacts()} text="Learn More" />
                            </div>
                        </div>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src={`https://image.freepik.com/free-photo/girl-with-surgical-mask-is-going-buy-cheese_1153-5294.jpg`} alt="Be precautious" />
                        </div>
                    </div>
                    <div className={styles.donateWrapper}>
                        <div className={styles.details}>
                            <div className={styles.title}>Donate</div>
                            <div className={styles.subTitle}>Giving is not just about make a donation, it's about making a difference</div>
                            <div className={styles.subTitle1}>Small acts, when mutltiplied by millions of people can transform the world</div>
                            <div className={styles.subTitle2}>Real charity is giving from the heart without taking credit.</div>
                            <div className={styles.learnMore}>
                                <DefaultButton className="sp-main-btn learn-more" onClick={() => this.showDonateModel()} text="Donate" />
                            </div>
                        </div>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src={`http://localhost:7777/uploads/static_files/donate.jpg`} alt="Be precautious" />
                        </div>
                    </div>
                </div>
            </div>
            {this.state.showDonateModel &&
                <Donations isShow={this.state.showDonateModel} hideDonateModel={this.hideDonateModel} />
            }
        </>
        );
    }
}

const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default withRouter(connect(
    mapStateToProps,
)(Home));