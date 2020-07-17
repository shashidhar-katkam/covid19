import * as React from "react";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import './styles.scss';


class InLoading extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="loading1">
                <div className="loading-c1">
                    <Spinner size={SpinnerSize.large} />
                </div>
            </div>
        );
    }
}

export default InLoading;