import { useEffect } from "react";
import { useTradingView } from "~/contexts/TradingviewContext";
import { addOrderLine } from "./OrderUtils";

const PendingOrders = () => {
  const { chart } = useTradingView();

  const addOrder = async (price: number, quantity: number, text?: string) => {
    if (chart) return addOrderLine(chart, price, quantity, text);
  };

  useEffect(() => {
    addOrder(99000, 5.3, "Limit"); /* .then(
      (res: IOrderLineAdapter | undefined) => {}
    ); */
  }, [chart]);

  return null;
};

export default PendingOrders;
