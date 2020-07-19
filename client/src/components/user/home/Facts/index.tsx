import * as React from 'react';
import styles from './styles.module.scss';
import { factsData } from './factsData';

export default class Facts extends React.Component<{}, {}> {
    public render() {
        return <>
            <div className={styles.factsContainer}>
                <div className={styles.heading}>Facts on Corona Virus</div>
                {factsData && factsData.length ?
                    factsData.map((data: any, index: number) => {
                        // return <div className={styles.facts}>
                        //     <div className={styles.title}>{data.title}</div>
                        //     <div className={styles.description}>{data.description}</div>
                        //     <div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: data.videoSrc }}>
                        //     </div>
                        // </div>;
                        if (index % 2 === 0) {
                            return <div className={`${styles.container} ${styles.even}`}>
                                <div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: data.videoSrc }}>
                                </div>
                                <div className={styles.questionContainer}>
                                    <div className={styles.title}>{data.title}</div><div className={styles.description}>{data.description}</div>
                                </div>
                            </div>;
                        }
                        return <div className={`${styles.container} ${styles.odd}`}>
                            <div className={styles.questionContainer}>
                                <div className={styles.title}>{data.title}</div><div className={styles.description}>{data.description}</div>
                            </div>
                            <div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: data.videoSrc }}>
                            </div>
                        </div>;

                    })
                    : ''
                }
            </div>
        </>;
    }
}