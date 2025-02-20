import type { CrocEnv } from "@crocswap-libs/sdk";
import { fetchTokenPrice } from "./api/fetchTokenPrice";
import { querySpotPrice } from "./dataLayer/functions/querySpotPrice";
import { fetchCandles } from "./fetchCandle";

const dataCache = new Map<string, any[]>();

export function resolutionToSeconds(resolution: string): number {
  if (resolution === "1D") return 86400;
  if (resolution === "W") return 604800;
  if (resolution === "M") return 2592000;

  return Number(resolution);
}

export async function getHistoricalData(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
  crocEnv: CrocEnv
) {
  const key = `${symbol}-${resolution}`;

  let cachedData = dataCache.get(key) || [];
  const hasDataForRange = cachedData.some(
    (bar) => bar.time >= from * 1000 && bar.time <= to * 1000
  );

  if (hasDataForRange) {
    return cachedData.filter(
      (bar) => bar.time >= from * 1000 && bar.time <= to * 1000
    );
  }

  const period = resolutionToSeconds(resolution);
  
  let mergedData = undefined;
  const nCandles = Math.floor((to - from) / period) - 1;
  const endTime = to;

  return fetchCandles(
    endTime,
    period,
    nCandles > 2999 ? 2999 : nCandles,
    crocEnv,
    fetchTokenPrice,
    querySpotPrice
  ).then((res: any) => {
    if (res) {
      const formattedData = (res as any).candles.map((item: any) => ({
        time: item.time * 1000,
        open: item.invPriceOpenDecimalCorrected,
        high: item.invMaxPriceDecimalCorrected,
        low: item.invMinPriceDecimalCorrected,
        close: item.invPriceCloseDecimalCorrected,
        volume: item.volumeUSD,
      }));

      mergedData = [...cachedData, ...formattedData].sort(
        (a, b) => a.time - b.time
      );
      dataCache.set(key, mergedData);

      return mergedData.filter(
        (bar) => bar.time >= from * 1000 && bar.time <= to * 1000
      );
    }
  });
}
