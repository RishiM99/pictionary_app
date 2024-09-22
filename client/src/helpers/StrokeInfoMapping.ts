import { StrokeSize } from "./Enums";

export const StrokeInfo = new Map(
    [[StrokeSize.small, { "pixelSize": 2, "cursorClass": "circular-cursor-small" }],
    [StrokeSize.medium, { "pixelSize": 6, "cursorClass": "circular-cursor-medium" }],
    [StrokeSize.large, { "pixelSize": 9, "cursorClass": "circular-cursor-large" }]],
);