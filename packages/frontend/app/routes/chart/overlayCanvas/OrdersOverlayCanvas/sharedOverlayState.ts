import * as d3 from 'd3';

type ScaleData = {
    yScale: d3.ScaleLinear<number, number>;
    xScale: d3.ScaleLinear<number, number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleSymlog: any;
};

export const scaleDataRef: { current: ScaleData | null } = {
    current: null,
};

export const mousePositionRef = { current: { x: 0, y: 0 } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const canvasSizeRef = { current: null as any };
