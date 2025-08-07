import { useEffect } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { getFilteredCandle } from '../data/candleDataCache';
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
    const { chart, isChartReady } = useTradingView();

    useEffect(() => {
        let animationFrameId: number;

        const drawLoop = () => {
            if (chart && scaleData && overlayCanvasRef.current) {
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

                            console.log({ width, height });

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

                const res = getFilteredCandle('BTC', '1D', from, to);
                const timeScale = chart.activeChart().getTimeScale();
                const candleWidth = timeScale.barSpacing();
                console.log({ timeScale, candleWidth });

                res.forEach((element) => {
                    const high = scaleData.yScale(
                        element.close,
                    ); /* getPricetoPixel(chart, element.close).pixel; */
                    const low = scaleData.yScale(
                        element.open,
                    ); /* getPricetoPixel(chart, element.open).pixel; */

                    // const pixel = timeScale.coordinateToTime(658);

                    // console.log(new Date(((timeScale.coordinateToTime(6) || 0) *1000)),scaleData.xScale.invert(6));

                    if (!overlayCanvasRef.current) return;
                    const ctx = overlayCanvasRef.current.getContext('2d');
                    if (!ctx) return;

                    const max = Math.max(low, high);

                    const min = Math.min(low, high);

                    const x = scaleData.xScale(element.time /* .toString() */);
                    // console.log({x});

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
    }, [chart, scaleData?.yScale.domain(), isChartReady]);

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

        // ctx.clearRect(x - candleWidth / 2, 10, 1000, 500);
        ctx.clearRect(x - candleWidth / 2, min, candleWidth, height);
        // ctx.stroke();

        // ctx.clearRect(100, 10, 1000, 500);
    };

    // const clipCanvas = (
    //     low: number,
    //     high: number,
    //     canvas: HTMLCanvasElement,
    // ) => {
    //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //     console.log({ ctx });

    //     const height = low - high;
    //     ctx.save();
    //     ctx.beginPath();
    //     // ctx.rect(10, 10, 100, 100);
    //     ctx.rect(low, high, 10, height);
    //     ctx.clip();
    //     ctx.globalAlpha = 0.5;
    //     ctx.fillStyle = 'red';
    //     ctx.fillRect(0 /* paneCanvas.width-100 */, 0, canvas.width, canvas.height);
    //     // ctx.stroke();
    // };

    // useEffect(() => {
    //     if (chart && isChartReady) {
    //         const chartDiv = document.getElementById('tv_chart');
    //         const iframe = chartDiv?.querySelector(
    //             'iframe',
    //         ) as HTMLIFrameElement;

    //         const iframeDoc = iframe?.contentDocument;

    //         if (iframeDoc && overlayCanvasRef?.current) {
    //             const paneCanvas = iframeDoc.querySelector(
    //                 'canvas[data-name="pane-canvas"]',
    //             ) as HTMLCanvasElement;

    //             const paneCanvasTop = iframeDoc.querySelector(
    //                 'canvas[data-name="pane-top-canvas"]',
    //             ) as HTMLCanvasElement;

    //             if (paneCanvas && paneCanvasTop) {
    //                 const width = overlayCanvasRef.current.style.width;
    //                 const height = overlayCanvasRef.current.style.height;
    //                 // paneCanvas.style.background = 'transparent !important';

    //                 if (
    //                     width !== canvasSize?.styleWidth ||
    //                     height !== canvasSize?.styleWidth
    //                 ) {
    //                     overlayCanvasRef.current.style.width = `${canvasSize?.styleWidth}px`;
    //                     overlayCanvasRef.current.style.height = `${canvasSize?.styleHeight}px`;
    //                     overlayCanvasRef.current.width = paneCanvas.width;
    //                     overlayCanvasRef.current.height = paneCanvas.height;
    //                 }

    //                 const overlayCtx =
    //                     overlayCanvasRef.current.getContext('2d');
    //                 // const paneCtx = paneCanvas.getContext('2d');
    //                 // const paneCanvasTopCtx = paneCanvas.getContext('2d');
    //                 if (overlayCtx /* &&  paneCtx && paneCanvasTopCtx */) {
    //                     overlayCtx.globalAlpha = 0.5;
    //                     overlayCtx.fillStyle = 'purple';
    //                     overlayCtx.fillRect(
    //                         0 /* paneCanvas.width-100 */,
    //                         0,
    //                         paneCanvas.width,
    //                         paneCanvas.height,
    //                     );
    //                 }
    //             }
    //         }
    //     }
    // }, [chart, isChartReady]);

    return null;
};

export default LiqComponent;
