import type { IChartingLibraryWidget, IPaneApi } from '~/tv/charting_library';
import type { LineLabel } from './customOrderLineUtils';

export const addCustomOrderLine = (
    ctx: CanvasRenderingContext2D,
    yPixel: number,
    lineColor: string,
    lineWidth: number = 1,
) => {
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, yPixel);
    ctx.lineTo(ctx.canvas.width, yPixel);
    ctx.stroke();
    ctx.restore();
};

export const priceToPixel = (
    chart: IChartingLibraryWidget,
    price: number,
): number => {
    const { pixel, chartHeight } = getPricetoPixel(chart, price);
    if (chartHeight) return pixel / chartHeight;
    return 0;
};

export const getPricetoPixel = (
    chart: IChartingLibraryWidget,
    price: number,
) => {
    const textHeight = 15;
    let pixel = 0;

    const priceScalePane = chart.activeChart().getPanes()[0] as IPaneApi;
    const priceScale = priceScalePane.getMainSourcePriceScale();
    if (priceScale) {
        const priceRange = priceScale.getVisiblePriceRange();
        const chartHeight = priceScalePane.getHeight();

        if (!priceRange) return { pixel: 0, chartHeight: 0 };

        const maxPrice = priceRange.to;
        const minPrice = priceRange.from;
        const isLogarithmic = priceScale.getMode() === 1;

        if (isLogarithmic) {
            const logMinPrice = Math.log(minPrice);
            const logMaxPrice = Math.log(maxPrice);
            const logPrice = Math.log(price);
            const priceDifference = logMaxPrice - logMinPrice;
            const relativePrice = logPrice - logMinPrice;
            const pixelCoordinate =
                (relativePrice / priceDifference) * chartHeight;
            pixel = chartHeight - pixelCoordinate - textHeight / 2;
        } else {
            const priceDifference = maxPrice - minPrice;
            const relativePrice = price - minPrice;
            const pixelCoordinate =
                (relativePrice / priceDifference) * chartHeight;
            pixel = chartHeight - pixelCoordinate - textHeight / 2;
        }

        return { pixel, chartHeight };
    }
    return { pixel: 0, chartHeight: 0 };
};

export function estimateTextWidth(text: string, fontSize: number = 10): number {
    const isMac = navigator.userAgent.includes('Macintosh');
    const charWidthFactor = isMac ? 0.58 : 0.5;
    const avgCharWidth = fontSize * charWidthFactor;
    return text.length * avgCharWidth;
}

export const getAnchoredQuantityTextLocation = (
    chart: IChartingLibraryWidget,
    bufferX: number,
    orderTextValue: LineLabel,
) => {
    const timeScale = chart.activeChart().getTimeScale();
    const chartWidth = Math.floor(timeScale.width());

    const orderText = formatLineLabel(orderTextValue);
    const wrapWidthPx = estimateTextWidth(orderText) + 5;

    const offsetX = Number(wrapWidthPx / chartWidth);

    return bufferX + offsetX;
};

export const getAnchoredCancelButtonTextLocation = (
    chart: IChartingLibraryWidget,
    bufferX: number,
    orderTextValue: LineLabel,
    orderQuantityText?: string,
) => {
    const timeScale = chart.activeChart().getTimeScale();
    const chartWidth = Math.floor(timeScale.width());

    const orderText = formatLineLabel(orderTextValue);
    const wrapWidthPx = estimateTextWidth(orderText) + 5;

    const offsetX = Number(wrapWidthPx / chartWidth);

    const quantityTextWidth = orderQuantityText
        ? Number((estimateTextWidth(orderQuantityText) + 15) / chartWidth)
        : 0;
    return bufferX + offsetX + quantityTextWidth;
};

export const createAnchoredMainText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    textValue: LineLabel,
    borderColor: string,
) => {
    const text = formatLineLabel(textValue);
    return createAnchoredText(
        ctx,
        x,
        y,
        text,
        '#FFFFFF',
        estimateTextWidth(text),
        borderColor,
        '#3C91FF',
    );
};

export const createQuantityAnchoredText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
) => {
    return createAnchoredText(
        ctx,
        x,
        y,
        text,
        '#000000',
        estimateTextWidth(text) + 15,
        '#3C91FF',
        '#FFFFFF',
    );
};

export const createCancelAnchoredText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
) => {
    return createAnchoredText(ctx, x, y, ' X ', '#D1D1D1', 12, '#3C91FF');
};

export const createAnchoredText = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    backgroundColor: string,
    wordWrapWidth: number,
    borderColor: string,
    color: string = '#000000',
    fontSize: number = 10,
) => {
    ctx.save();

    ctx.font = `bold ${fontSize}px Arial`;
    const padding = 4;
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize * 1.2;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
        x,
        y - textHeight + padding / 2,
        textWidth + padding * 2,
        textHeight + padding,
    );

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(
        x,
        y - textHeight + padding / 2,
        textWidth + padding * 2,
        textHeight + padding,
    );

    ctx.fillStyle = color;
    ctx.fillText(text, x + padding, y + padding / 2);

    ctx.restore();
};

export const quantityTextFormatWithComma = (value: number): string => {
    const isNegative = value < 0;
    const [integerPart, decimalPart] = Math.abs(value).toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let result = formattedInteger;
    if (decimalPart !== undefined) {
        result += '.' + decimalPart;
    }
    return isNegative ? `-${result}` : result;
};

function getTriggerConditionText(rawText: string, orderType: string): string {
    const match = rawText.match(/Price (above|below) (\d+)/);
    if (!match) return rawText;
    const direction = match[1];
    const price = match[2];
    const operator = direction === 'above' ? '>' : '<';
    let labelPrefix = '';

    if (orderType === 'Take Profit Market') {
        labelPrefix = 'TP';
    }
    if (orderType === 'Stop Market') {
        labelPrefix = 'SL';
    }
    if (orderType === 'Stop Limit') {
        labelPrefix = '';
    }
    return ` ${labelPrefix} Price ${operator} ${price}  `;
}

export function formatLineLabel(label: LineLabel): string {
    switch (label.type) {
        case 'PNL': {
            const pnl = quantityTextFormatWithComma(Math.abs(label.pnl));
            return ' PNL ' + (label.pnl > 0 ? `$${pnl}  ` : `-$${pnl} `);
        }
        case 'Limit':
            return ` Limit ${label.price}  ${label.triggerCondition} `;
        case 'Take Profit Market':
            return getTriggerConditionText(
                label.triggerCondition,
                label.orderType,
            );
        case 'Stop Market':
            return getTriggerConditionText(
                label.triggerCondition,
                label.orderType,
            );
        case 'Stop Limit': {
            const triggerConditionText = getTriggerConditionText(
                label.triggerCondition,
                label.orderType,
            );
            return ` ${label.orderType} ${label.price} ${triggerConditionText}   `;
        }
        case 'Liq':
            return label.text;
        default:
            return '';
    }
}

export function isInsideTextBounds(
    hoverX: number,
    hoverY: number,
    textX: number,
    cancelTextX: number,
    textY: number,
): boolean {
    const estimatedTextsEndLocation = cancelTextX + estimateTextWidth(' X ');
    const estimatedHeight = 10 * 1.1;
    return (
        hoverX >= textX &&
        hoverX <= estimatedTextsEndLocation &&
        hoverY >= textY &&
        hoverY <= textY + estimatedHeight
    );
}

export function isInsideCancelTextBounds(
    clickX: number,
    clickY: number,
    textX: number,
    textY: number,
): boolean {
    const estimatedCancelTextEndLocation = textX + estimateTextWidth(' X ');
    const estimatedHeight = 10 * 1.1;
    return (
        clickX >= textX &&
        clickX <= estimatedCancelTextEndLocation &&
        clickY >= textY &&
        clickY <= textY + estimatedHeight
    );
}
