import LiqComponent from '../../liquidity/LiqComponent';
import OverlayCanvasLayer from '../OverlayCanvasLayer';
import { useAppStateStore } from '~/stores/AppStateStore';

const LiquidationOverlayCanvas: React.FC = () => {
    const { liquidationsActive } = useAppStateStore();

    return (
        liquidationsActive && (
            <OverlayCanvasLayer id='liquidation-overlay' zIndex={1}>
                {({ canvasRef, canvasSize, scaleData, mousePositionRef }) => (
                    <LiqComponent
                        overlayCanvasRef={canvasRef}
                        canvasSize={canvasSize}
                        scaleData={scaleData}
                        overlayCanvasMousePositionRef={mousePositionRef}
                    />
                )}
            </OverlayCanvasLayer>
        )
    );
};

export default LiquidationOverlayCanvas;
