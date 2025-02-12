import React, { useEffect, useRef } from "react";
import {
  widget,
  type ChartingLibraryWidgetOptions,
  type ResolutionString,
} from "../../../public/tradingview/charting_library";

export interface ChartContainerProps {
  symbol: string;
  interval: ResolutionString;
  datafeedUrl: string;
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

const Chart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbol: "AAPL",
    interval: "D" as ResolutionString,
    datafeedUrl: "https://demo_feed.tradingview.com",
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
    if (chartContainerRef.current) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: defaultProps.symbol,
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
          defaultProps.datafeedUrl
        ),
        interval: defaultProps.interval,
        container: chartContainerRef.current,
        library_path: defaultProps.libraryPath,
        locale: "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: defaultProps.chartsStorageUrl,
        charts_storage_api_version: "1.1",
        client_id: defaultProps.clientId,
        user_id: defaultProps.userId,
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        studies_overrides: defaultProps.studiesOverrides,
        theme: "dark",
        overrides: {
          "paneProperties.background": "#0e0e14",
          "paneProperties.backgroundType": "solid",
        },
        custom_css_url: "./../tradingview-chart-custom.css",
        loading_screen: { backgroundColor: "#0e0e14" },
      };

      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        // tvWidget.headerReady().then(() => {
        //**
        // we can add button vs in header
        //  */
      });

      return () => {
        if (tvWidget) {
          tvWidget.remove();
        }
      };
    }
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default Chart;
