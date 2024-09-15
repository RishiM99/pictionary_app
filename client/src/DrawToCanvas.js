import { setOldCanvasWidth, setOldCanvasHeight, getOldCanvasHeight, getOldCanvasWidth } from './CanvasResizingHelper.js';


export default class DrawToCanvas {
    static allPaths = {};
    static currentPathUUIDFromMouse = 0;
    // export let currentPath2DObjectFromMouse = new Path2D();
    static currentTripletIndexFromMouse = 0;
    static drawingCanvas = null;
    static context = null;
    static currentColorClass = null;
    static currentDrawStrokeSize = null;
    static currentEraseStrokeSize = null;
    static setIsDrawing = null;
    static isDrawing = null;
    static selectedPaletteOption = null;

    static getAllPointsToFillUsingBFS(startingPoint) {
        function coordinateIsNotABoundary(x, y) {
            const data = DrawToCanvas.context.getImageData(x, y, 1, 1).data;
            console.log(x, y);
            console.log(data);
            // Either all 0's (no line has beeen drawn) or white (eraser mark)
            const val = (data[0] === 0 && data[1] === 0 && data[2] === 0 && data[3] === 0) || (data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 1);
            console.log(val);
            return val;
        }

        const canvasHeight = getOldCanvasHeight();
        const canvasWidth = getOldCanvasWidth();
        let alreadySeenPoints = new Set();
        let queue = [startingPoint];
        while (queue.length > 0) {
            const currentPoint = queue.shift();
            const currX = currentPoint.x;
            const currY = currentPoint.y;
            console.log(currX, currY);
            console.log(`CANVAS HEIGHT AND WIDTH ${DrawToCanvas.drawingCanvas.height}`);
            console.log(`CANVAS HEIGHT AND WIDTH ${DrawToCanvas.drawingCanvas.width}`);

            // right
            if (currX + 1 < canvasWidth && coordinateIsNotABoundary(currX + 1, currY)) {
                const newPoint = { x: currX + 1, y: currY };
                if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
                    alreadySeenPoints.add(JSON.stringify(newPoint));
                    queue.push(newPoint);
                }
            }
            // left
            if (currX - 1 >= 0 && coordinateIsNotABoundary(currX - 1, currY)) {
                const newPoint = { x: currX - 1, y: currY };
                if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
                    alreadySeenPoints.add(JSON.stringify(newPoint));
                    queue.push(newPoint);

                }
            }
            // top
            if (currY - 1 >= 0 && coordinateIsNotABoundary(currX, currY - 1)) {
                const newPoint = { x: currX, y: currY - 1 };
                if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
                    alreadySeenPoints.add(JSON.stringify(newPoint));
                    queue.push(newPoint);
                }

            }
            // bottom
            if (currY + 1 < canvasHeight && coordinateIsNotABoundary(currX, currY + 1)) {
                const newPoint = { x: currX, y: currY + 1 };
                if (!alreadySeenPoints.has(JSON.stringify(newPoint))) {
                    alreadySeenPoints.add(JSON.stringify(newPoint));
                    queue.push(newPoint);
                }
            }
            console.log(`queue ${queue}`)
        }
        console.log(`alreadySeenPoints ${Array.from(alreadySeenPoints)}`);
        return alreadySeenPoints;
    }

    static fillAllPoints(pointsToFill) {
        for (let point of pointsToFill) {
            point = JSON.parse(point);
            DrawToCanvas.context.fillStyle = getComputedStyle(document.querySelector(`.${DrawToCanvas.currentColorClass}`))["background-color"];
            DrawToCanvas.context.fillRect(point.x, point.y, 1, 1);
        }
    }


    static calcMidpoint(point1, point2) {
        return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
    }

    static calcDistance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    }

    static getColorIndicesForCoord = (x, y) => {
        const red = y * (getOldCanvasWidth() * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    };

    // Draws remainder of path from tripletStartIndex to end of serializedPath.points
    static drawRemainderOfPath(serializedPath, tripletStartIndex) {
        console.log(serializedPath);
        console.log(tripletStartIndex);
        const { lineWidth, strokeStyle, points } = serializedPath;
        DrawToCanvas.context.beginPath();
        DrawToCanvas.context.lineWidth = lineWidth;
        DrawToCanvas.context.strokeStyle = strokeStyle;

        for (let currentTripletIndex = tripletStartIndex; currentTripletIndex <= points.length - 3; currentTripletIndex++) {
            const firstMidpoint = DrawToCanvas.calcMidpoint(points[currentTripletIndex], points[currentTripletIndex + 1])
            const secondMidpoint = DrawToCanvas.calcMidpoint(points[currentTripletIndex + 1], points[currentTripletIndex + 2])

            DrawToCanvas.context.moveTo(firstMidpoint.x, firstMidpoint.y);
            DrawToCanvas.context.quadraticCurveTo(points[currentTripletIndex + 1].x, points[currentTripletIndex + 1].y, secondMidpoint.x, secondMidpoint.y);

            // The path2d object is just for record keeping of the points. I don't actually use it to draw since it reduces resolution for some reason.
            // currentPath2DObjectFromMouse.moveTo(firstMidpoint.x, firstMidpoint.y);
            // currentPath2DObjectFromMouse.quadraticCurveTo(points[currentTripletIndexFromMouse + 1].x, points[currentTripletIndexFromMouse + 1].y, secondMidpoint.x, secondMidpoint.y);
            // if (serializedPath.points.length >= MIN_POINTS_IN_CLOSED_PATH && calcDistance(serializedPath.points[0], serializedPath.points[serializedPath.points.length - 1]) < CLOSE_PATH_RADIUS) {
            //     currentPath2DObjectFromMouse.closePath();
            //     serializedPath.path2DObject = currentPath2DObjectFromMouse;
            //     serializedPath.isPathClosed = true;
            //     console.log("FLALALA");
            //     currentPathIndexFromMouse++;
            //     currentTripletIndexFromMouse = 0;
            //     currentPath2DObjectFromMouse = new Path2D();
            // }

        }
        DrawToCanvas.context.stroke();

    }


    static mouseDownEventListener(e) {
        if (DrawToCanvas.context) {
            console.log("Im heree");
            const currentX = e.offsetX;
            const currentY = e.offsetY;
            if (DrawToCanvas.selectedPaletteOption === 'eraser' || DrawToCanvas.selectedPaletteOption === 'pen') {
                const lineWidth = DrawToCanvas.selectedPaletteOption === 'eraser' ? DrawToCanvas.currentEraseStrokeSize : DrawToCanvas.currentDrawStrokeSize;
                const strokeStyle = DrawToCanvas.selectedPaletteOption === 'eraser' ? 'white' : getComputedStyle(document.querySelector(`.${DrawToCanvas.currentColorClass}`))["background-color"];
                console.log(e);

                const uuid = crypto.randomUUID();
                DrawToCanvas.allPaths[uuid] = { points: [{ x: currentX, y: currentY }], lineWidth, strokeStyle };
                DrawToCanvas.currentPathUUIDFromMouse = uuid;
                console.log(DrawToCanvas.allPaths);
                DrawToCanvas.setIsDrawing(true);
            }

            if (DrawToCanvas.selectedPaletteOption === 'fill') {
                console.log("going to fill");
                const pointsToFill = DrawToCanvas.getAllPointsToFillUsingBFS({ x: currentX + 10, y: currentY });
                DrawToCanvas.fillAllPoints(pointsToFill);
                console.log("filled");
            }

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

                DrawToCanvas.currentPathUUIDFromMouse = crypto.randomUUID();
                DrawToCanvas.currentTripletIndexFromMouse = 0;
                //currentPath2DObjectFromMouse = new Path2D();
                DrawToCanvas.setIsDrawing(false);
            }
        }
    }

    static scaleAllPathsAndRedrawAllCurves(scaleX, scaleY) {
        console.log(DrawToCanvas.allPaths);
        let newAllPaths = {};
        for (const [uuid, serializedPath] of Object.entries(DrawToCanvas.allPaths)) {
            const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));
            // let path2D = new Path2D();

            let newSerializedPath = { points: scaledPoints, lineWidth: serializedPath.lineWidth, strokeStyle: serializedPath.strokeStyle };

            DrawToCanvas.drawRemainderOfPath(newSerializedPath, 0);

            newAllPaths[crypto.randomUUID()] = newSerializedPath;
        }

        DrawToCanvas.allPaths = newAllPaths;
    }


    static windowResizeListener(e) {
        console.log("HERESDFSDF1");

        if (DrawToCanvas.drawingCanvas) {
            console.log("HERESDFSDF");
            DrawToCanvas.drawingCanvas.height = parseInt(window.getComputedStyle(DrawToCanvas.drawingCanvas).getPropertyValue("height"), 10);
            DrawToCanvas.drawingCanvas.width = parseInt(window.getComputedStyle(DrawToCanvas.drawingCanvas).getPropertyValue("width"), 10);

            console.log("HERE");
            console.log(getOldCanvasWidth(), getOldCanvasHeight());
            console.log(DrawToCanvas.drawingCanvas.width, DrawToCanvas.drawingCanvas.height);
            const xScale = DrawToCanvas.drawingCanvas.width / getOldCanvasWidth();
            const yScale = DrawToCanvas.drawingCanvas.height / getOldCanvasHeight();
            console.log(xScale, yScale);
            DrawToCanvas.scaleAllPathsAndRedrawAllCurves(xScale, yScale);
            setOldCanvasWidth(DrawToCanvas.drawingCanvas.width);
            setOldCanvasHeight(DrawToCanvas.drawingCanvas.height);
        }
    }


    static setUpDrawingForCanvas({ drawingCanvasRef, currentColorClass, currentDrawStrokeSize, setIsDrawing, isDrawing, selectedPaletteOption, currentEraseStrokeSize }) {

        DrawToCanvas.drawingCanvas = drawingCanvasRef?.current;
        DrawToCanvas.context = DrawToCanvas.drawingCanvas?.getContext("2d");
        console.log(DrawToCanvas.drawingCanvas);
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
                console.log(DrawToCanvas.mouseDownEventListener);
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


