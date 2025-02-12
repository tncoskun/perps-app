// src/data/dataFeed.ts
import type {
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
} from "public/tradingview/charting_library/charting_library";
import { getLast7DaysData } from "./chartData";

const priceData = getLast7DaysData();

export const dataFeed: IDatafeedChartApi = {
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
      supported_resolutions: [
        "1",
        "5",
        "15",
        "30",
        "60",
        "D",
      ] as ResolutionString[],
      description: "",
      type: "",
      exchange: "",
      listed_exchange: "",
      format: "volume",
    };
    onResolve(symbolInfo);
  },

  getBars: (symbolInfo, resolution, periodParams, onResult, onError) => {
    const { from, to } = periodParams;

    const bars = priceData
      .map((item) => ({
        time: item.time * 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }))
      .filter((i) => i.time > from * 1000 && i.time < to * 1000);

    onResult(bars, { noData: false });
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onTick,
    listenerGuid,
    onResetCacheNeededCallback
  ) => {
    const interval = setInterval(() => {
      const price = Math.random() * 100 + 100;
      onTick({
        time: Date.now(),
        open: price,
        high: price + 5,
        low: price - 5,
        close: price,
        volume: Math.floor(Math.random() * 1000),
      });
    }, 1000);
    (window as any)[listenerGuid] = interval;
  },

  unsubscribeBars: (listenerGuid) => {
    clearInterval((window as any)[listenerGuid]);
    delete (window as any)[listenerGuid];
  },
} as IDatafeedChartApi;
