import { fetchCandleSeriesHybrid } from "./api/fetchCandleSeries";
import { GCGO_ETHEREUM_URL } from "./constants/gcgo";

const chainId = "0x1";
const poolIndex = 420;
const period = 86400;
const baseTokenAddress = "0x0000000000000000000000000000000000000000";
const quoteTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const fetchCandles = async (
  candleTime: number,
  resolution:number,
  nCandles: number,
  crocEnv: any,
  cachedFetchTokenPrice: any,
  cachedQuerySpotPrice: any
) => {
  let candles = undefined;
  await fetchCandleSeriesHybrid(
    chainId,
    poolIndex,
    GCGO_ETHEREUM_URL,
    resolution,
    baseTokenAddress,
    quoteTokenAddress,
    candleTime,
    nCandles,
    crocEnv,
    cachedFetchTokenPrice,
    cachedQuerySpotPrice
  ).then((res) => {
    candles = res;
  });

  return candles;
};
