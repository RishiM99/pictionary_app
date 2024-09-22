import { StrokeSize } from "./Enums";

export const StrokeInfo = new Map(
    [[StrokeSize.Small, { "pixelSize": 2, "cursorClass": "circular-cursor-small" }],
    [StrokeSize.Medium, { "pixelSize": 6, "cursorClass": "circular-cursor-medium" }],
    [StrokeSize.Large, { "pixelSize": 9, "cursorClass": "circular-cursor-large" }]],
);