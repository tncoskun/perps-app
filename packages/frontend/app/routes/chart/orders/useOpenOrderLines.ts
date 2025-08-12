import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import {
    quantityTextFormatWithComma,
    type LineLabel,
} from './customOrderLineUtils';
import type { LineData } from './component/LineComponent';
import { useAppSettings } from '~/stores/AppSettingsStore';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';

export const useOpenOrderLines = (): LineData[] => {
    const { bsColor, getBsColor } = useAppSettings();
    const { chart } = useTradingView();
    const { userSymbolOrders, positions, symbol } = useTradeDataStore();
    const { debugWallet } = useDebugStore();

    const [lines, setLines] = useState<LineData[]>([]);

    const pnlSzi = useMemo(() => {
        const data = positions
            .filter((i) => i.coin === symbol)
            .map((i) => ({
                price: i.entryPx,
                pnl: i.unrealizedPnl,
                szi: i.szi,
                liqPrice: i.liquidationPx,
            }));

        return data.length > 0 ? data[0].szi : undefined;
    }, [JSON.stringify(positions), symbol]);

    const mockData: OrderDataIF[] = [
        {
            coin: 'ETH',
            cloid: 'null',
            oid: 131242508541,
            side: 'sell',
            sz: 0.0012,
            tif: 'null',
            timestamp: 1754919740786,
            status: 'open',
            limitPx: 4842.6,
            origSz: 0,
            reduceOnly: true,
            isPositionTpsl: true,
            isTrigger: true,
            triggerPx: 5263.7,
            triggerCondition: 'Price above 5263.7',
            orderType: 'Take Profit Market',
            orderValue: 0,
        },
        {
            coin: 'ETH',
            cloid: 'null',
            oid: 131275120794,
            side: 'sell',
            sz: 0.0025,
            tif: 'null',
            timestamp: 1754922351348,
            status: 'open',
            limitPx: 4600,
            origSz: 0.0025,
            reduceOnly: true,
            isPositionTpsl: false,
            isTrigger: true,
            triggerPx: 5000,
            triggerCondition: 'Price above 5000',
            orderType: 'Take Profit Market',
            orderValue: 11.5,
        },
        {
            coin: 'ETH',
            cloid: 'null',
            oid: 131275120793,
            side: 'sell',
            sz: 0.0025,
            tif: 'null',
            timestamp: 1754922351348,
            status: 'open',
            limitPx: 1840,
            origSz: 0.0025,
            reduceOnly: true,
            isPositionTpsl: false,
            isTrigger: true,
            triggerPx: 2000,
            triggerCondition: 'Price below 2000',
            orderType: 'Stop Market',
            orderValue: 4.6000000000000005,
        },
    ];
    useEffect(() => {
        const ordersToUse =
            debugWallet.label === 'mockData'
                ? [...userSymbolOrders, ...mockData]
                : userSymbolOrders;

        if (!chart || !ordersToUse?.length) {
            setLines([]);
            return;
        }

        const newLines: LineData[] = ordersToUse
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((order): LineData => {
                const {
                    sz,
                    side,
                    orderType,
                    limitPx,
                    triggerPx,
                    triggerCondition,
                    oid,
                } = order;

                const color =
                    side === 'buy' ? getBsColor().buy : getBsColor().sell;
                const xLoc = 0.4;
                const tempTriggerCondition =
                    triggerCondition && triggerCondition !== 'N/A'
                        ? triggerCondition
                        : '';

                let yPrice = limitPx;
                let quantityTextValue = sz;
                let label: LineLabel = {
                    type: 'Limit',
                    price: limitPx,
                    triggerCondition: tempTriggerCondition,
                };
                const type = 'LIMIT';

                if (orderType === 'Limit') {
                    label = {
                        type: 'Limit',
                        price: limitPx,
                        triggerCondition: tempTriggerCondition,
                    };
                } else {
                    if (orderType === 'Stop Limit') {
                        label = {
                            type: 'Stop Limit',
                            price: quantityTextFormatWithComma(limitPx),
                            triggerCondition: tempTriggerCondition,
                            orderType,
                        };
                    }
                    if (
                        orderType === 'Take Profit Market' ||
                        orderType === 'Stop Market'
                    ) {
                        label = {
                            type: orderType,
                            triggerCondition: tempTriggerCondition,
                            orderType,
                        };
                    }

                    if (triggerPx) {
                        yPrice = triggerPx;
                    }
                    quantityTextValue = sz ?? pnlSzi ?? 0;
                }

                return {
                    xLoc,
                    yPrice,
                    textValue: label,
                    quantityTextValue,
                    color,
                    type,
                    oid,
                    lineStyle: 3,
                    lineWidth: 1,
                    side: side,
                };
            });

        setLines(newLines.filter((i) => i.yPrice > 0));
    }, [
        chart,
        JSON.stringify(userSymbolOrders),
        debugWallet,
        symbol,
        JSON.stringify(pnlSzi),
        bsColor,
    ]);

    return lines;
};
