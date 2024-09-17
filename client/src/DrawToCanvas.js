import { setOldCanvasWidth, setOldCanvasHeight, getOldCanvasHeight, getOldCanvasWidth } from './CanvasResizingHelper.js';


export default class DrawToCanvas {
    static allPaths = {};
    static currentTripletIndexFromMouse = 0;
    static drawingCanvas = null;
    static context = null;
    static currentColorClass = null;
    static currentDrawStrokeSize = null;
    static currentEraseStrokeSize = null;
    static setIsDrawing = null;
    static isDrawing = null;
    static selectedPaletteOption = null;
    static currentPathUUIDFromMouse = null;


    static calcMidpoint(point1, point2) {
        return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
    }


    // Draws remainder of path from tripletStartIndex to end of serializedPath.points
    static drawRemainderOfPath(serializedPath, tripletStartIndex) {
        const { lineWidth, strokeStyle, points } = serializedPath;
        DrawToCanvas.context.lineWidth = lineWidth;
        DrawToCanvas.context.strokeStyle = strokeStyle;

        DrawToCanvas.context.beginPath();


        for (let currentTripletIndex = tripletStartIndex; currentTripletIndex <= points.length - 3; currentTripletIndex++) {
            const firstMidpoint = DrawToCanvas.calcMidpoint(points[currentTripletIndex], points[currentTripletIndex + 1]);
            DrawToCanvas.context.moveTo(firstMidpoint.x, firstMidpoint.y);
            const nextMidpoint = DrawToCanvas.calcMidpoint(points[currentTripletIndex + 1], points[currentTripletIndex + 2]);

            DrawToCanvas.context.quadraticCurveTo(points[currentTripletIndex + 1].x, points[currentTripletIndex + 1].y, nextMidpoint.x, nextMidpoint.y);
        }
        DrawToCanvas.context.stroke();
    }


    static mouseDownEventListener(e) {
        if (DrawToCanvas.context) {
            const currentX = e.offsetX;
            const currentY = e.offsetY;

            const lineWidth = DrawToCanvas.selectedPaletteOption === 'eraser' ? DrawToCanvas.currentEraseStrokeSize : DrawToCanvas.currentDrawStrokeSize;
            const strokeStyle = DrawToCanvas.selectedPaletteOption === 'eraser' ? 'white' : getComputedStyle(document.querySelector(`.${DrawToCanvas.currentColorClass}`))["background-color"];

            const uuid = crypto.randomUUID();
            DrawToCanvas.currentTripletIndexFromMouse = 0;
            DrawToCanvas.allPaths[uuid] = { points: [{ x: currentX, y: currentY }], lineWidth, strokeStyle };
            DrawToCanvas.currentPathUUIDFromMouse = uuid;
            DrawToCanvas.setIsDrawing(true);
        }
    }

    static mouseMoveEventListener(e) {
        if (DrawToCanvas.context) {
            if (DrawToCanvas.isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points.push({ x: currentX, y: currentY });
                DrawToCanvas.drawRemainderOfPath(DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse], DrawToCanvas.currentTripletIndexFromMouse);

                if (DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points.length >= 3) {
                    DrawToCanvas.currentTripletIndexFromMouse++;
                }
            }
        }
    }

    static mouseUpEventListener(e) {
        if (DrawToCanvas.context) {
            if (DrawToCanvas.isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points.push({ x: currentX, y: currentY });
                DrawToCanvas.drawRemainderOfPath(DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse], DrawToCanvas.currentTripletIndexFromMouse);

                DrawToCanvas.setIsDrawing(false);
            }
        }
    }

    static scaleAllPathsAndRedrawAllCurves(scaleX, scaleY) {
        let newAllPaths = {};
        for (const [uuid, serializedPath] of Object.entries(DrawToCanvas.allPaths)) {
            const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));

            let newSerializedPath = { points: scaledPoints, lineWidth: serializedPath.lineWidth, strokeStyle: serializedPath.strokeStyle };

            DrawToCanvas.drawRemainderOfPath(newSerializedPath, 0, true);

            newAllPaths[crypto.randomUUID()] = newSerializedPath;
        }

        DrawToCanvas.allPaths = newAllPaths;
    }


    static windowResizeListener(e) {

        if (DrawToCanvas.drawingCanvas) {
            DrawToCanvas.drawingCanvas.height = parseInt(window.getComputedStyle(DrawToCanvas.drawingCanvas).getPropertyValue("height"), 10);
            DrawToCanvas.drawingCanvas.width = parseInt(window.getComputedStyle(DrawToCanvas.drawingCanvas).getPropertyValue("width"), 10);

            const xScale = DrawToCanvas.drawingCanvas.width / getOldCanvasWidth();
            const yScale = DrawToCanvas.drawingCanvas.height / getOldCanvasHeight();
            DrawToCanvas.scaleAllPathsAndRedrawAllCurves(xScale, yScale);
            setOldCanvasWidth(DrawToCanvas.drawingCanvas.width);
            setOldCanvasHeight(DrawToCanvas.drawingCanvas.height);
        }
    }


    static setUpDrawingForCanvas({ drawingCanvasRef, currentColorClass, currentDrawStrokeSize, setIsDrawing, isDrawing, selectedPaletteOption, currentEraseStrokeSize }) {

        DrawToCanvas.drawingCanvas = drawingCanvasRef?.current;
        DrawToCanvas.context = DrawToCanvas.drawingCanvas?.getContext("2d");
        DrawToCanvas.currentColorClass = currentColorClass;
        DrawToCanvas.currentDrawStrokeSize = currentDrawStrokeSize;
        DrawToCanvas.currentEraseStrokeSize = currentEraseStrokeSize;
        DrawToCanvas.setIsDrawing = setIsDrawing;
        DrawToCanvas.isDrawing = isDrawing;
        DrawToCanvas.selectedPaletteOption = selectedPaletteOption;

        if (DrawToCanvas.drawingCanvas) {
            if (DrawToCanvas.selectedPaletteOption === 'color-picker') {
                DrawToCanvas.drawingCanvas.removeEventListener("mousedown", DrawToCanvas.mouseDownEventListener);
                DrawToCanvas.drawingCanvas.removeEventListener("mousemove", DrawToCanvas.mouseMoveEventListener);
                DrawToCanvas.drawingCanvas.removeEventListener("mouseup", DrawToCanvas.mouseUpEventListener);
                window.removeEventListener("resize", DrawToCanvas.windowResizeListener)
                // Do nothing for drawing, and remove event listeners
            } else {
                DrawToCanvas.drawingCanvas.addEventListener("mousedown", DrawToCanvas.mouseDownEventListener);
                DrawToCanvas.drawingCanvas.addEventListener("mousemove", DrawToCanvas.mouseMoveEventListener);
                DrawToCanvas.drawingCanvas.addEventListener("mouseup", DrawToCanvas.mouseUpEventListener);
                window.addEventListener("resize", DrawToCanvas.windowResizeListener)
            }
        }

        return () => {
            if (DrawToCanvas.drawingCanvas) {
                DrawToCanvas.drawingCanvas.removeEventListener("mousedown", DrawToCanvas.mouseDownEventListener);
                DrawToCanvas.drawingCanvas.removeEventListener("mousemove", DrawToCanvas.mouseMoveEventListener);
                DrawToCanvas.drawingCanvas.removeEventListener("mouseup", DrawToCanvas.mouseUpEventListener);
                window.removeEventListener("resize", DrawToCanvas.windowResizeListener)
            }
        }
    }




}



// const CLOSE_PATH_RADIUS = 10;
// const MIN_POINTS_IN_CLOSED_PATH = 30;


