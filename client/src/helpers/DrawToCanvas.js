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
let paletteRef = null;
let paletteBoundingRect = null;
let drawingCanvasBoundingRect = null;
let cursor = null;

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
        const firstPoint = { x: points[currentTripletIndex].x - drawingCanvasBoundingRect.left, y: points[currentTripletIndex].y - drawingCanvasBoundingRect.top };
        const secondPoint = { x: points[currentTripletIndex + 1].x - drawingCanvasBoundingRect.left, y: points[currentTripletIndex + 1].y - drawingCanvasBoundingRect.top };
        const thirdPoint = { x: points[currentTripletIndex + 2].x - drawingCanvasBoundingRect.left, y: points[currentTripletIndex + 2].y - drawingCanvasBoundingRect.top };

        const firstMidpoint = calcMidpoint(firstPoint, secondPoint);
        context.moveTo(firstMidpoint.x, firstMidpoint.y);
        const nextMidpoint = calcMidpoint(secondPoint, thirdPoint);

        context.quadraticCurveTo(secondPoint.x, secondPoint.y, nextMidpoint.x, nextMidpoint.y);
    }
    context.stroke();
}


function isPointOutsideOfCanvas(point) {
    return (point.x <= drawingCanvasBoundingRect.left || point.x >= drawingCanvasBoundingRect.right || point.y <= drawingCanvasBoundingRect.top || point.y >= drawingCanvasBoundingRect.bottom);
}

function isPointUnderPalette(point) {
    return (point.x >= paletteBoundingRect.left && point.x <= paletteBoundingRect.right && point.y >= paletteBoundingRect.top && point.y <= paletteBoundingRect.bottom);
}


function mouseDownEventListener(e) {

    if (isPointUnderPalette({ x: e.clientX, y: e.clientY }) || isPointOutsideOfCanvas({ x: e.clientX, y: e.clientY })) {
        setIsDrawing(false);
    }
    console.log(currentColorClass);

    const lineWidth = selectedPaletteOption === 'eraser' ? currentEraseStrokeSize : currentDrawStrokeSize;
    const strokeStyle = selectedPaletteOption === 'eraser' ? 'white' : getComputedStyle(document.querySelector(`.${currentColorClass}`))["background-color"];

    const uuid = crypto.randomUUID();
    currentTripletIndexFromMouse = 0;
    allPaths[uuid] = { points: [{ x: e.clientX, y: e.clientY }], lineWidth, strokeStyle };
    currentPathUUIDFromMouse = uuid;
    setIsDrawing(true);
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
    if (isDrawing) {
        if (isPointUnderPalette({ x: e.clientX, y: e.clientY }) || isPointOutsideOfCanvas({ x: e.clientX, y: e.clientY })) {
            setIsDrawing(false);
        }
        allPaths[currentPathUUIDFromMouse].points.push({ x: e.clientX, y: e.clientY });
        drawRemainderOfPath(allPaths[currentPathUUIDFromMouse], currentTripletIndexFromMouse);

        if (allPaths[currentPathUUIDFromMouse].points.length >= 3) {
            currentTripletIndexFromMouse++;
        }

        //trackDiffsAndPushUpdates(this.currentPathUUIDFromMouse, { x: currentX, y: currentY });
    }

    //Move cursor anyways
    if (!isPointOutsideOfCanvas({ x: e.clientX, y: e.clientY })) {
        cursor.style.left = `${e.offsetX}px`;
        cursor.style.top = `${e.offsetY}px`;
    }
}

function mouseUpEventListener(e) {
    if (isDrawing) {
        if (isPointUnderPalette({ x: e.clientX, y: e.clientY }) || isPointOutsideOfCanvas({ x: e.clientX, y: e.clientY })) {
            setIsDrawing(false);
        }
        allPaths[currentPathUUIDFromMouse].points.push({ x: e.clientX, y: e.clientY });
        drawRemainderOfPath(allPaths[currentPathUUIDFromMouse], currentTripletIndexFromMouse);

        setIsDrawing(false);

        //trackDiffsAndPushUpdates(this.currentPathUUIDFromMouse, { x: currentX, y: currentY });
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
    drawingCanvas.height = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("height"), 10);
    drawingCanvas.width = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("width"), 10);

    const xScale = drawingCanvas.width / getOldCanvasWidth();
    const yScale = drawingCanvas.height / getOldCanvasHeight();
    scaleAllPathsAndRedrawAllCurves(xScale, yScale);
    setOldCanvasWidth(drawingCanvas.width);
    setOldCanvasHeight(drawingCanvas.height);
}


function setUpDrawingForCanvas({ drawingCanvasRef, currColorClass, currDrawStrokeSize, setIsDrawingFn, isDrawingVar, selectedPaletteOptionVar, currEraseStrokeSize, paletteRefVar, cursorRef }) {

    cursor = cursorRef.current;
    console.log(`cursor ref ${cursorRef}`);
    drawingCanvas = drawingCanvasRef.current;
    context = drawingCanvas.getContext("2d");
    currentColorClass = currColorClass;
    currentDrawStrokeSize = currDrawStrokeSize;
    currentEraseStrokeSize = currEraseStrokeSize;
    setIsDrawing = setIsDrawingFn;
    isDrawing = isDrawingVar;
    selectedPaletteOption = selectedPaletteOptionVar;
    paletteRef = paletteRefVar;

    paletteBoundingRect = paletteRef.current.getBoundingClientRect();
    drawingCanvasBoundingRect = drawingCanvas.getBoundingClientRect();

    if (drawingCanvas) {
        if (selectedPaletteOption === 'color-picker') {
            window.removeEventListener("mousedown", mouseDownEventListener);
            window.removeEventListener("mousemove", mouseMoveEventListener);
            window.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener)
            // Do nothing for drawing, and remove event listeners
        } else {
            window.addEventListener("mousedown", mouseDownEventListener);
            window.addEventListener("mousemove", mouseMoveEventListener);
            window.addEventListener("mouseup", mouseUpEventListener);
            window.addEventListener("resize", windowResizeListener)
        }
    }

    return () => {
        if (drawingCanvas) {
            window.removeEventListener("mousedown", mouseDownEventListener);
            window.removeEventListener("mousemove", mouseMoveEventListener);
            window.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener)
        }
    }
}


export default setUpDrawingForCanvas;



// const CLOSE_PATH_RADIUS = 10;
// const MIN_POINTS_IN_CLOSED_PATH = 30;


