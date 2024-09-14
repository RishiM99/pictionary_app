import { setOldCanvasWidth, setOldCanvasHeight, getOldCanvasHeight, getOldCanvasWidth } from './CanvasResizingHelper.js';


export let allPaths = [];
export let currentPathIndexFromMouse = 0;
export let currentPath2DObjectFromMouse = new Path2D();
export let currentTripletIndexFromMouse = 0;

const CLOSE_PATH_RADIUS = 10;
const MIN_POINTS_IN_CLOSED_PATH = 30;

export function setUpDrawingForCanvas({ drawingCanvasRef, currentColorClass, currentDrawStrokeSize, setIsDrawing, isDrawing, selectedPaletteOption, currentEraseStrokeSize }) {
    const drawingCanvas = drawingCanvasRef?.current;
    const context = drawingCanvas?.getContext("2d");

    function checkIfPointIsInAnyPathAndSplitPath(point) {
        for (serializedPath of allPaths) {
            const points = serializedPath.points();

        }
    }

    function calcMidpoint(point1, point2) {
        return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
    }

    function calcDistance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    }

    function drawPathIncrementallyFromMouse() {
        const serializedPath = allPaths[currentPathIndexFromMouse];

        if (serializedPath.points.length >= 3) {
            console.log(serializedPath);
            console.log(currentTripletIndexFromMouse);
            const { lineWidth, strokeStyle, points } = serializedPath;
            context.beginPath();
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;

            const firstMidpoint = calcMidpoint(points[currentTripletIndexFromMouse], points[currentTripletIndexFromMouse + 1])
            console.log(currentTripletIndexFromMouse);
            console.log(currentPathIndexFromMouse);
            console.log(allPaths);
            const secondMidpoint = calcMidpoint(points[currentTripletIndexFromMouse + 1], points[currentTripletIndexFromMouse + 2])

            context.moveTo(firstMidpoint.x, firstMidpoint.y);
            context.quadraticCurveTo(points[currentTripletIndexFromMouse + 1].x, points[currentTripletIndexFromMouse + 1].y, secondMidpoint.x, secondMidpoint.y);

            // The path2d object is just for record keeping of the points. I don't actually use it to draw since it reduces resolution for some reason.
            currentPath2DObjectFromMouse.moveTo(firstMidpoint.x, firstMidpoint.y);
            currentPath2DObjectFromMouse.quadraticCurveTo(points[currentTripletIndexFromMouse + 1].x, points[currentTripletIndexFromMouse + 1].y, secondMidpoint.x, secondMidpoint.y);
            if (serializedPath.points.length >= MIN_POINTS_IN_CLOSED_PATH && calcDistance(serializedPath.points[0], serializedPath.points[serializedPath.points.length - 1]) < CLOSE_PATH_RADIUS) {
                currentPath2DObjectFromMouse.closePath();
                serializedPath.path2DObject = currentPath2DObjectFromMouse;
                serializedPath.isPathClosed = true;
                console.log("FLALALA");
                currentPathIndexFromMouse++;
                currentTripletIndexFromMouse = 0;
                currentPath2DObjectFromMouse = new Path2D();
            }

            context.stroke();
        }
    }

    function mouseDownEventListener(e) {
        console.log('mousedown');
        if (context) {
            let lineWidth = null;
            let strokeStyle = null;
            switch (selectedPaletteOption) {
                case 'eraser':
                    lineWidth = currentEraseStrokeSize;
                    strokeStyle = "white";
                    break;
                case 'pen':
                    lineWidth = currentDrawStrokeSize;
                    strokeStyle = getComputedStyle(document.querySelector(`.${currentColorClass}`))["background-color"];
                    break;
                default:
                    break;
            }
            console.log(e);
            const currentX = e.offsetX;
            const currentY = e.offsetY;
            allPaths.push({ points: [{ x: currentX, y: currentY }], lineWidth, strokeStyle, path2DObject: null, isPathClosed: false });
            console.log(allPaths);
            setIsDrawing(true);
        }
    }

    function mouseMoveEventListener(e) {
        console.log('mousemove');
        if (context) {
            if (isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                allPaths[currentPathIndexFromMouse].points.push({ x: currentX, y: currentY });
                console.log(allPaths[currentPathIndexFromMouse]);
                drawPathIncrementallyFromMouse();
                if (allPaths[currentPathIndexFromMouse].points.length >= 3) {
                    currentTripletIndexFromMouse++;
                }
            }
        }
    }

    function mouseUpEventListener(e) {
        console.log('mouseup');
        if (context) {
            if (isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                allPaths[currentPathIndexFromMouse].points.push({ x: currentX, y: currentY });
                drawPathIncrementallyFromMouse(allPaths[currentPathIndexFromMouse], currentTripletIndexFromMouse, currentPath2DObjectFromMouse);

                console.log(allPaths);
                currentPathIndexFromMouse++;
                currentTripletIndexFromMouse = 0;
                currentPath2DObjectFromMouse = new Path2D();
                setIsDrawing(false);
            }
        }
    }

    function scaleAllPathsAndRedrawAllCurves(scaleX, scaleY) {
        console.log(allPaths);
        let newAllPaths = [];
        for (let currentPathIndex = 0; currentPathIndex < allPaths.length; currentPathIndex++) {
            const serializedPath = allPaths[currentPathIndex];
            const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));
            let path2D = new Path2D();

            let newSerializedPath = { points: scaledPoints, lineWidth: serializedPath.lineWidth, strokeStyle: serializedPath.strokeStyle, path2DObject: path2D, isPathClosed: false };

            if (scaledPoints.length >= 3) {
                for (let currentTripletIndex = 0; currentTripletIndex <= scaledPoints.length - 3; currentTripletIndex++) {
                    context.beginPath();
                    context.lineWidth = serializedPath.lineWidth;
                    context.strokeStyle = serializedPath.strokeStyle;

                    const firstMidpoint = calcMidpoint(scaledPoints[currentTripletIndex], scaledPoints[currentTripletIndex + 1]);
                    const secondMidpoint = calcMidpoint(scaledPoints[currentTripletIndex + 1], scaledPoints[currentTripletIndex + 2]);

                    context.moveTo(firstMidpoint.x, firstMidpoint.y);
                    context.quadraticCurveTo(scaledPoints[currentTripletIndex + 1].x, scaledPoints[currentTripletIndex + 1].y, secondMidpoint.x, secondMidpoint.y);


                    // The path2d object is just for record keeping of the points. I don't actually use it to draw since it reduces resolution for some reason.
                    path2D.moveTo(firstMidpoint.x, firstMidpoint.y);
                    path2D.quadraticCurveTo(scaledPoints[currentTripletIndex + 1].x, scaledPoints[currentTripletIndex + 1].y, secondMidpoint.x, secondMidpoint.y);

                    context.stroke();
                }
            }

            if (calcDistance(scaledPoints[0], scaledPoints[scaledPoints.length - 1]) < CLOSE_PATH_RADIUS) {
                path2D.closePath();
                newSerializedPath.isPathClosed = true;
            }

            newAllPaths.push(newSerializedPath);
        }

        allPaths = newAllPaths;
    }


    function windowResizeListener(e) {
        if (drawingCanvas) {
            drawingCanvas.height = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("height"), 10);
            drawingCanvas.width = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("width"), 10);

            console.log("HERE");
            console.log(getOldCanvasWidth(), getOldCanvasHeight());
            console.log(drawingCanvas.width, drawingCanvas.height);
            const xScale = drawingCanvas.width / getOldCanvasWidth();
            const yScale = drawingCanvas.height / getOldCanvasHeight();
            console.log(xScale, yScale);
            scaleAllPathsAndRedrawAllCurves(xScale, yScale);
            setOldCanvasWidth(drawingCanvas.width);
            setOldCanvasHeight(drawingCanvas.height);
        }
    }

    if (drawingCanvas) {
        if (selectedPaletteOption === 'color-picker') {
            drawingCanvas.removeEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.removeEventListener("mousemove", mouseMoveEventListener);
            window.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener)
            // Do nothing for drawing, and remove event listeners
        } else {
            drawingCanvas.addEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.addEventListener("mousemove", mouseMoveEventListener);
            window.addEventListener("mouseup", mouseUpEventListener);
            window.addEventListener("resize", windowResizeListener)
        }
    }

    return () => {
        if (drawingCanvas) {
            drawingCanvas.removeEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.removeEventListener("mousemove", mouseMoveEventListener);
            window.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener)
        }
    }
}