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

}

interface IProps extends RouteComponentProps {
    User: IUserState;
}

class Main extends React.Component<IProps, IState> {
    private newsService: NewsService;
    constructor(props: IProps) {
        super(props);
        this.state = {

        }
        this.newsService = new NewsService();

    }


    render(): JSX.Element {

        const mapOptionsIndia = {
            chart: {
                map: 'countries/in/custom/in-all-disputed',
                backgroundColor: 'transparent'
            },
            title: {
                text: 'Map Demo'
            },
            credits: {
                enabled: false
            },
            mapNavigation: {
                enabled: false
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.freq}</b><br><b>{point.keyword}</b>                      <br>lat: {point.lat}, lon: {point.lon}'
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
                    enabled: true,
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
                text: 'Map Demo'
            },
            credits: {
                enabled: false
            },

            mapNavigation: {
                enabled: false
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.freq}</b><br><b>{point.keyword}</b>                      <br>lat: {point.lat}, lon: {point.lon}'
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
                    enabled: true,
                    format: '{point.name}'
                },

                mapData: mapDataWorld,
            }]
        }

        return (
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
                            </div>
                            <div className={styles.indiaMap}>
                                <HighchartsReact
                                    constructorType={'mapChart'}
                                    highcharts={Highcharts}
                                    options={mapOptionsIndia}
                                />
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
        );
    }
}


const mapStateToProps = (state: AppState): AppState => ({
    User: state.User,
});

export default withRouter(connect(
    mapStateToProps,
)(Main));