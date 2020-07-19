import * as React from 'react';
import styles from './styles.module.scss';
import { factsData } from './factsData';
import Navbar from '../../Navbar';

export default class Facts extends React.Component<{}, {}> {
    public render() {
        return <>
        <Navbar />
            <div className={styles.factsContainer}>

                {factsData && factsData.length ?
                    factsData.map((data: any) => {
                        return <div className={styles.facts}>
                            <div className={styles.title}>{data.title}</div>
                            <div className={styles.description}>{data.description}</div>
                            <div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: data.videoSrc }}>
                            </div>
                        </div>;
                    })
                    : ''
                }
            </div>
        </>;
    }


    componentDidMount(){
        window.scrollTo(0,0);
    }
}