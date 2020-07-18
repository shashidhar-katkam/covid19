import * as React from 'react';
import styles from './styles.module.scss';
import { factsData } from './factsData';

export default class Facts extends React.Component<{}, {}> {
    public render() {
        return <>
            <div className={styles.factsContainer}>

                {factsData && factsData.length ?
                    factsData.map((data: any) => {
                        return <div className={styles.facts}>
                            <div className={styles.title}>{data.title}</div>
                            <div className={styles.description}>{data.description}</div>
                            <div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: data.videoSrc }}>
                                {/* <video className={styles.video} controls>

                                    <source src={data.videoSrc} type="video/mp4" />
                                        <source src={data.videoSrc} type="video/ogg" />
                                            Your browser does not support HTML video.
                                </video> */}
                            </div>
                        </div>;
                    })
                    : ''
                }
            </div>
        </>;
    }
}