import type {
  EntityId,
  IChartingLibraryWidget,
  IChartWidgetApi,
  ILineDataSourceApi,
} from "public/tradingview/charting_library/charting_library";

export const mapResolutionToInterval = (resolution: string): string => {
  const mapping: Record<string, string> = {
    "1": "1m",
    "5": "5m",
    "15": "15m",
    "60": "1h",
    "240": "4h",
    D: "1d",
    W: "1w",
  };
  return mapping[resolution] || "1d";
};

export const mapResolutionToMiliseconds = (resolution: string): number => {
  const mapping: Record<string, number> = {
    "1": 60,
    "5": 300,
    "15": 900,
    "60": 3600,
    "240": 14400,
    D: 86400,
    W: 604800,
  };
  return mapping[resolution] || 86400;
};

export function resolutionToSeconds(resolution: string): number {
  if (resolution === "1D") return 86400;
  if (resolution === "W") return 604800;
  if (resolution === "M") return 2592000;

  return Number(resolution);
}

export function createCircle(
  chart: IChartWidgetApi,
  time: number,
  price: number,
  color: string,
  diameter: number,
  periodAsSeconds: number
): EntityId | null {
  const shape = chart.createMultipointShape(
    [
      { time: time, price: price },
      { time: time + periodAsSeconds * diameter, price: price },
    ],
    {
      shape: "circle",
      overrides: {
        backgroundColor: color,
        linewidth: 0,
        color: "transparent",
      },
      disableSelection: true, // Allow selection
      disableSave: true, // Do not save to cloud
      lock: true,
      zOrder: "top",
    }
  );

  return shape;
}

export function calculateDistance(
  offsetX: number,
  offsetY: number,
  chart: IChartWidgetApi,
  activeShape: ILineDataSourceApi
) {
  const activeShapePoints = activeShape.getPoints();
  const diff = activeShapePoints[1].time - activeShapePoints[0].time;

  const timeScale = chart.getTimeScale();

  const ratio = chart.getPriceToBarRatio();

  console.log(ratio, diff, timeScale.barSpacing())

  // const timeCenter = activeShapePoints[0].time;
  // const diameterPoint = activeShapePoints[1].time;

  // const diameterAsPixel = chart.getTimeScale().g  timeCenter - diameterPoint

  // const xAxisDiameter =
  //   offsetX > timeCenter - diameterAsPixel &&
  //   offsetX < timeCenter + diameterAsPixel;
  // const yAxisDiameter =
  //   offsetY > priceCenter - diameterAsPixel &&
  //   offsetX < priceCenter + diameterAsPixel;

  // console.log(xAxisDiameter, yAxisDiameter);

  // return xAxisDiameter && yAxisDiameter;
}

const sellColor = "rgb(239, 83, 80, 0.3)";
const buyColor = "rgba(95, 255, 242, 0.3)";

export const circleFillData = [
  { time: 1739623705, price: 86000, color: sellColor, size: 3 },
  { time: 1739191705, price: 90000, color: buyColor, size: 3.5 },
  { time: 1740036941, price: 102000, color: buyColor, size: 5 },
  { time: 1738481741, price: 106000, color: sellColor, size: 4 },
];
