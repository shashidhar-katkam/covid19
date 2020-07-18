import * as React from "react";
import {
    RouteComponentProps, withRouter
} from 'react-router-dom';
import './styles.scss';
import styles from './styles.module.scss';
import NewsService from '../../Service';
import { INewsInfoC, MainNewsModel } from '../../../../models/models';
import Actions from "../compose";
import { socket } from '../../../../app';
import ImageCarousel from "../templates/ImageCarousel";
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../Redux/models";
import { Shimmer3 } from "../../../common/Loading/Shimmers";
import Analysis from "../templates/Analysis";
import { debug } from "console";
import Donations from "../Donations";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIN from "@highcharts/map-collection/countries/in/custom/in-all-disputed.geo.json";
import mapDataWorld from "@highcharts/map-collection/custom/world-eckert3-highres.geo.json";
highchartsMap(Highcharts);

const dataIndia = require('./dataIndia');
const dataWorld = require('./dataWorld');

interface IState {
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
}

interface IProps extends RouteComponentProps {
    User: IUserState;
}

class Main extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.getIndiaData();
        this.getWorldData();
        this.state = {
            covidDataIndia: {
                confirmed: 0,
                deceased: 0,
                recovered: 0
            },
            covidDataWorld: {
                confirmed: 0,
                deceased: 0,
                recovered: 0
            }
        }
        this.newsService = new NewsService();
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

    public goToFacts() {
        history.push('/facts');
    }

    public render() {

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
        return (
            <>
                <div className={styles.homePageContainer}>
                    <div className={styles.parallax}></div>
                    <div className={styles.wrapper}>
                        <div className={styles.mapContainer}>
                            <div className={styles.worldMap}>
                                <HighchartsReact
                                    constructorType={'mapChart'}
                                    highcharts={Highcharts}
                                    options={mapOptionsWorld}
                                />
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
                                <HighchartsReact
                                    constructorType={'mapChart'}
                                    highcharts={Highcharts}
                                    options={mapOptionsIndia}
                                />
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
                                    <Button type="primary" onClick={() => this.goToFacts()}>{`Learn More >`}</Button>
                                </div>
                            </div>
                            <div className={styles.imageContainer}>
                                <img className={styles.image} src={`https://image.freepik.com/free-photo/girl-with-surgical-mask-is-going-buy-cheese_1153-5294.jpg`} alt="Be precautious" />
                            </div>
                        </div>
                    </div>
                </div>
            </>

        );
    }
}


const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default withRouter(connect(
    mapStateToProps,
)(Main));