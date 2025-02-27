import type {
  IOrderLineAdapter,
  OrderTemplate,
} from "public/tradingview/charting_library/charting_library";

export interface OrderLine {
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
    .setText(`${text}`)
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
    // .onModify(function (this: OrderLine) {
    //   const newPrice = this.getPrice();
    //   this.setText(`${text}: ${newPrice.toFixed(2)}`);
    // })
    .setLineLength(30, "percentage");

  const tp = 99000;
  const sl = 99000;
  // TP (Take Profit)
  let tpLine: IOrderLineAdapter | null = null;
  if (tp) {
    tpLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;
    tpLine
      .setPrice(tp)
      .setText("TP")
      .setLineStyle(1)
      .setBodyTextColor("#008000")
      .setBodyBackgroundColor("#FFFFFF")
      .setBodyBorderColor("#00A859")
      .setTooltip("Take Profit Order")
      .setLineLength(20, "percentage")
      .setExtendLeft(false);
  }

  // SL (Stop Loss)
  let slLine: IOrderLineAdapter | null = null;
  if (sl) {
    slLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;
    slLine
      .setPrice(sl)
      .setText("SL")
      .setLineStyle(1)
      .setBodyTextColor("#FF0000")
      .setBodyBackgroundColor("#FFFFFF")
      .setBodyBorderColor("#FF4500")
      .setTooltip("Stop Loss Order")
      .setLineLength(10, "percentage")
      .setExtendLeft(false);
  }

  const dragLine = chart.activeChart().createOrderLine() as IOrderLineAdapter;
  dragLine
    .setPrice(price)
    .setText("")
    .setLineStyle(1)
    .setBodyTextColor("#FF0000")
    .setBodyBackgroundColor("#FFFFFF")
    .setBodyBorderColor("#FF4500")
    .setLineLength(80, "percentage")
    .setExtendLeft(false)
    .setQuantityBackgroundColor("#FFFFFF");

  if (orderLine) {
    const tpOffset = tp ? tp - price : 0;
    const slOffset = sl ? sl - price : 0;

    orderLine
      .onMove(function (this: OrderLine) {
        const newPrice = this.getPrice();
        if (tpLine) tpLine.setPrice(newPrice + tpOffset);
        if (slLine) slLine.setPrice(newPrice + slOffset);
        if (dragLine) dragLine.setPrice(newPrice + slOffset);

        this.setText(`${text}`);
      })
      .onMoving(function (this: OrderLine) {
        const newPrice = this.getPrice();

        if (tpLine) tpLine.setPrice(newPrice + tpOffset);
        if (slLine) slLine.setPrice(newPrice + slOffset);
        if (dragLine) dragLine.setPrice(newPrice + slOffset);

        this.setText(`${text}`);
      });
  }

  /* const api = chart.activeChartWidget;
  const originalCrossHairMode = api?.model().crossHairMode();

  const hideCrosshair = () => {
    console.log("hideCrosshair");

    // api?.model().setCrossHairMode(originalCrossHairMode.Hidden);
  };

  const showCrosshair = () => {
    console.log("showCrosshair");

    // api?.model().setCrossHairMode(originalCrossHairMode || originalCrossHairMode.Normal);
  };

  // Mouse hareketlerini dinle
  document.addEventListener("mousemove", (event) => {
    const mouseY = event.clientY;
    const orderY = chart.priceToCoordinate(price);
    const tpY = tp ? chart.priceToCoordinate(tp) : null;
    const slY = sl ? chart.priceToCoordinate(sl) : null;

    if (orderY && Math.abs(mouseY - orderY) < 10) hideCrosshair();
    else if (tpY && Math.abs(mouseY - tpY) < 10) hideCrosshair();
    else if (slY && Math.abs(mouseY - slY) < 10) hideCrosshair();
    else showCrosshair();
  });
 */
  return orderLine;
};
