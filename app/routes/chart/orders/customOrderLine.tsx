import { useEffect, useState } from "react";
import { useTradingView } from "~/contexts/TradingviewContext";
import { addCustomOrderLine } from "./CustomOrderUtils";

const CustomOrderLine = () => {
  const { chart } = useTradingView();

  const price = 98997;
  const [linePrice, setLinePrice] = useState(price);
  const addOrderLine =
    (/* price: number, quantity: number, text?: string */) => {
      if (chart) return addCustomOrderLine(chart, price);
    };

  useEffect(() => {
    if (chart) {
      const orderLinePromise = addOrderLine();

      chart.subscribe("drawing_event", (id: any, type: any) => {
        orderLinePromise?.then((orderLine) => {
          console.log({ id, orderLine });

          if (id === orderLine) {
            const activeShape = chart.activeChart().getShapeById(id);
            console.log(activeShape);

            const points = activeShape.getPoints();

            if (activeShape && points) {
              const newPrice = points[0].price;

              setLinePrice(newPrice);
              console.log("Yeni fiyat:", points, newPrice);
            }
          }
        });
      });
    }
  }, [chart, price]);

  return null;
};

export default CustomOrderLine;
