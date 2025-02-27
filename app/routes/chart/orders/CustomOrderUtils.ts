import type { OrderLine } from "./OrderUtils";

export const addCustomOrderLine = async (chart: any) => {
  if (!chart) return;

  const price = 98997;

  const orderLine = chart.activeChart().createShape(
    {
      time: Date.now(),
      price: price,
    },
    {
      shape: "horizontal_line",
      lock: false,
      disableSelection: true,
      disableSave: true,
      disableUndo: true,
      text: "Buy Limit",
      textColor: "#FFFFFF",
      backgroundColor: "#1877F2",
      borderColor: "#1877F2",
      fontsize: 12,
      transparency: 30,
      icon:2,
    }
  );

  orderLine.onModify(() => {
    const newPrice = orderLine.getPrice();
    console.log("Yeni emir fiyatı:", newPrice);
  });

  return orderLine;
};
