import { setOldCanvasWidth, setOldCanvasHeight, getOldCanvasHeight, getOldCanvasWidth } from './CanvasResizingHelper.js';
import getSocket from './socket.ts';


let allPaths = {};
let currentTripletIndexFromMouse = 0;
let drawingCanvas = null;
let context = null;
let currentColorClass = null;
let currentDrawStrokeSize = null;
let currentEraseStrokeSize = null;
let setIsDrawing = null;
let isDrawing = null;
let selectedPaletteOption = null;
let currentPathUUIDFromMouse = null;

// How often to push updates of drawing
const FREQUENCY_OF_DRAWING_UPDATES = 3;
let diffFromPreviousAllPaths = {};
let updatesSinceLastSync = 0;
const socket = getSocket();


function calcMidpoint(point1, point2) {
    return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
}


// Draws remainder of path from tripletStartIndex to end of serializedPath.points
function drawRemainderOfPath(serializedPath, tripletStartIndex) {
    const { lineWidth, strokeStyle, points } = serializedPath;
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;

    context.beginPath();


    for (let currentTripletIndex = tripletStartIndex; currentTripletIndex <= points.length - 3; currentTripletIndex++) {
        const firstMidpoint = calcMidpoint(points[currentTripletIndex], points[currentTripletIndex + 1]);
        context.moveTo(firstMidpoint.x, firstMidpoint.y);
        const nextMidpoint = calcMidpoint(points[currentTripletIndex + 1], points[currentTripletIndex + 2]);

        context.quadraticCurveTo(points[currentTripletIndex + 1].x, points[currentTripletIndex + 1].y, nextMidpoint.x, nextMidpoint.y);
    }
    context.stroke();
}


function mouseDownEventListener(e) {
    if (context) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        console.log(currentColorClass);

        const lineWidth = selectedPaletteOption === 'eraser' ? currentEraseStrokeSize : currentDrawStrokeSize;
        const strokeStyle = selectedPaletteOption === 'eraser' ? 'white' : getComputedStyle(document.querySelector(`.${currentColorClass}`))["background-color"];

        const uuid = crypto.randomUUID();
        currentTripletIndexFromMouse = 0;
        allPaths[uuid] = { points: [{ x: currentX, y: currentY }], lineWidth, strokeStyle };
        currentPathUUIDFromMouse = uuid;
        setIsDrawing(true);
    }
}

// function trackDiffsAndPushUpdates(pathUUID, point) {
//     if (updatesSinceLastSync === FREQUENCY_OF_DRAWING_UPDATES) {
//         socket.emit('broadcast-drawing-paths-diff', { diff: diffFromPreviousAllPaths, x: getOldCanvasWidth(), y: getOldCanvasHeight() });
//         updatesSinceLastSync = 0;
//         diffFromPreviousAllPaths = {};
//     }

//     if (pathUUID in diffFromPreviousAllPaths) {
//         diffFromPreviousAllPaths[pathUUID].push(point);
//     } else {
//         diffFromPreviousAllPaths[pathUUID] = [point];
//     }

//     updatesSinceLastSync++;
// }

// function addDrawingPathsDiffEventListener() {
//     socket.on('updated-drawing-paths-diff', (msg) => {
//         const pathsDiff = msg.diff;
//         const { x, y } = msg;
//         for (const [uuid, serializedPath] of Object.entries(pathsDiff)) {

//             allPaths
//         });

//     if (updatesSinceLastSync === FREQUENCY_OF_DRAWING_UPDATES) {
//         socket.emit('broadcast-drawing-paths-diff', diffFromPreviousAllPaths);
//         updatesSinceLastSync = 0;
//         diffFromPreviousAllPaths = {};
//     }

//     if (pathUUID in diffFromPreviousAllPaths) {
//         diffFromPreviousAllPaths[pathUUID].push(point);
//     } else {
//         diffFromPreviousAllPaths[pathUUID] = [point];
//     }

//     updatesSinceLastSync++;
// }

function mouseMoveEventListener(e) {
    if (context) {
        if (isDrawing) {
            const currentX = e.offsetX;
            const currentY = e.offsetY;
            allPaths[currentPathUUIDFromMouse].points.push({ x: currentX, y: currentY });
            drawRemainderOfPath(allPaths[currentPathUUIDFromMouse], currentTripletIndexFromMouse);

            if (allPaths[currentPathUUIDFromMouse].points.length >= 3) {
                currentTripletIndexFromMouse++;
            }

            //trackDiffsAndPushUpdates(this.currentPathUUIDFromMouse, { x: currentX, y: currentY });
        }
    }
}

function mouseUpEventListener(e) {
    if (context) {
        if (isDrawing) {
            const currentX = e.offsetX;
            const currentY = e.offsetY;
            allPaths[currentPathUUIDFromMouse].points.push({ x: currentX, y: currentY });
            drawRemainderOfPath(allPaths[currentPathUUIDFromMouse], currentTripletIndexFromMouse);

            setIsDrawing(false);

            //trackDiffsAndPushUpdates(this.currentPathUUIDFromMouse, { x: currentX, y: currentY });
        }
    }
}

// function redrawAllCurves() {
//     for (const [uuid, serializedPath] of Object.entries(allPaths)) {
//         drawRemainderOfPath(newSerializedPath, 0);
//     }
// }

// function scaleAllPathsInPlace(scaleX, scaleY) {
//     for (const [uuid, serializedPath] of Object.entries(allPaths)) {
//         const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));
//         serializedPaths.points = scaledPoints;
//     }
// }

function scaleAllPathsAndRedrawAllCurves(scaleX, scaleY) {
    let newAllPaths = {};
    for (const [uuid, serializedPath] of Object.entries(allPaths)) {
        const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));

        let newSerializedPath = { points: scaledPoints, lineWidth: serializedPath.lineWidth, strokeStyle: serializedPath.strokeStyle };

        drawRemainderOfPath(newSerializedPath, 0, true);

        newAllPaths[crypto.randomUUID()] = newSerializedPath;
    }

    allPaths = newAllPaths;
}


function windowResizeListener(e) {

    if (drawingCanvas) {
        drawingCanvas.height = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("height"), 10);
        drawingCanvas.width = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("width"), 10);

        const xScale = drawingCanvas.width / getOldCanvasWidth();
        const yScale = drawingCanvas.height / getOldCanvasHeight();
        scaleAllPathsAndRedrawAllCurves(xScale, yScale);
        setOldCanvasWidth(drawingCanvas.width);
        setOldCanvasHeight(drawingCanvas.height);
    }
}


function setUpDrawingForCanvas({ drawingCanvasRef, currColorClass, currDrawStrokeSize, setIsDrawingFn, isDrawingVar, selectedPaletteOptionVar, currEraseStrokeSize }) {

    drawingCanvas = drawingCanvasRef?.current;
    context = drawingCanvas?.getContext("2d");
    currentColorClass = currColorClass;
    currentDrawStrokeSize = currDrawStrokeSize;
    currentEraseStrokeSize = currEraseStrokeSize;
    setIsDrawing = setIsDrawingFn;
    isDrawing = isDrawingVar;
    selectedPaletteOption = selectedPaletteOptionVar;

    if (drawingCanvas) {
        if (selectedPaletteOption === 'color-picker') {
            drawingCanvas.removeEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.removeEventListener("mousemove", mouseMoveEventListener);
            drawingCanvas.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener)
            // Do nothing for drawing, and remove event listeners
        } else {
            drawingCanvas.addEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.addEventListener("mousemove", mouseMoveEventListener);
            drawingCanvas.addEventListener("mouseup", mouseUpEventListener);
            window.addEventListener("resize", windowResizeListener)
        }
    }

    return () => {
        if (drawingCanvas) {
            drawingCanvas.removeEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.removeEventListener("mousemove", mouseMoveEventListener);
            drawingCanvas.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener)
        }
    }
}


export default setUpDrawingForCanvas;



// const CLOSE_PATH_RADIUS = 10;
// const MIN_POINTS_IN_CLOSED_PATH = 30;


