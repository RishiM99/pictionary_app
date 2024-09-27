import { Point } from "./Types";

let currentCanvasWidth: number = null;
let currentCanvasHeight: number = null;
let currentMousePosition: Point = null;

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

export function getCurrentMousePosition(): Point {
    return currentMousePosition;
}

export function setCurrentMousePosition(val: Point) {
    currentMousePosition = val;
}

