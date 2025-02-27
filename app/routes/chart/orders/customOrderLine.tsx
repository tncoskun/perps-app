import { useEffect } from "react";
import { useTradingView } from "~/contexts/TradingviewContext";
import { addCustomOrderLine } from "./CustomOrderUtils";

const CustomOrderLine = () => {
  const { chart } = useTradingView();

  const addOrderLine =
    (/* price: number, quantity: number, text?: string */) => {
      if (chart) addCustomOrderLine(chart);
    };

  useEffect(() => {
    if (chart) {
      addOrderLine();
    }
  }, [chart]);

  return null;
};

export default CustomOrderLine;
