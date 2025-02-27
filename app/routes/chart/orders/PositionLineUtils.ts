import type { OrderLine } from "./OrderUtils";

export const addPositionLine = async (chart: any) => {
  if (!chart) return;

  const positionLine = await chart.activeChart().createPositionLine();
  positionLine
    // .onModify(function () {
    //   // this.setText("onModify called");
    // })
    .onReverse("onReverse called", function (text: string) {
      // this.setText(text);
    })
    .onClose("onClose called", function (text: string) {
      // this.setText(text);
    })
    // .setText("PROFIT: 71.1 (3.31%)")
    .setTooltip("Additional position information")
    .setProtectTooltip("Protect position")
    .setCloseTooltip("Close position")
    .setReverseTooltip("Reverse position")
    .setQuantity("8.235")
    .setPrice(99160)
    .setExtendLeft(true)
    .setLineStyle(0)
    .setLineLength(25)
   /*  .onModify(function (this: OrderLine) {
      const newPrice = positionLine.getPrice();

      console.log({newPrice});
      
      this.setPrice(newPrice);
    }) */;

  return positionLine;
};
