import * as React from "react";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import './styles.scss';

class Loading extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="loading">
                <div className="loading-c">
                    <Spinner size={SpinnerSize.large} />
                </div>
            </div>
        );
    }
}

export default Loading;