import * as React from "react";
import './styles.scss';
import { ShimmerElementsGroup, ShimmerElementType, IShimmerStyleProps, IShimmerStyles, Shimmer } from "office-ui-fabric-react";
const wrapperStyle = { display: 'flex' };

interface IProps {
    url: string;
}

function ShimmerLine(): JSX.Element {
    return (
        <div className="shimmer-w">
            <ShimmerElementsGroup
                shimmerElements={[
                    { type: ShimmerElementType.line, width: '100%', height: 32 },
                ]}
            />
        </div>
    );
};

function ShimmerCircleAndLine(): JSX.Element {
    return (
        <div style={wrapperStyle}>
            <ShimmerElementsGroup
                shimmerElements={[
                    { type: ShimmerElementType.circle, width: 30, height: 60 },
                    { type: ShimmerElementType.gap, width: 10, height: 80 },
                ]}
            />
            <ShimmerElementsGroup
                flexWrap
                shimmerElements={[
                    { type: ShimmerElementType.line, width: 300, height: 20 },
                    { type: ShimmerElementType.line, width: 200, height: 20 },
                    { type: ShimmerElementType.gap, width: 100, height: 40 },
                ]}
            />
        </div>
    );
};

function getShimmerStyles(props: IShimmerStyleProps): IShimmerStyles {
    return {
        shimmerGradient: [
            {
                backgroundImage:
                    'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #fff 50%, rgba(255, 255, 255, 0) 100%)',
            },
        ],
    };
};

const shimmerWithElementFirstRow = [
    { type: ShimmerElementType.circle, height: 50 },
    { type: ShimmerElementType.gap, width: '2%', height: 50 },
    { type: ShimmerElementType.line, height: 50 },
];

function Shimmer1(): JSX.Element {
    return (
        <Shimmer customElementsGroup={ShimmerLine()} width="100%" styles={getShimmerStyles} />
    );
};

export function Shimmer2(): JSX.Element {
    return (
        <Shimmer customElementsGroup={ShimmerCircleAndLine()} width="100%" styles={getShimmerStyles} />
    );
};

export function Shimmer3(): JSX.Element {
    return (<div className="shimmer-wrapper">
        <div className="shimmer">
            <Shimmer shimmerElements={shimmerWithElementFirstRow} styles={getShimmerStyles} />
        </div>
        <div className="shimmer">
            <Shimmer customElementsGroup={ShimmerLine()} width="100%" styles={getShimmerStyles} />
        </div>
        <div className="shimmer">
            <Shimmer customElementsGroup={ShimmerLine()} width="100%" styles={getShimmerStyles} />
        </div>
    </div>
    );
};

export default Shimmer1;