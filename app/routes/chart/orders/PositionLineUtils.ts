export const addPositionLine = async (chart: any) => {
  if (!chart) return;

  const positionLine = await chart.chart().createPositionLine();
  positionLine
     .onModify(function() {
        // this.setText("onModify called");
    })
    .onReverse("onReverse called", function(text:string) {
        // this.setText(text);
    })
    .onClose("onClose called", function(text:string) {
        // this.setText(text);
    })
    .setText("PROFIT: 71.1 (3.31%)")
    .setTooltip("Additional position information")
    .setProtectTooltip("Protect position")
    .setCloseTooltip("Close position")
    .setReverseTooltip("Reverse position")
    .setQuantity("8.235")
    .setPrice(99160)
    .setExtendLeft(false)
    .setLineStyle(0)
    .setLineLength(25);

  return positionLine;
};
