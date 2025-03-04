import type {
  IOrderLineAdapter,
  OrderTemplate,
} from "public/tradingview/charting_library/charting_library";

export interface OrderLine {
  setPrice: (price: number) => void;
  setText: (text: string) => void;
  setTooltip: (tooltip: string) => any;
  setExtendLeft: (extendLeft: boolean) => any;
  onMove: (callback: () => void) => void;
  onModify: (tooltip: string, callback: (text: string) => void) => void;
  onCancel: (tooltip: string, callback: (text: string) => void) => void;
  getPrice: () => number;
}

export const addOrderLine = (
  chart: any,
  price: number,
  quantity: number,
  text = ""
) => {
  if (!chart) return;

  const orderLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;

  let tempPrice = price;
  orderLine
    .setText(`${text}`)
    .setPrice(price)
    .setLineStyle(2)
    .setLineColor("#4285F4")
    .setBodyBackgroundColor("#4285F4")
    .setBodyTextColor("#FFFFFF")
    .setQuantityBorderColor("#4285F4")
    .setCancelTooltip("Cancel order")
    .setExtendLeft(true)
    .setEditable(true)
    .setQuantity("")
    .setLineLength(30, "percentage");

  const hasTp = true;
  const hasSl = true;

  // TP (Take Profit)
  let tpLine: any | null = null;
  if (hasTp) {
    tpLine = addTakeProfit(chart, tempPrice, orderLine);
  }

  // SL (Stop Loss)
  let slLine: any | null = null;

  if (hasSl) {
    slLine = addStopLoss(chart, tempPrice, orderLine);
  }

  if (orderLine) {
    orderLine
      .onMove(function (this: OrderLine) {
        const newPrice = this.getPrice();
        if (tpLine && tpLine.getPrice() === tempPrice)
          tpLine.setPrice(newPrice);
        if (slLine && slLine.getPrice() === tempPrice)
          slLine.setPrice(newPrice);
        tempPrice = newPrice;
        this.setText(`${text}`);
      })
      .onMoving(function (this: OrderLine) {
        const newPrice = this.getPrice();

        if (tpLine && tpLine.getPrice() === tempPrice)
          tpLine.setPrice(newPrice);
        if (slLine && slLine.getPrice() === tempPrice)
          slLine.setPrice(newPrice);
        tempPrice = newPrice;
        this.setText(`${text}`);
      });
  }

  if (tpLine) {
  }

  return orderLine;
};

export const addTakeProfit = (
  chart: any,
  tpPrice: number,
  orderLine: IOrderLineAdapter
) => {
  const tpLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;
  tpLine
    .setPrice(tpPrice)
    .setText("TP")
    .setLineStyle(2)
    .setBodyBorderColor("#00A859")
    .setTooltip("Take Profit Order")
    .setLineLength(20, "percentage")
    .setExtendLeft(false)
    .setQuantity("");

  tpLine
    .onMove(function (this: OrderLine) {
      const newPrice = this.getPrice();
      if (tpLine) tpLine.setPrice(newPrice);
      const tempExtendLeft = newPrice === orderLine.getPrice() ? false : true;
      this.setExtendLeft(tempExtendLeft);

      if (tpLine) tpLine.setPrice(newPrice);
    })
    .onMoving(function (this: OrderLine) {
      const newPrice = this.getPrice();

      const tempExtendLeft = newPrice === orderLine.getPrice() ? false : true;
      this.setExtendLeft(tempExtendLeft);

      if (tpLine) {
        tpLine.setPrice(newPrice);
        tpLine.onCancel("onCancel called", function (this: IOrderLineAdapter) {
          this.setExtendLeft(false);
          this.setPrice(orderLine.getPrice());
          // addTakeProfit(chart, orderLine.getPrice(), orderLine);
          // this.remove();
        });
      }
    });

  return tpLine;
};

export const addStopLoss = (
  chart: any,
  slPrice: number,
  orderLine: IOrderLineAdapter
) => {
  const tpLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;
  tpLine
    .setPrice(slPrice)
    .setText("SL")
    .setLineStyle(2)
    .setBodyBorderColor("#FF4500")
    .setTooltip("Stop Loss Order")
    .setLineLength(10, "percentage")
    .setExtendLeft(false)
    .setQuantity("");

  tpLine
    .onMove(function (this: OrderLine) {
      const newPrice = this.getPrice();
      if (tpLine) tpLine.setPrice(newPrice);
      const tempExtendLeft = newPrice === orderLine.getPrice() ? false : true;
      this.setExtendLeft(tempExtendLeft);

      if (tpLine) tpLine.setPrice(newPrice);
    })
    .onMoving(function (this: OrderLine) {
      const newPrice = this.getPrice();

      const tempExtendLeft = newPrice === orderLine.getPrice() ? false : true;
      this.setExtendLeft(tempExtendLeft);

      if (tpLine) {
        tpLine.setPrice(newPrice);
        tpLine.onCancel("onCancel called", function (this: IOrderLineAdapter) {
          this.setExtendLeft(false);
          this.setPrice(orderLine.getPrice());
          // addTakeProfit(chart, orderLine.getPrice(), orderLine);
          // this.remove();
        });
      }
    });

  return tpLine;
};
