export const addCustomOrderLine = async (chart: any, orderPrice: number) => {
  if (!chart) return;

  const orderLine = chart
    .activeChart()
    .createMultipointShape(
      [{ time: chart.activeChart().getVisibleRange().to, price: orderPrice }],
      {
        shape: "horizontal_line",
        lock: false,
        disableSelection: true,
        disableSave: true,
        disableUndo: true,
        text: "text",
        overrides: {
          linestyle: 2,
          extendLeft: true,
          extendRight: true,
        },
      }
    );

  return orderLine;
};
