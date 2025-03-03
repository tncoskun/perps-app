import React from "react";
import { TradingViewProvider } from "~/contexts/TradingviewContext";
import TradingViewChart from "~/routes/chart/chart";
import CustomOrderLine from "~/routes/chart/orders/customOrderLine";
import PendingOrders from "~/routes/chart/orders/PendingOrders";
import PositionLine from "~/routes/chart/orders/positionLine";
// import PositionLine from "~/routes/chart/orders/positionLine";

const TradingViewWrapper: React.FC = () => {
  return (
    <TradingViewProvider>
      <TradingViewChart />
      {/* <PendingOrders /> */}
      {/* <PositionLine/> */}
      <CustomOrderLine/>
    </TradingViewProvider>
  );
};

export default TradingViewWrapper;
