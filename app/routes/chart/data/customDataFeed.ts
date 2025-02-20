import type {
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
} from "public/tradingview/charting_library/charting_library";
import type { CrocEnv } from "@crocswap-libs/sdk";

import { getHistoricalData, resolutionToSeconds } from "./dataCache";

export const findSnapTime = (timeSeconds: number, period: number) => {
  const snapDiff = timeSeconds % (period * 1000);

  const snappedTime = timeSeconds - snapDiff * 1000;
  return snappedTime;
};

export const createDataFeed = (crocEnv: CrocEnv): IDatafeedChartApi =>
  ({
    searchSymbols: (userInput: string, exchange, symbolType, onResult) => {
      onResult([
        {
          symbol: userInput,
          description: "Sample Symbol",
          exchange: exchange,
          type: symbolType,
        },
      ]);
    },

    onReady: (cb: any) =>
      setTimeout(() => cb({ supported_resolutions: ["1D"] }), 0),

    resolveSymbol: (symbolName, onResolve, onError) => {
      const symbolInfo: LibrarySymbolInfo = {
        ticker: symbolName,
        name: symbolName,
        minmov: 1,
        pricescale: 100,
        timezone: "Etc/UTC",
        session: "24x7",
        has_intraday: true,
        /*      supported_resolutions: [
          "1",
          "5",
          "15",
          "60",
          "240",
          "D",
        ] as ResolutionString[], */
        description: "",
        type: "",
        exchange: "",
        listed_exchange: "",
        format: "volume",
      };
      onResolve(symbolInfo);
    },

    getBars: async (
      symbolInfo,
      resolution,
      periodParams,
      onResult,
      onError
    ) => {
      /**
       * for fetching historical data
       */
      const { from, to } = periodParams;

      const symbol = symbolInfo.ticker;

      if (symbol) {
        try {
          const bars = await getHistoricalData(
            symbol,
            resolution,
            from,
            to,
            crocEnv
          );

          bars && onResult(bars, { noData: bars.length === 0 });
        } catch (error) {
          console.error("Error loading historical data:", error);
        }
      }
    },

    subscribeBars: (
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback
    ) => {
      /**
       * for live candles
       */

      const interval = setInterval(() => {
        const price = Math.random() * 1000 + 100;
        onTick({
          time: Date.now(),
          open: price,
          high: price + 5,
          low: price - 5,
          close: price,
          volume: Math.floor(Math.random() * 1000),
        });
      }, 1000);

      // const interval = setInterval(async () => {
      //   const symbol = symbolInfo.ticker;

      //   if (symbol) {
      //     const period = resolutionToSeconds(resolution);
      //     const to = Math.floor(Date.now() / 1000);
      //     const from = to - period * 5;

      //     const bars = await getHistoricalData(
      //       symbol,
      //       resolution,
      //       from,
      //       to,
      //       crocEnv
      //     );

      //     if (bars) {
      //       bars.sort((a, b) => b.time - a.time);

      //       onTick({
      //         time: bars[0].time,
      //         open: bars[0].invPriceOpenDecimalCorrected,
      //         high: bars[0].invMaxPriceDecimalCorrected,
      //         low: bars[0].invMinPriceDecimalCorrected,
      //         close: bars[0].invPriceCloseDecimalCorrected,
      //         volume: bars[0].volumeUSD,
      //       });
      //     }
      //   }
      // }, 1000);
      (window as any)[listenerGuid] = interval;
    },

    unsubscribeBars: (listenerGuid) => {
      clearInterval((window as any)[listenerGuid]);
      delete (window as any)[listenerGuid];
    },
  } as IDatafeedChartApi);
