import { setOldCanvasWidth, setOldCanvasHeight, getOldCanvasHeight, getOldCanvasWidth } from './CanvasResizingHelper.ts';
import { Color, convertColorToString, PaletteOption, StrokeSize } from './Enums.ts';
import getSocket from './socket.ts';
import { StrokeInfo } from './StrokeInfoMapping.ts';
import assert from 'assert';
import { SerializedPath, UUIDandSerializedPath } from './Types.ts';
import { BroadcastDrawingPathsDiffType } from '../common/SocketEvents.ts';


let allPaths: Map<any, SerializedPath> = new Map();
let currentTripletIndexFromMouse: number = 0;
let drawingCanvas: HTMLCanvasElement = null;
let context: CanvasRenderingContext2D = null;
let currentColor: Color = null;
let currentDrawStrokeSize: StrokeSize = null;
let currentEraseStrokeSize: StrokeSize = null;
let setIsDrawing: React.Dispatch<React.SetStateAction<boolean>> = null;
let isDrawing: boolean = null;
let selectedPaletteOption: PaletteOption = null;
let currentPathUUIDFromMouse = null;
let paletteBoundingRect: DOMRect = null;
let roomNameHeaderHeight: number = null;
let currentPlayersSidebarWidth: number = null;
let drawingCanvasBoundingRect: DOMRect = null;
let cursor: HTMLDivElement = null;
let drawStrokePickerBoundingRect: DOMRect = null;
let eraseStrokePickerBoundingRect: DOMRect = null;
let colorPickerBoundingRect: DOMRect = null;
let showColorPicker: boolean = null;
let showDrawStrokePicker: boolean = null;
let showEraseStrokePicker: boolean = null;
let roomId: string = null;

// How often to push updates of drawing
const FREQUENCY_OF_DRAWING_UPDATES = 3;
let diffFromPreviousAllPaths: Map<any, SerializedPath> = new Map<any, SerializedPath>();
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

function isPointUnderColorPicker(point) {
    return showColorPicker && colorPickerBoundingRect != null && (point.x >= colorPickerBoundingRect.left && point.x <= colorPickerBoundingRect.right && point.y >= colorPickerBoundingRect.top && point.y <= colorPickerBoundingRect.bottom);
}

function isPointUnderDrawStrokePicker(point) {

    return showDrawStrokePicker && drawStrokePickerBoundingRect != null && (point.x >= drawStrokePickerBoundingRect.left && point.x <= drawStrokePickerBoundingRect.right && point.y >= drawStrokePickerBoundingRect.top && point.y <= drawStrokePickerBoundingRect.bottom);
}

function isPointUnderEraseStrokePicker(point) {

    return showEraseStrokePicker && eraseStrokePickerBoundingRect != null && (point.x >= eraseStrokePickerBoundingRect.left && point.x <= eraseStrokePickerBoundingRect.right && point.y >= eraseStrokePickerBoundingRect.top && point.y <= eraseStrokePickerBoundingRect.bottom);
}


function mouseDownEventListener(e) {
    console.log('mousedown');

    if (isPointUnderPalette({ x: e.clientX, y: e.clientY }) || isPointOutsideOfCanvas({ x: e.clientX, y: e.clientY })) {
        setIsDrawing(false);
    }

    const lineWidth = selectedPaletteOption === PaletteOption.Eraser ? StrokeInfo.get(currentEraseStrokeSize).pixelSize : StrokeInfo.get(currentDrawStrokeSize).pixelSize;
    const strokeStyle = selectedPaletteOption === PaletteOption.Eraser ? 'white' : getComputedStyle(document.querySelector(`.${convertColorToString(currentColor)}`))["background-color"];

    const uuid = crypto.randomUUID();
    currentTripletIndexFromMouse = 0;
    allPaths.set(uuid, { points: [{ x: e.clientX, y: e.clientY }], lineWidth, strokeStyle });
    currentPathUUIDFromMouse = uuid;
    setIsDrawing(true);
    trackDiffsAndPushUpdates(uuid, { x: e.clientX, y: e.clientY }, { lineWidth, strokeStyle });
}

function convertPathsDiffMapToArray(pathsDiffMap: Map<any, SerializedPath>): UUIDandSerializedPath[] {
    return [...pathsDiffMap].map(([uuid, serializedPath]) => ({ 'uuid': uuid, 'serializedPath': serializedPath }));
}

function convertPathsDiffArrayToMap(pathsDiffArr: UUIDandSerializedPath[]): Map<any, SerializedPath> {
    const arrToConvertToMap = pathsDiffArr.map((uuidAndSerializedPath) => [uuidAndSerializedPath.uuid, uuidAndSerializedPath.serializedPath]) as [any, SerializedPath][];
    return new Map(arrToConvertToMap);
}

function trackDiffsAndPushUpdates(pathUUID, point, newPathOptions?: { lineWidth: number, strokeStyle: string }) {
    if (updatesSinceLastSync === FREQUENCY_OF_DRAWING_UPDATES) {
        console.log(`sentmap`);
        console.log(diffFromPreviousAllPaths);
        socket.emit('drawingPathsDiffFromClient', { pathsDiff: convertPathsDiffMapToArray(diffFromPreviousAllPaths), width: getOldCanvasWidth(), height: getOldCanvasHeight(), roomId });
        updatesSinceLastSync = 0;
        diffFromPreviousAllPaths = new Map();
    }

    if (diffFromPreviousAllPaths.has(pathUUID)) {
        diffFromPreviousAllPaths.get(pathUUID).points.push(point);
    }
    if (!(diffFromPreviousAllPaths.has(pathUUID))) {
        diffFromPreviousAllPaths.set(pathUUID, { points: [point], lineWidth: 2, strokeStyle: "black" });
    }

    updatesSinceLastSync++;
}

function drawingPathsDiffEventListener(msg: BroadcastDrawingPathsDiffType) {
    const { pathsDiff, width, height } = msg;
    const pathsDiffMap = convertPathsDiffArrayToMap(pathsDiff);
    console.log(`receivedmap`);
    console.log(pathsDiffMap);

    const xScale = getOldCanvasWidth() / width;
    const yScale = getOldCanvasHeight() / height;
    pathsDiffMap.forEach((serializedPath, uuid) => {
        serializedPath.points.map(((point) => ({ x: point.x * xScale, y: point.y * yScale })));
        if (allPaths.has(uuid)) {
            allPaths.get(uuid).points = allPaths.get(uuid).points.concat(serializedPath.points);
            console.log(`allPaths`);
            console.log(allPaths);
            console.log(`allPathslength`);
            console.log(allPaths.get(uuid).points.length);
            //drawRemainderOfPath(allPaths.get(uuid), Math.max(allPaths.get(uuid).points.length - serializedPath.points.length - 1, 0));
            console.log(`triplet start index ${Math.max(allPaths.get(uuid).points.length - serializedPath.points.length - 2, 0)}`)
            drawRemainderOfPath(allPaths.get(uuid), Math.max(allPaths.get(uuid).points.length - serializedPath.points.length - 2, 0));

        } else {
            allPaths.set(uuid, serializedPath);
            drawRemainderOfPath(serializedPath, 0);
        }
    });
}


function mouseMoveEventListener(e) {
    const point = { x: e.clientX, y: e.clientY };
    if (isDrawing) {
        console.log('mousemove');
        allPaths.get(currentPathUUIDFromMouse).points.push(point);
        drawRemainderOfPath(allPaths.get(currentPathUUIDFromMouse), currentTripletIndexFromMouse);

        if (allPaths.get(currentPathUUIDFromMouse).points.length >= 3) {
            currentTripletIndexFromMouse++;
        }

        trackDiffsAndPushUpdates(currentPathUUIDFromMouse, point);
    }

    //Move cursor anyways
    if (isPointOutsideOfCanvas(point) || isPointUnderPalette(point) || isPointUnderColorPicker(point) || isPointUnderDrawStrokePicker(point) || isPointUnderEraseStrokePicker(point)) {
        cursor.style.visibility = "hidden";
    } else {
        cursor.style.visibility = "visible";
        cursor.style.left = `${parseInt(e.clientX, 10) - currentPlayersSidebarWidth - parseInt(window.getComputedStyle(cursor).getPropertyValue("width"), 10) / 2}px`;
        cursor.style.top = `${parseInt(e.clientY, 10) - roomNameHeaderHeight - parseInt(window.getComputedStyle(cursor).getPropertyValue("height"), 10) / 2}px`;
    }
}

function mouseUpEventListener(e) {
    if (isDrawing) {
        if (isPointUnderPalette({ x: e.clientX, y: e.clientY }) || isPointOutsideOfCanvas({ x: e.clientX, y: e.clientY })) {
            setIsDrawing(false);
        }
        allPaths.get(currentPathUUIDFromMouse).points.push({ x: e.clientX, y: e.clientY });
        drawRemainderOfPath(allPaths.get(currentPathUUIDFromMouse), currentTripletIndexFromMouse);

        setIsDrawing(false);

        //trackDiffsAndPushUpdates(currentPathUUIDFromMouse, { x: currentX, y: currentY });
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
    let newAllPaths = new Map();
    for (const [uuid, serializedPath] of allPaths) {
        const scaledPoints = serializedPath.points.map(((point) => ({ x: point.x * scaleX, y: point.y * scaleY })));

        let newSerializedPath = { points: scaledPoints, lineWidth: serializedPath.lineWidth, strokeStyle: serializedPath.strokeStyle };

        drawRemainderOfPath(newSerializedPath, 0);

        newAllPaths.set(crypto.randomUUID(), newSerializedPath);
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

type SetUpDrawingForCanvasParamsType = {
    drawingCanvasRef: React.MutableRefObject<HTMLCanvasElement>,
    currColor: Color,
    currDrawStrokeSize: StrokeSize,
    setIsDrawingFn: React.Dispatch<React.SetStateAction<boolean>>,
    isDrawingVar: boolean,
    selectedPaletteOptionVar: PaletteOption,
    currEraseStrokeSize: StrokeSize,
    paletteRefVar: React.MutableRefObject<HTMLDivElement>,
    roomNameHeaderHeightVar: number,
    currentPlayersSidebarWidthVar: number,
    cursorRef: React.MutableRefObject<HTMLDivElement>,
    drawStrokePickerRef: React.MutableRefObject<HTMLDivElement>,
    eraseStrokePickerRef: React.MutableRefObject<HTMLDivElement>,
    colorPickerRef: React.MutableRefObject<HTMLDivElement>,
    showColorPickerVar: boolean,
    showEraseStrokePickerVar: boolean,
    showDrawStrokePickerVar: boolean,
    roomIdVar: string,
}


function setUpDrawingForCanvas({ drawingCanvasRef, currColor, currDrawStrokeSize, setIsDrawingFn, isDrawingVar, selectedPaletteOptionVar, currEraseStrokeSize, paletteRefVar, cursorRef, drawStrokePickerRef, eraseStrokePickerRef, colorPickerRef, showColorPickerVar, showEraseStrokePickerVar, showDrawStrokePickerVar, roomNameHeaderHeightVar, currentPlayersSidebarWidthVar, roomIdVar }: SetUpDrawingForCanvasParamsType) {

    cursor = cursorRef.current;
    drawingCanvas = drawingCanvasRef.current;
    context = drawingCanvas.getContext("2d");
    currentColor = currColor;
    currentDrawStrokeSize = currDrawStrokeSize;
    currentEraseStrokeSize = currEraseStrokeSize;
    setIsDrawing = setIsDrawingFn;
    isDrawing = isDrawingVar;
    selectedPaletteOption = selectedPaletteOptionVar;

    paletteBoundingRect = paletteRefVar.current.getBoundingClientRect();
    drawingCanvasBoundingRect = drawingCanvas.getBoundingClientRect();
    roomNameHeaderHeight = roomNameHeaderHeightVar;
    currentPlayersSidebarWidth = currentPlayersSidebarWidthVar;

    roomId = roomIdVar;

    drawStrokePickerBoundingRect = drawStrokePickerRef?.current?.getBoundingClientRect();
    eraseStrokePickerBoundingRect = eraseStrokePickerRef?.current?.getBoundingClientRect();
    colorPickerBoundingRect = colorPickerRef?.current?.getBoundingClientRect();

    showColorPicker = showColorPickerVar;
    showDrawStrokePicker = showDrawStrokePickerVar;
    showEraseStrokePicker = showEraseStrokePickerVar;



    if (drawingCanvas) {
        window.addEventListener("mousedown", mouseDownEventListener);
        window.addEventListener("mousemove", mouseMoveEventListener);
        window.addEventListener("mouseup", mouseUpEventListener);
        window.addEventListener("resize", windowResizeListener);
        socket.on('broadcastDrawingPathsDiff', drawingPathsDiffEventListener);
    }

    return () => {
        if (drawingCanvas) {
            window.removeEventListener("mousedown", mouseDownEventListener);
            window.removeEventListener("mousemove", mouseMoveEventListener);
            window.removeEventListener("mouseup", mouseUpEventListener);
            window.removeEventListener("resize", windowResizeListener);
            socket.off('broadcastDrawingPathsDiff', drawingPathsDiffEventListener);
        }
    }
}



export default setUpDrawingForCanvas;



// const CLOSE_PATH_RADIUS = 10;
// const MIN_POINTS_IN_CLOSED_PATH = 30;


