import { useEffect, useRef } from "react";
import { dataFeed } from "./data/dataFeed";
import {
  widget,
  type ResolutionString,
} from "../../../public/tradingview/charting_library";

export interface ChartContainerProps {
  symbolName:string,
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

  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbolName:"SOLANA",
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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const tvWidget = new widget({
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath,
      timezone: "Etc/UTC",
      symbol:defaultProps.symbolName,
      fullscreen: false,
      autosize: true,
      datafeed: dataFeed as any,
      interval: defaultProps.interval,
      locale: "en",
      
      theme: "dark",
      overrides: {
        "paneProperties.background": "#0e0e14",
        "paneProperties.backgroundType": "solid",
      },
      custom_css_url: "./../tradingview-chart-custom.css",
      loading_screen: { backgroundColor: "#0e0e14" },
    });

    return () => {
      if (tvWidget) {
        tvWidget.remove();
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default TradingViewChart;
