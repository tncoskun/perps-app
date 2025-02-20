import { useEffect, useRef, useState } from "react";
import {
  widget,
  type IDatafeedChartApi,
  type ResolutionString,
} from "../../../public/tradingview/charting_library";
import { createDataFeed } from "./data/customDataFeed";
import { fetchCandleSeriesCroc } from "./data/fetchCandleData";
import { fetchCandles } from "./data/fetchCandle";
import { fetchTokenPrice } from "./data/api/fetchTokenPrice";
import { querySpotPrice } from "./data/dataLayer/functions/querySpotPrice";
import { CrocEnv } from "@crocswap-libs/sdk";
import { BatchedJsonRpcProvider } from "./utils/batchedProvider";
import { ethereumMainnet } from "./data/constants/networks";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";

export interface ChartContainerProps {
  symbolName: string;
  interval: ResolutionString;
  libraryPath: string;
  chartsStorageUrl: string;
  chartsStorageApiVersion: string;
  clientId: string;
  userId: string;
  fullscreen: boolean;
  autosize: boolean;
  studiesOverrides: any;
  container: string;
}

const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [priceData, setPriceData] = useState<any[]>([]);

  const [crocEnv, setCrocEnv] = useState<CrocEnv | undefined>();
  const chainId = "0x1";

  const { walletProvider } = useWeb3ModalProvider();

  const activeNetwork = ethereumMainnet;

  const [provider, setProvider] = useState<BatchedJsonRpcProvider>(
    new BatchedJsonRpcProvider(activeNetwork.evmRpcUrl, parseInt(chainId), {
      staticNetwork: true,
    })
  );

  const [candleData, setCandleData] = useState();
  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbolName: "ETH/USDC",
    interval: "D" as ResolutionString,
    libraryPath: "/tradingview/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  const [chartScale, setChartScale] = useState({
    from: 0,
    to: 0,
  });

  useEffect(() => {
    (async () => {
      let signer = undefined;
      if (walletProvider) {
        const w3provider = new ethers.BrowserProvider(walletProvider);
        signer = await w3provider.getSigner();
      }
      if (!provider && !signer) {
        setCrocEnv(undefined);
        return;
      } else if (provider) {
        const newCrocEnv = new CrocEnv(provider, signer ? signer : undefined);
        setCrocEnv(newCrocEnv);
      }
    })();
  }, [provider, walletProvider]);

  // useEffect(() => {
  //   const chainId = "0x1";
  //   const poolIndex = 420;
  //   const period = 86400;
  //   const baseTokenAddress = "0x0000000000000000000000000000000000000000";
  //   const quoteTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  //   // const nCandles = 200;
  //   let nCandles = 200;
  //   let endTime = Math.floor(Date.now() / 1000);
  //   const { from, to } = chartScale;

  //   if (from && to) {
  //     nCandles = Math.floor((to - from) / period);
  //     endTime = to;
  //   }

  //   const response = fetchCandles(
  //     endTime,
  //     nCandles,
  //     crocEnv,
  //     fetchTokenPrice,
  //     querySpotPrice
  //   );

  //   response.then((res) => {
  //     res && setCandleData((res as any).candles);
  //     // if (res && (res as any).candles) {
  //     //   const tempData = (res as any).candles.map((item: any) => ({
  //     //     time: item.time * 1000,
  //     //     open: item.invPriceOpenDecimalCorrected,
  //     //     high: item.invMaxPriceDecimalCorrected,
  //     //     low: item.invMinPriceDecimalCorrected,
  //     //     close: item.invPriceCloseDecimalCorrected,
  //     //     volume: item.volumeUSD,
  //     //   }));

  //     //   priceDataCache[symbol] = priceDataCache[symbol]
  //     //     ? [...priceDataCache[symbol], tempData]
  //     //     : tempData;
  //     // }
  //   });
  // }, [crocEnv, chartScale]);

  // useEffect(() => {
  //   const chainId = "0x1";
  //   const poolIndex = 420;
  //   const period = 86400;
  //   const baseTokenAddress = "0x0000000000000000000000000000000000000000";
  //   const quoteTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  //   const nCandles = 201;
  //   const endTime = Math.floor(Date.now() / 1000);

  //   console.log("new Date(endTime)", new Date(endTime * 1000));

  //   fetchCandleSeriesCroc(
  //     chainId,
  //     poolIndex,
  //     period,
  //     baseTokenAddress,
  //     quoteTokenAddress,
  //     endTime,
  //     nCandles
  //   ).then((result) => {
  //     if (result) {
  //       setPriceData(result);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   const nCandles = 201;
  //   const endTime = Math.floor(Date.now() / 1000);

  //   crocEnv &&
  //   fetchCandles(endTime, nCandles, crocEnv, fetchTokenPrice, querySpotPrice);
  // }, [crocEnv]);

  useEffect(() => {
    if (!chartContainerRef.current || !crocEnv) return;

    const tvWidget = new widget({
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath,
      timezone:"Europe/Istanbul", /* "Etc/UTC", */
      symbol: defaultProps.symbolName,
      fullscreen: false,
      autosize: true,
      datafeed: createDataFeed(crocEnv) as any,
      interval: defaultProps.interval,
      locale: "en",
      theme: "dark",
      // overrides: {
      //   "paneProperties.background": "#0e0e14",
      //   "paneProperties.backgroundType": "solid",
      // },
      custom_css_url: "./../tradingview-chart-custom.css",
      loading_screen: { backgroundColor: "#0e0e14" },
      load_last_chart: false,
      time_frames: [
        { text: "1m", resolution: "1" as ResolutionString},   
        { text: "5m", resolution: "5" as ResolutionString},   
        { text: "15m", resolution: "15" as ResolutionString}, 
        { text: "1H", resolution: "60" as ResolutionString},  
        { text: "4H", resolution: "240" as ResolutionString}, 
        { text: "1D", resolution: "1D" as ResolutionString },  

    ],
    });

    return () => {
      if (tvWidget) {
        tvWidget.remove();
      }
    };
  }, [crocEnv]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default TradingViewChart;
