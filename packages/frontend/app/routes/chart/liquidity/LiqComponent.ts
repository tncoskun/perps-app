import { useEffect } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { getFilteredCandle } from '../data/candleDataCache';
import { useTradeDataStore } from '~/stores/TradeDataStore';
/* import type {
    IChartingLibraryWidget,
    IChartWidgetApi,
} from '~/tv/charting_library'; */

interface LabelProps {
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasSize: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleData: any;
    overlayCanvasMousePositionRef: React.MutableRefObject<{
        x: number;
        y: number;
    }>;
}

const LiqComponent = ({
    overlayCanvasRef,
    canvasSize,
    scaleData,
}: LabelProps) => {
    const { chart, isChartReady, chartInterval } = useTradingView();

    const { symbol } = useTradeDataStore();

    useEffect(() => {
        let animationFrameId: number;

        const drawLoop = () => {
            if (
                chart &&
                scaleData &&
                overlayCanvasRef.current &&
                chartInterval
            ) {
                const { from, to } = chart.activeChart().getVisibleRange();
                scaleData?.xScale.domain([from * 1000, to * 1000]);

                const overlayCtx = overlayCanvasRef.current.getContext('2d');
                if (overlayCtx) {
                    if (overlayCanvasRef.current) {
                        const chartDiv = document.getElementById('tv_chart');
                        const iframe = chartDiv?.querySelector(
                            'iframe',
                        ) as HTMLIFrameElement;
                        const iframeDoc =
                            iframe?.contentDocument ||
                            iframe?.contentWindow?.document;

                        if (iframeDoc) {
                            const paneCanvas = iframeDoc.querySelector(
                                'canvas[data-name="pane-canvas"]',
                            ) as HTMLCanvasElement;
                            const width = overlayCanvasRef.current.style.width;
                            const height =
                                overlayCanvasRef.current.style?.height;

                            if (
                                width !== canvasSize?.styleWidth ||
                                height !== canvasSize?.styleWidth
                            ) {
                                overlayCanvasRef.current.style.width = `${canvasSize?.styleWidth}px`;
                                overlayCanvasRef.current.style.height = `${canvasSize?.styleHeight}px`;
                                overlayCanvasRef.current.width =
                                    paneCanvas.width;
                                overlayCanvasRef.current.height =
                                    paneCanvas.height;
                            }
                        }
                    }

                    overlayCtx.globalAlpha = 0.5;
                    overlayCtx.clearRect(
                        0,
                        0,
                        overlayCanvasRef.current.width,
                        overlayCanvasRef.current.height,
                    );
                    overlayCtx.fillStyle = 'pink';
                    overlayCtx.fillRect(
                        0,
                        0,
                        overlayCanvasRef.current.width,
                        overlayCanvasRef.current.height,
                    );
                }

                const res = getFilteredCandle(symbol, chartInterval, from, to);
                const timeScale = chart.activeChart().getTimeScale();
                const dpr = window.devicePixelRatio || 1;

                const candleWidth = timeScale.barSpacing() / dpr;

                console.log({ candleWidth, timeScale });

                res.forEach((element) => {
                    const high = scaleData.yScale(element.close) / dpr;
                    const low = scaleData.yScale(element.open) / dpr;

                    if (!overlayCanvasRef.current) return;
                    const ctx = overlayCanvasRef.current.getContext('2d');
                    if (!ctx) return;

                    const max = Math.max(low, high);

                    const min = Math.min(low, high);

                    const x = scaleData.xScale(element.time) / dpr;

                    eraseCanvasRegion(
                        min,
                        max,
                        x,
                        candleWidth,
                        overlayCanvasRef.current,
                    );
                });
            }

            animationFrameId = requestAnimationFrame(drawLoop);
        };

        animationFrameId = requestAnimationFrame(drawLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [
        chart,
        scaleData?.xScale.domain(),
        scaleData?.yScale.domain(),
        isChartReady,
        symbol,
        chartInterval,
    ]);

    const eraseCanvasRegion = (
        low: number,
        high: number,
        x: number,
        candleWidth: number,
        canvas: HTMLCanvasElement,
    ) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const height = Math.abs(high - low);

        const min = Math.min(low, high);

        ctx.clearRect(x - candleWidth / 2, min, candleWidth, height);
    };

    return null;
};

export default LiqComponent;
