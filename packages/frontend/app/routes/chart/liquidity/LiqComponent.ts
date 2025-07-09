/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3fc from 'd3fc';
import { scale } from 'framer-motion';
import { useEffect } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';

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
        if (chart && isChartReady) {
            const chartDiv = document.getElementById('tv_chart');
            const iframe = chartDiv?.querySelector(
                'iframe',
            ) as HTMLIFrameElement;

            const iframeDoc = iframe?.contentDocument;

            if (iframeDoc && overlayCanvasRef?.current) {
                const paneCanvas = iframeDoc.querySelector(
                    'canvas[data-name="pane-canvas"]',
                ) as HTMLCanvasElement;

                const paneCanvasTop = iframeDoc.querySelector(
                    'canvas[data-name="pane-top-canvas"]',
                ) as HTMLCanvasElement;

                if (paneCanvas && paneCanvasTop) {
                    const width = overlayCanvasRef.current.style.width;
                    const height = overlayCanvasRef.current.style.height;
                    // paneCanvas.style.background = 'transparent !important';

                    if (
                        width !== canvasSize?.styleWidth ||
                        height !== canvasSize?.styleWidth
                    ) {
                        overlayCanvasRef.current.style.width = `${canvasSize?.styleWidth}px`;
                        overlayCanvasRef.current.style.height = `${canvasSize?.styleHeight}px`;
                        overlayCanvasRef.current.width = paneCanvas.width;
                        overlayCanvasRef.current.height = paneCanvas.height;
                    }

                    const overlayCtx =
                        overlayCanvasRef.current.getContext('2d');
                    // const paneCtx = paneCanvas.getContext('2d');
                    // const paneCanvasTopCtx = paneCanvas.getContext('2d');
                    if (overlayCtx /* &&  paneCtx && paneCanvasTopCtx */) {
                        overlayCtx.fillStyle = 'red';
                        overlayCtx.fillRect(0, 0, 100, 100);
                    }
                }
            }
        }
    }, [chart, isChartReady]);

    // const ctx = overlayCanvasRef.current?.getContext('2d');

    //     useEffect(() => {
    //         let animationFrameId: number;

    //         const animate = () => {
    //             if (chart && isChartReady) {
    //                 const chartDiv = document.getElementById('tv_chart');
    //                 const iframe = chartDiv?.querySelector(
    //                     'iframe',
    //                 ) as HTMLIFrameElement;

    //                 const iframeDoc = iframe?.contentDocument;

    //                 if (iframeDoc && overlayCanvasRef?.current) {
    //                     const paneCanvas = iframeDoc.querySelector(
    //                         'canvas[data-name="pane-canvas"]',
    //                     ) as HTMLCanvasElement;

    //                     const paneCanvasTop = iframeDoc.querySelector(
    //                         'canvas[data-name="pane-top-canvas"]',
    //                     ) as HTMLCanvasElement;

    //                     if (paneCanvas && paneCanvasTop) {
    //                         const width = overlayCanvasRef.current.style.width;
    //                         const height = overlayCanvasRef.current.style.height;
    //                         paneCanvas.style.background = 'transparent !important';

    //                         if (
    //                             width !== canvasSize?.styleWidth ||
    //                             height !== canvasSize?.styleWidth
    //                         ) {
    //                             overlayCanvasRef.current.style.width = `${canvasSize?.styleWidth}px`;
    //                             overlayCanvasRef.current.style.height = `${canvasSize?.styleHeight}px`;
    //                             overlayCanvasRef.current.width = paneCanvas.width;
    //                             overlayCanvasRef.current.height = paneCanvas.height;
    //                         }

    //                         const overlayCtx =
    //                             overlayCanvasRef.current.getContext('2d');
    //                         const paneCtx = paneCanvas.getContext('2d');
    //                         const paneCanvasTopCtx = paneCanvas.getContext('2d');
    //                         if (overlayCtx && paneCtx && paneCanvasTopCtx) {
    //                             const originalFill = paneCtx.fillStyle;
    //                             const originalFillTop = paneCanvasTopCtx.fillStyle;

    //                             console.log({ originalFill, originalFillTop });

    //                             paneCtx.globalCompositeOperation =
    //                                 'destination-out';
    //                             paneCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    //                             paneCtx.fillRect(
    //                                 0,
    //                                 0,
    //                                 paneCanvas.width,
    //                                 paneCanvas.height,
    //                             );
    //                             paneCtx.fillStyle = 'rgba(0, 0, 0, 0)';

    //                             paneCtx.globalCompositeOperation = 'source-over';
    //                             overlayCtx.fillStyle = 'red';
    //                             overlayCtx.fillRect(0, 0, 100, 100);

    //                             // paneCanvasTopCtx.fillStyle = 'pink'; // 'rgba(0, 0, 0, 0)';

    //                             // overlayCtx.fillStyle = 'red';

    //                             // const [bgR, bgG, bgB, bgA] = paneCtx.getImageData(
    //                             //     0,
    //                             //     0,
    //                             //     1,
    //                             //     1,
    //                             // ).data;

    //                             // const data = imageData.data;

    //                             // function isSameColor(
    //                             //     r: number,
    //                             //     g: number,
    //                             //     b: number,
    //                             //     a: number,
    //                             //     tolerance = 5,
    //                             // ) {
    //                             //     return (
    //                             //         Math.abs(r - bgR) <= tolerance &&
    //                             //         Math.abs(g - bgG) <= tolerance &&
    //                             //         Math.abs(b - bgB) <= tolerance &&
    //                             //         Math.abs(a - bgA) <= tolerance
    //                             //     );
    //                             // }
    //                             // overlayCtx.putImageData(imageData, 0, 0);
    //                      /*        paneCtx.clearRect(
    //                                 0,
    //                                 0,
    //                                 100,
    //                                 100, */
    //                      /*        );
    //                             paneCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    //                             paneCtx.fillRect(
    //                                 0,
    //                                 0,
    //                                 paneCanvas.width,
    //                                 paneCanvas.height,
    //                             );

    //                             const imageData = paneCtx.getImageData(
    //                                 0,
    //                                 0,
    //                                 paneCanvas.width,
    //                                 paneCanvas.height,
    //                             );
    //  */
    //                             // console.log({ imageData });

    //                             // console.log('old', JSON.stringify(imageData));

    //                             // for (let i = 0; i < data.length; i += 4) {
    //                             //     const r = data[i];
    //                             //     const g = data[i + 1];
    //                             //     const b = data[i + 2];
    //                             //     const a = data[i + 3];

    //                             //     if (isSameColor(r, g, b, a)) {
    //                             //         console.log({ isSameColor }, r, g, b, a);
    //                             //         overlayCtx.fillStyle = 'transparent';

    //                             //         // overlayCtx.fillRect(0, 0, i, i + 3);

    //                             //         // data[i + 3] = 0;
    //                             //     }
    //                             // }

    //                             // console.log({ imageData });

    //                             // console.log('overlayCtx',overlayCtx.fillStyle);

    //                             // overlayCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    //                             // const [bgR, bgG, bgB, bgA] = paneCtx.getImageData(
    //                             //     0,
    //                             //     0,
    //                             //     1,
    //                             //     1,
    //                             // ).data;

    //                             // console.log({ bgR, bgG, bgB, bgA });

    //                             // paneCtx.fillStyle = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgA / 255})`;
    //                         }
    //                     }
    //                 }
    //             }

    //             animationFrameId = requestAnimationFrame(animate);
    //         };

    //         animationFrameId = requestAnimationFrame(animate);

    //         // Cleanup
    //         return () => cancelAnimationFrame(animationFrameId);
    //     }, [chart, isChartReady, canvasSize?.styleWidth, canvasSize?.styleHeight]);

    // useEffect(() => {
    //     const animate = () => {
    //         if (chart && isChartReady) {
    //             const chartDiv = document.getElementById('tv_chart');
    //             const iframe = chartDiv?.querySelector(
    //                 'iframe',
    //             ) as HTMLIFrameElement;

    //             const iframeDoc = iframe.contentDocument;

    //             if (iframeDoc && overlayCanvasRef && overlayCanvasRef.current) {
    //                 const paneCanvas = iframeDoc.querySelector(
    //                     'canvas[data-name="pane-canvas"]',
    //                 ) as HTMLCanvasElement;
    //                 const width = overlayCanvasRef.current.style.width;
    //                 const height = overlayCanvasRef.current.style?.height;

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
    //                     overlayCanvasRef.current?.getContext('2d');
    //                 const paneCtx = paneCanvas.getContext('2d');

    //                 if (overlayCtx && paneCtx) {
    //                     const imageData = paneCtx.getImageData(
    //                         100,
    //                         100,
    //                         paneCanvas.width,
    //                         paneCanvas.height,
    //                     );
    //                     console.log({ imageData });
    //                     /*         overlayCtx.save();

    //                     overlayCtx.fillStyle = 'red';
    //                     overlayCtx.beginPath();
    //                     overlayCtx.rect(0, 0, 10, 100);
    //                     overlayCtx.fill();
    //                     overlayCtx.restore(); */
    //                     overlayCtx.putImageData(imageData, 0, 0);

    //                     console.log('öhömm');
    //                 }

    //                 /* animationFrameId = */
    //             }
    //         }
    //     };
    //     requestAnimationFrame(animate);
    // }, [chart, scaleData?.yScale?.domain()]);

    // useEffect(() => {
    //     if (!chart || !isChartReady || !ctx) return;

    //     const data = d3.range(50).map((i) => ({
    //         x: i,
    //         y: Math.sin(i * 0.1) + Math.random() * 0.5,
    //     }));

    //     // 2. Eksen skalaları
    //     const xScale = d3.scaleLinear().domain([0, 1000]).nice();

    //     const yScale = d3.scaleLinear().domain([0, 1000]).nice();

    //     const area = d3fc
    //         .seriesCanvasArea()
    //         .orient('horizontal')
    //         .curve(d3.curveBasis)
    //         .decorate((context: CanvasRenderingContext2D) => {
    //             context.fillStyle = 'transparent';
    //         })
    //         .mainValue((d: any) => d.x)
    //         .crossValue((d: any) => d.y)
    //         .xScale(xScale)
    //         .yScale(yScale);
    //     d3.select(overlayCanvasRef.current)
    //         .on('draw', () => {
    //             area(data);
    //             console.log('^drawww');
    //         })
    //         .on('measure', (event: CustomEvent) => {
    //             xScale.range([event.detail.width, 0]);

    //             yScale.range([event.detail.height, 0]);
    //         });

    //     const nd = d3.select(overlayCanvasRef.current).node() as any;
    //     if (nd) nd.requestRedraw();
    // }, [chart, isChartReady, ctx, canvasSize]);

    return null;
};

export default LiqComponent;
