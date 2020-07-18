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
    indiaData: any;
    worldData: any[];
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
    public indianStateISOtoName: any;
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.getIndiaData();
        this.getWorldData();
        this.getIndiaStateWiseData();
        this.getWorldData();
        this.state = {
            indiaData: null,
            worldData: [],
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
        this.indianStateISOtoName = {
            AN: 'andaman and nicobar',
            AP: 'andhra pradesh',
            AR: 'arunanchal pradesh',
            AS: 'assam',
            BR: 'bihar',
            CH: 'chandigarh',
            CT: 'chhattisgarh',
            DL: 'nct of delhi',
            DN: 'dadara and nagar havelli',
            GA: 'goa',
            GJ: 'gujarat',
            HP: 'himachal pradesh',
            HR: 'haryana',
            JH: 'jharkhand',
            JK: 'jammu and kashmir',
            KA: 'karnataka',
            KL: 'kerala',
            MH: 'maharashtra',
            ML: 'meghalaya',
            MN: 'manipur',
            MP: 'madhya pradesh',
            MZ: 'mizoram',
            NL: 'nagaland',
            OR: 'odisha',
            PB: 'punjab',
            PY: 'puducherry',
            RJ: 'rajasthan',
            SK: 'sikkim',
            TG: 'telangana',
            TN: 'tamil nadu',
            TR: 'tripura',
            UP: 'uttar pradesh',
            UT: 'uttarakhand',
            WB: 'west bengal'
        }
        this.newsService = new NewsService();
    }

    public getIndiaStateWiseData() {
        fetch('https://api.covid19india.org/v4/min/data.min.json', {
            method: 'GET'
        }).then(response => {
            return response.json();
        }).then(indiaData => {
            this.setState({
                indiaData,
                covidDataIndia: {
                    confirmed: indiaData.TT.total.confirmed,
                    deceased: indiaData.TT.total.deceased,
                    recovered: indiaData.TT.total.recovered
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
                worldData: WorldData.Countries,
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
        const { indiaData, worldData, covidDataIndia, covidDataWorld } = this.state;
        let dataIndia: any[] = [],
            dataWorld: any[] = [];
        if (indiaData && Object.keys(indiaData).length) {
            Object.keys(indiaData).forEach(dataKey => {
                if (this.indianStateISOtoName[dataKey]) {
                    dataIndia.push(
                        {
                            'hc-key': this.indianStateISOtoName[dataKey],
                            value: indiaData[dataKey].total.confirmed ? indiaData[dataKey].total.confirmed : 0,
                            confirmed: indiaData[dataKey].total.confirmed ? indiaData[dataKey].total.confirmed : 0,
                            recovered: indiaData[dataKey].total.recovered ? indiaData[dataKey].total.recovered : 0,
                            tested: indiaData[dataKey].total.tested ? indiaData[dataKey].total.tested : 0,
                            deceased: indiaData[dataKey].total.deceased ? indiaData[dataKey].total.deceased : 0,

                        }
                    )
                }
            });
        }

        if (worldData && worldData.length) {
            worldData.forEach(dataKey => {
                dataWorld.push(
                    {
                        'hc-a2': dataKey.CountryCode,
                        value: dataKey.TotalConfirmed ? dataKey.TotalConfirmed : 0,
                        confirmed: dataKey.TotalConfirmed ? dataKey.TotalConfirmed : 0,
                        recovered: dataKey.TotalRecovered ? dataKey.TotalRecovered : 0,
                        deceased: dataKey.TotalDeaths ? dataKey.TotalDeaths : 0,

                    }
                )
            });
        }
        console.log('dataWorld', dataWorld);

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
                pointFormat: `<b>{point.name}:</b>
                <br/>
                Confirmed: <span style="color:#000000a6">{point.confirmed}</span>
                <br/>
                Recovered: <span style="color:#7cb5ec">{point.recovered}</span>
                <br/>
                Deceased: <span style="color:#de2929">{point.deceased}</span>
                `
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
                pointFormat: `<b>{point.name}:</b>
            <br/>
            Confirmed: <span style="color:#000000a6">{point.confirmed}</span>
            <br/>
            Recovered: <span style="color:#7cb5ec">{point.recovered}</span>
            <br/>
            Deceased: <span style="color:#de2929">{point.deceased}</span>
            `
            },
            legend: {
                enabled: false
            },
            series: [{
                data: dataWorld,
                keys: ['hc-a2', 'value'],
                joinBy: 'hc-a2',
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
                                        Confirmed: <b>{covidDataWorld.confirmed}</b>
                                    </div>
                                    <div className={styles.recovered}>
                                        Recovered: <b>{covidDataWorld.recovered}</b>
                                    </div>
                                    <div className={styles.deaths}>
                                        Deceased: <b>{covidDataWorld.deceased}</b>
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
                                        Confirmed: <b>{covidDataIndia.confirmed}</b>
                                    </div>
                                    <div className={styles.recovered}>
                                        Recovered: <b>{covidDataIndia.recovered}</b>
                                    </div>
                                    <div className={styles.deaths}>
                                        Deceased: <b>{covidDataIndia.deceased}</b>
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