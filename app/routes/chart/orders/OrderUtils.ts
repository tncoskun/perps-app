import type { IOrderLineAdapter, OrderTemplate } from "public/tradingview/charting_library/charting_library";

interface OrderLine {
  setPrice: (price: number) => void;
  setText: (text: string) => void;
  setTooltip: (tooltip: string) => any;
  onMove: (callback: () => void) => void;
  onModify: (tooltip: string, callback: (text: string) => void) => void;
  onCancel: (tooltip: string, callback: (text: string) => void) => void;
  getPrice: () => number;
}

export const addOrderLine = (
  chart: any,
  price: number,
  quantity: number,
  text = "Bekleyen Emir"
) => {
  if (!chart) return;

  const orderLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;
  orderLine
    .setText(`${text}: ${price.toFixed(2)}`)
    .setPrice(price)
    .setQuantity("1")
    .setLineStyle(2)
    .setLineColor("#4285F4")
    .setBodyBackgroundColor("#4285F4")
    .setBodyTextColor("#FFFFFF")
    .setQuantityBorderColor("#4285F4")
    .setCancelTooltip("Cancel order")
    .setExtendLeft(true)
    .setEditable(true)
    .onMove(function (this: OrderLine) {
      
      const newPrice = this.getPrice();
      this.setText(`${text}: ${newPrice.toFixed(2)}`);
    })
    .onMoving(function (this: OrderLine) {
      const newPrice = this.getPrice();
      this.setText(`${text}: ${newPrice.toFixed(2)}`);
    })
    .onModify(function (this: OrderLine) {
      const newPrice = this.getPrice();
      this.setText(`${text}: ${newPrice.toFixed(2)}`);
    })
    // .setLineLength(0,"percentage")
    ;

  return orderLine;
};
