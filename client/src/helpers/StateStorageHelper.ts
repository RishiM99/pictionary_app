import { StrPoint } from "./Types";

let currentCanvasWidth: number = null;
let currentCanvasHeight: number = null;
let currentMousePosition: StrPoint = null;

export function getCurrentCanvasWidth(): number {
    return currentCanvasWidth;
}

export function getCurrentCanvasHeight(): number {
    return currentCanvasHeight;
}

export function setCurrentCanvasWidth(val: number) {
    currentCanvasWidth = val;
}

export function setCurrentCanvasHeight(val: number) {
    currentCanvasHeight = val;
}

export function getCurrentMousePosition(): StrPoint {
    return currentMousePosition;
}

export function setCurrentMousePosition(val: StrPoint) {
    currentMousePosition = val;
}

