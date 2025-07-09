import React from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
// import OverlayCanvas from '~/routes/chart/overlayCanvas/overlayCanvas';
import OverlayCanvasBackground from '~/routes/chart/overlayCanvas/overlayCanvasBackground';

const TradingViewWrapper: React.FC = () => {
    return (
        <TradingViewProvider>
            <OverlayCanvasBackground />
            <TradingViewChart />
            {/* <OverlayCanvas /> */}
        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
