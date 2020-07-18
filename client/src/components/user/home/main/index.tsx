import * as React from "react";
import {
    RouteComponentProps, withRouter
} from 'react-router-dom';
import styles from './styles.module.scss';

//import './styles.scss';
import NewsService from '../../Service';
import { AppState } from "../../../../Redux/app.store";
import { connect } from "react-redux";
import { IUserState } from "../../../../Redux/models";
import { Shimmer3 } from "../../../common/Loading/Shimmers";
import { debug } from "console";
import Donations from "../Donations";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
//import highchartsMap from "highcharts/modules/map";
import mapDataIN from "@highcharts/map-collection/countries/in/custom/in-all-disputed.geo.json";
import mapDataWorld from "@highcharts/map-collection/custom/world-eckert3-highres.geo.json";
//highchartsMap(Highcharts);
//import { dataIndia } from './dataindia';
//const dataIndia =* require('./dataindia');
const dataWorld = require('./dataworld');
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
        const dataIndia = [
            ['madhya pradesh', 0],
            ['uttar pradesh', 1],
            ['karnataka', 2],
            ['nagaland', 3],
            ['bihar', 4],
            ['lakshadweep', 5],
            ['andaman and nicobar', 6],
            ['assam', 7],
            ['west bengal', 8],
            ['puducherry', 9],
            ['daman and diu', 10],
            ['gujarat', 11],
            ['rajasthan', 12],
            ['dadara and nagar havelli', 13],
            ['chhattisgarh', 14],
            ['tamil nadu', 15],
            ['chandigarh', 16],
            ['punjab', 17],
            ['haryana', 18],
            ['andhra pradesh', 19],
            ['maharashtra', 20],
            ['himachal pradesh', 21],
            ['meghalaya', 22],
            ['kerala', 23],
            ['telangana', 24],
            ['mizoram', 25],
            ['tripura', 26],
            ['manipur', 27],
            ['arunanchal pradesh', 28],
            ['jharkhand', 29],
            ['goa', 30],
            ['nct of delhi', 31],
            ['odisha', 32],
            ['jammu and kashmir', 33],
            ['sikkim', 34],
            ['uttarakhand', 35]
        ];
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