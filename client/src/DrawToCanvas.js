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
    static MIN_POINTS_IN_CLOSED_PATH = 10;
    static CLOSE_PATH_RADIUS = 7;

    // static getAllPointsToFillUsingBFS(startingPoint) {
    //     // function coordinateIsNotABoundary(x, y) {
    //     //     const data = DrawToCanvas.context.getImageData(x, y, 1, 1).data;
    //     //     // Either all 0's (no line has beeen drawn) or white (eraser mark)
    //     //     const val = (data[0] === 0 && data[1] === 0 && data[2] === 0 && data[3] === 0) || (data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 1);
    //     //     return val;
    //     // }

    //     const canvasHeight = getOldCanvasHeight();
    //     const canvasWidth = getOldCanvasWidth();
    //     let alreadySeenPoints = new Set();
    //     let queue = [startingPoint];
    //     console.log("QUEUE:");
    //     for (let data of queue) {
    //         console.log(data);
    //     }
    //     while (queue.length > 0) {
    //         const currentPoint = queue.shift();
    //         alreadySeenPoints.add(JSON.stringify(currentPoint));
    //         const currX = currentPoint.x;
    //         const currY = currentPoint.y;

    //         // right
    //         if (currX < canvasWidth && coordinateIsNotABoundary(currX + 1, currY)) {
    //             const newPoint = { x: currX + 1, y: currY };
    //             if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
    //                 queue.push(newPoint);
    //             }
    //         }
    //         // left
    //         if (currX > 0 && coordinateIsNotABoundary(currX - 1, currY)) {
    //             const newPoint = { x: currX - 1, y: currY };
    //             if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
    //                 queue.push(newPoint);

    //             }
    //         }
    //         // top
    //         if (currY > 0 && coordinateIsNotABoundary(currX, currY - 1)) {
    //             const newPoint = { x: currX, y: currY - 1 };
    //             if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
    //                 queue.push(newPoint);
    //             }

    //         }
    //         // bottom
    //         if (currY < canvasHeight && coordinateIsNotABoundary(currX, currY + 1)) {
    //             const newPoint = { x: currX, y: currY + 1 };
    //             if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
    //                 queue.push(newPoint);
    //             }
    //         }
    //         console.log("QUEUE:");
    //         for (let data of queue) {
    //             console.log(data);
    //         }
    //     }
    //     console.log(alreadySeenPoints);
    //     return alreadySeenPoints;
    // }

    // static fillAllPoints(pointsToFill) {
    //     for (let point of pointsToFill) {
    //         point = JSON.parse(point);
    //         DrawToCanvas.context.fillStyle = getComputedStyle(document.querySelector(`.${DrawToCanvas.currentColorClass}`))["background-color"];
    //         DrawToCanvas.context.fillRect(point.x, point.y, 1, 1);
    //     }
    // }


    static calcMidpoint(point1, point2) {
        return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
    }

    static calcDistance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    }


    // Draws remainder of path from tripletStartIndex to end of serializedPath.points
    static drawRemainderOfPath(serializedPath, tripletStartIndex, redrawing = false) {
        const { lineWidth, strokeStyle, points, path } = serializedPath;
        DrawToCanvas.context.lineWidth = lineWidth;
        DrawToCanvas.context.strokeStyle = strokeStyle;

        DrawToCanvas.context.beginPath();


        for (let currentTripletIndex = tripletStartIndex; currentTripletIndex <= points.length - 3; currentTripletIndex++) {

            const firstMidpoint = DrawToCanvas.calcMidpoint(points[currentTripletIndex], points[currentTripletIndex + 1]);
            DrawToCanvas.context.moveTo(firstMidpoint.x, firstMidpoint.y);
            const nextMidpoint = DrawToCanvas.calcMidpoint(points[currentTripletIndex + 1], points[currentTripletIndex + 2]);

            DrawToCanvas.context.quadraticCurveTo(points[currentTripletIndex + 1].x, points[currentTripletIndex + 1].y, nextMidpoint.x, nextMidpoint.y);

            path.quadraticCurveTo(points[currentTripletIndex + 1].x, points[currentTripletIndex + 1].y, nextMidpoint.x, nextMidpoint.y);

        }
        DrawToCanvas.context.stroke();

        if (!redrawing) {
            // The path2d object is just for record keeping of the points. I don't actually use it to draw since it reduces resolution for some reason.

            if (serializedPath.points.length >= DrawToCanvas.MIN_POINTS_IN_CLOSED_PATH && DrawToCanvas.calcDistance(serializedPath.points[0], serializedPath.points[serializedPath.points.length - 1]) < DrawToCanvas.CLOSE_PATH_RADIUS) {
                console.log("HERE");
                path.closePath();
                serializedPath.isClosed = true;

                const uuid = crypto.randomUUID();
                DrawToCanvas.currentTripletIndexFromMouse = 0;
                const freshPath = new Path2D();
                DrawToCanvas.allPaths[uuid] = { points: [{ x: serializedPath.points[serializedPath.points.length - 1].x, y: serializedPath.points[serializedPath.points.length - 1].y }], lineWidth, strokeStyle, path: freshPath, isClosed: false };
                DrawToCanvas.currentPathUUIDFromMouse = uuid;
                DrawToCanvas.setIsDrawing(true);
            }
        }


    }


    static mouseDownEventListener(e) {
        if (DrawToCanvas.context) {
            const currentX = e.offsetX;
            const currentY = e.offsetY;
            if (DrawToCanvas.selectedPaletteOption === 'eraser' || DrawToCanvas.selectedPaletteOption === 'pen') {
                const lineWidth = DrawToCanvas.selectedPaletteOption === 'eraser' ? DrawToCanvas.currentEraseStrokeSize : DrawToCanvas.currentDrawStrokeSize;
                const strokeStyle = DrawToCanvas.selectedPaletteOption === 'eraser' ? 'white' : getComputedStyle(document.querySelector(`.${DrawToCanvas.currentColorClass}`))["background-color"];

                const uuid = crypto.randomUUID();
                DrawToCanvas.currentTripletIndexFromMouse = 0;
                const path = new Path2D();
                DrawToCanvas.allPaths[uuid] = { points: [{ x: currentX, y: currentY }], lineWidth, strokeStyle, path, isClosed: false };
                DrawToCanvas.currentPathUUIDFromMouse = uuid;
                DrawToCanvas.setIsDrawing(true);
            }

            if (DrawToCanvas.selectedPaletteOption === 'fill') {
                console.log('all paths');
                console.log(DrawToCanvas.allPaths);
                for (const [uuid, serializedPath] of Object.entries(DrawToCanvas.allPaths)) {
                    console.log(serializedPath);
                    console.log(DrawToCanvas.context.isPointInPath(serializedPath.path, currentX, currentY));
                    if (serializedPath.isClosed && DrawToCanvas.context.isPointInPath(serializedPath.path, currentX, currentY)) {
                        console.log('filling');
                        DrawToCanvas.context.fill(serializedPath.path);
                    }
                }
            }

        }
    }

    static mouseMoveEventListener(e) {
        if (DrawToCanvas.context) {
            if (DrawToCanvas.isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points.push({ x: currentX, y: currentY });
                if (DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points.length === 2) {
                    const midpoint = DrawToCanvas.calcMidpoint(DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points[0], DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].points[1]);
                    DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].path.moveTo(midpoint.x, midpoint.y);
                }


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

                DrawToCanvas.context.fill(DrawToCanvas.allPaths[DrawToCanvas.currentPathUUIDFromMouse].path, "evenodd");
                DrawToCanvas.setIsDrawing(false);
            }
        }
    }

    static scaleAllPathsAndRedrawAllCurves(scaleX, scaleY) {
        let newAllPaths = {};
        for (const [uuid, serializedPath] of Object.entries(DrawToCanvas.allPaths)) {
            const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));
            const newPath = new Path2D();
            newPath.addPath(serializedPath.path, document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix().scaleNonUniform(scaleX, scaleY));

            let newSerializedPath = { points: scaledPoints, lineWidth: serializedPath.lineWidth, strokeStyle: serializedPath.strokeStyle, path: newPath, isClosed: serializedPath.isClosed };

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


