import React, { useEffect, useRef, useState } from 'react';
import { useOpenOrderLines } from './useOpenOrderLines';
import { usePositionOrderLines } from './usePositionOrderLines';
import LineComponent from './component/LineComponent';
import LabelComponent from './component/LabelComponent';
import { useTradingView } from '~/contexts/TradingviewContext';
import type { IPaneApi } from '~/tv/charting_library';

export type OrderLinesProps = {
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
};

export default function OrderLines({
    overlayCanvasRef,
    canvasSize,
}: OrderLinesProps) {
    const { chart, isChartReady } = useTradingView();

    const openLines = useOpenOrderLines();
    const positionLines = usePositionOrderLines();

    const combinedData = [...openLines, ...positionLines];

    const [zoomChanged, setZoomChanged] = useState(false);
    const prevRangeRef = useRef<{ min: number; max: number } | null>(null);

    const animationFrameRef = useRef<number>(0);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isZoomingRef = useRef(false);
    const [localChartReady, setLocalChartReady] = useState(true);

    useEffect(() => {
        if (!chart) return;

        const chartRef = chart.activeChart();
        const priceScalePane = chartRef.getPanes()[0] as IPaneApi;
        const priceScale = priceScalePane.getMainSourcePriceScale();
        if (!priceScale) return;

        const loop = () => {
            const priceRange = priceScale.getVisiblePriceRange();
            if (priceRange) {
                const currentRange = {
                    min: priceRange.from,
                    max: priceRange.to,
                };

                const prevRange = prevRangeRef.current;
                const hasChanged =
                    !prevRange ||
                    prevRange.min !== currentRange.min ||
                    prevRange.max !== currentRange.max;

                if (hasChanged) {
                    prevRangeRef.current = currentRange;

                    if (!isZoomingRef.current) {
                        isZoomingRef.current = true;
                        setZoomChanged(true);
                    }

                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }

                    debounceTimerRef.current = setTimeout(() => {
                        isZoomingRef.current = false;
                        setZoomChanged(false);
                    }, 200);
                }
            }

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [chart]);

    useEffect(() => {
        if (!isChartReady) {
            const canvas = overlayCanvasRef.current?.getBoundingClientRect();
            const ctx = overlayCanvasRef.current?.getContext('2d');

            if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [isChartReady]);

    return (
        <>
            <LineComponent
                key='lines'
                lines={combinedData}
                localChartReady={localChartReady}
                setLocalChartReady={setLocalChartReady}
            />
            {localChartReady && (
                <LabelComponent
                    key='labels'
                    lines={combinedData}
                    overlayCanvasRef={overlayCanvasRef}
                    zoomChanged={zoomChanged}
                    canvasSize={canvasSize}
                />
            )}
        </>
    );
}
