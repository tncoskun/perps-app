import React, { useEffect, useRef } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import * as d3 from 'd3';
import {
    canvasSizeRef,
    mousePositionRef,
    scaleDataRef,
} from './OrdersOverlayCanvas/sharedOverlayState';

interface OverlayCanvasLayerProps {
    id: string;
    zIndex?: number;
    pointerEvents?: 'none' | 'auto';
    children: (props: {
        canvasRef: React.RefObject<HTMLCanvasElement>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvasSize: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scaleData: any;
        mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
    }) => React.ReactNode;
}

const OverlayCanvasLayer: React.FC<OverlayCanvasLayerProps> = ({
    id,
    zIndex = 0,
    pointerEvents = 'none',
    children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { chart } = useTradingView();

    useEffect(() => {
        if (!chart) return;

        const isFirstInit = !scaleDataRef.current;

        if (isFirstInit) {
            const yScale = d3.scaleLinear();
            const xScale = d3.scaleTime();
            const scaleSymlog = d3.scaleSymlog();
            scaleDataRef.current = { yScale, xScale, scaleSymlog };
        }

        const yScale = scaleDataRef.current!.yScale;
        const xScale = scaleDataRef.current!.xScale;
        const scaleSymlog = scaleDataRef.current!.scaleSymlog;

        const chartDiv = document.getElementById('tv_chart');
        const iframe = chartDiv?.querySelector('iframe') as HTMLIFrameElement;
        const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;
        if (!iframeDoc) return;

        const paneCanvas = iframeDoc.querySelector(
            'canvas[data-name="pane-canvas"]',
        ) as HTMLCanvasElement;
        if (!paneCanvas || !paneCanvas.parentNode) return;

        if (!canvasRef.current) {
            const newCanvas = iframeDoc.createElement('canvas');
            newCanvas.id = id;
            newCanvas.style.position = 'absolute';
            newCanvas.style.top = '0';
            newCanvas.style.left = '0';
            newCanvas.style.pointerEvents = pointerEvents;
            newCanvas.style.zIndex = zIndex.toString();
            newCanvas.width = paneCanvas.width;
            newCanvas.height = paneCanvas.height;
            paneCanvas.parentNode.appendChild(newCanvas);
            canvasRef.current = newCanvas;
        }

        const canvas = canvasRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            mousePositionRef.current = { x: offsetX, y: offsetY };
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        const updateCanvasSize = () => {
            const width = paneCanvas.width;
            const height = paneCanvas.height;
            canvas.width = width;
            canvas.height = height;

            yScale.range([height, 0]);
            xScale.range([0, width]);
            scaleSymlog.range([height, 0]);

            canvasSizeRef.current = {
                styleWidth: paneCanvas.style.width,
                styleHeight: paneCanvas.style.height,
                width,
                height,
            };
        };

        updateCanvasSize();

        const observer = new ResizeObserver(() => {
            updateCanvasSize();
        });

        observer.observe(paneCanvas);

        return () => {
            observer.disconnect();
            if (canvas && canvas.parentNode) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.parentNode.removeChild(canvas);
            }
            canvasRef.current = null;
        };
    }, [chart]);

    return (
        <>
            {children({
                canvasRef,
                canvasSize: canvasSizeRef.current,
                scaleData: scaleDataRef.current,
                mousePositionRef,
            })}
        </>
    );
};

export default OverlayCanvasLayer;
