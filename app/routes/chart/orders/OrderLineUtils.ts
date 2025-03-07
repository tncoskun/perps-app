import type { IOrderLineAdapter } from "public/tradingview/charting_library/charting_library";

export const addOrderLine = (
  chart: any,
  price: number,
  quantity: string,
  isSell: boolean
) => {
  if (!chart) return;  
  const buyColor = "#26A69A";
  const sellColor = "#EF5350";

  const color = isSell ? sellColor : buyColor;
  const orderLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;

  orderLine
    .setLineColor(color)
    .setPrice(price)
    .setText("Limit  " + `${price}`)
    .setLineStyle(2)
    .setBodyBorderColor(color)
    .setLineLength(60, "percentage")
    .setQuantity(quantity)
    .setQuantityBackgroundColor("#000000")
    .onCancel("onCancel called", function (this: IOrderLineAdapter) {
      this.remove();
    })
    .onMove(function (this: IOrderLineAdapter) {
      const newPrice = this.getPrice();
      this.setPrice(newPrice);
      this.setText("Limit  " + `${newPrice}`);
    })
    .onMoving(function (this: IOrderLineAdapter) {
      const newPrice = this.getPrice();
      this.setPrice(newPrice);
      this.setText("Limit  " + `${newPrice}`);
    });

  return orderLine;
};