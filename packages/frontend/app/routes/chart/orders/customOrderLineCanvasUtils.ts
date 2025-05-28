type Segment = {
    text: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
};

type DrawSegmentedRectOptions = {
    x: number;
    y: number;
    height: number;
    padding?: number;
    font?: string;
    segments: Segment[];
};

export function drawSegmentedRect(
    ctx: CanvasRenderingContext2D,
    {
        x,
        y,
        height,
        padding = 4,
        font = 'bold 10px sans-serif',
        segments,
    }: DrawSegmentedRectOptions,
) {
    ctx.save();
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    let cursorX = x;

    for (let i = 0; i < segments.length; i++) {
        const { text, backgroundColor, textColor, borderColor } = segments[i];
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const segmentWidth = textWidth + padding * 2;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(cursorX, y, segmentWidth, height);

        ctx.strokeStyle = borderColor;
        ctx.strokeRect(cursorX, y, segmentWidth, height);

        ctx.fillStyle = textColor;
        ctx.fillText(text, cursorX + segmentWidth / 2, y + height / 2);

        cursorX += segmentWidth;
    }

    ctx.restore();
}
