import { useEffect } from "react";
import { useTradingView } from "~/contexts/TradingviewContext";
import { addPositionLine } from "./PositionLineUtils";

const PositionLine = () => {
  const { chart } = useTradingView();

  const addPosition =
    (/* price: number, quantity: number, text?: string */) => {
      if (chart) addPositionLine(chart);
    };

  useEffect(() => {
    if (chart) {
      addPosition();
    }
  }, [chart]);

  return null;
};

export default PositionLine;
