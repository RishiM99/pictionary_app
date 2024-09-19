import { StrokeSize } from "./Enums";

export const STROKE_INFO = new Map(
    [[StrokeSize.Small, { "penSize": 2, "cursorClass": "circular-cursor-small" }],
    [StrokeSize.Medium, { "penSize": 6, "cursorClass": "circular-cursor-medium" }],
    [StrokeSize.Large, { "penSize": 9, "cursorClass": "circular-cursor-large" }]],
);