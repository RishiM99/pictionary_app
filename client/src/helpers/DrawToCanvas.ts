import { setCurrentCanvasWidth, setCurrentCanvasHeight, getCurrentCanvasHeight, getCurrentCanvasWidth, setCurrentMousePosition, getCurrentMousePosition } from './StateStorageHelper.ts';
import { Color, convertColorToString, PaletteOption, StrokeSize } from './Enums.ts';
import getSocket from './socket.ts';
import { StrokeInfo } from './StrokeInfoMapping.ts';
import { Point, SerializedPath, StrPoint, UUIDandSerializedPath } from './Types.ts';
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
let drawingCanvasBoundingRect: DOMRect = null;
let cursor: HTMLDivElement = null;
let drawStrokePickerBoundingRect: DOMRect = null;
let eraseStrokePickerBoundingRect: DOMRect = null;
let colorPickerBoundingRect: DOMRect = null;
let showColorPicker: boolean = null;
let showDrawStrokePicker: boolean = null;
let showEraseStrokePicker: boolean = null;
let roomId: string = null;
let cursorWidth: number = null;
let cursorHeight: number = null;

// How often to push updates of drawing
const FREQUENCY_OF_DRAWING_UPDATES = 3;
let diffFromPreviousAllPaths: Map<any, SerializedPath> = new Map<any, SerializedPath>();
let updatesSinceLastSync = 0;
const socket = getSocket();


function calcMidpoint(point1, point2) {
    return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
}

function convertClientXYToOffsetXY(clientXY: Point): Point {
    return { x: clientXY.x - drawingCanvasBoundingRect.left, y: clientXY.y - drawingCanvasBoundingRect.top };
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


function isPointOutsideOfCanvas(point) {
    return (point.x < cursorWidth / 2 || point.x >= (drawingCanvasBoundingRect.width - cursorWidth / 2) || point.y < cursorHeight / 2 || point.y >= (drawingCanvasBoundingRect.height - cursorHeight / 2));
}

function isPointUnderPalette(point) {
    return (point.x >= (paletteBoundingRect.left - drawingCanvasBoundingRect.left - cursorWidth / 2) && point.x <= (paletteBoundingRect.right - drawingCanvasBoundingRect.left + cursorWidth / 2) && point.y >= (paletteBoundingRect.top - drawingCanvasBoundingRect.top - cursorHeight / 2) && point.y <= (paletteBoundingRect.bottom - drawingCanvasBoundingRect.top + cursorHeight / 2));
}

function isPointUnderColorPicker(point) {
    return showColorPicker && colorPickerBoundingRect != null && (point.x >= (colorPickerBoundingRect.left - drawingCanvasBoundingRect.left - cursorWidth / 2) && point.x <= (colorPickerBoundingRect.right - drawingCanvasBoundingRect.left + cursorWidth / 2) && point.y >= (colorPickerBoundingRect.top - drawingCanvasBoundingRect.top - cursorHeight / 2) && point.y <= (colorPickerBoundingRect.bottom - drawingCanvasBoundingRect.top + cursorHeight / 2));
}

function isPointUnderDrawStrokePicker(point) {
    return showDrawStrokePicker && drawStrokePickerBoundingRect != null && (point.x >= (drawStrokePickerBoundingRect.left - drawingCanvasBoundingRect.left - cursorWidth / 2) && point.x <= (drawStrokePickerBoundingRect.right - drawingCanvasBoundingRect.left + cursorWidth / 2) && point.y >= (drawStrokePickerBoundingRect.top - drawingCanvasBoundingRect.top - cursorHeight / 2) && point.y <= (drawStrokePickerBoundingRect.bottom - drawingCanvasBoundingRect.top + cursorHeight / 2));
}

function isPointUnderEraseStrokePicker(point) {
    return showEraseStrokePicker && eraseStrokePickerBoundingRect != null && (point.x >= (eraseStrokePickerBoundingRect.left - drawingCanvasBoundingRect.left - cursorWidth / 2) && point.x <= (eraseStrokePickerBoundingRect.right - drawingCanvasBoundingRect.left + cursorWidth / 2) && point.y >= (eraseStrokePickerBoundingRect.top - drawingCanvasBoundingRect.top - cursorHeight / 2) && point.y <= (eraseStrokePickerBoundingRect.bottom - drawingCanvasBoundingRect.top + cursorHeight / 2));
}


function convertPathsDiffMapToArray(pathsDiffMap: Map<any, SerializedPath>): UUIDandSerializedPath[] {
    return [...pathsDiffMap].map(([uuid, serializedPath]) => ({ 'uuid': uuid, 'serializedPath': serializedPath }));
}

function convertPathsDiffArrayToMap(pathsDiffArr: UUIDandSerializedPath[]): Map<any, SerializedPath> {
    const arrToConvertToMap = pathsDiffArr.map((uuidAndSerializedPath) => [uuidAndSerializedPath.uuid, uuidAndSerializedPath.serializedPath]) as [any, SerializedPath][];
    return new Map(arrToConvertToMap);
}

function trackDiffsAndPushUpdates(pathUUID, point) {
    if (updatesSinceLastSync === FREQUENCY_OF_DRAWING_UPDATES) {
        console.log(`sentmap`);
        console.log(diffFromPreviousAllPaths);
        socket.emit('drawingPathsDiffFromClient', { pathsDiff: convertPathsDiffMapToArray(diffFromPreviousAllPaths), width: getCurrentCanvasWidth(), height: getCurrentCanvasHeight(), roomId });
        updatesSinceLastSync = 0;
        diffFromPreviousAllPaths = new Map();
    }

    if (diffFromPreviousAllPaths.has(pathUUID)) {
        diffFromPreviousAllPaths.get(pathUUID).points.push(point);
    }
    if (!(diffFromPreviousAllPaths.has(pathUUID))) {
        const lineWidth = allPaths.get(pathUUID).lineWidth;
        const strokeStyle = allPaths.get(pathUUID).strokeStyle;
        diffFromPreviousAllPaths.set(pathUUID, { points: [point], lineWidth, strokeStyle });
    }

    updatesSinceLastSync++;
}

function drawingPathsDiffEventListener(msg: BroadcastDrawingPathsDiffType) {
    const { pathsDiff, width, height } = msg;
    const pathsDiffMap = convertPathsDiffArrayToMap(pathsDiff);

    const xScale = getCurrentCanvasWidth() / width;
    const yScale = getCurrentCanvasHeight() / height;

    pathsDiffMap.forEach((serializedPath, uuid) => {
        serializedPath.points = serializedPath.points.map(((point) => ({ x: point.x * xScale, y: point.y * yScale })));
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

function setLeftAndTopForCursor() {
    const mousePosition = getCurrentMousePosition();
    if (mousePosition != null) {
        cursor.style.left = `${mousePosition.x - cursorWidth / 2}px`;
        cursor.style.top = `${mousePosition.y - cursorHeight / 2}px`;
    }
}

function mouseDownEventListener(e) {
    const clientXY = { x: Number(e.clientX), y: Number(e.clientY) };
    const offsetXY = convertClientXYToOffsetXY(clientXY);

    if (!isPointUnderPalette(offsetXY) && !isPointOutsideOfCanvas(offsetXY) && !isPointUnderColorPicker(offsetXY) && !isPointUnderDrawStrokePicker(offsetXY) && !isPointUnderEraseStrokePicker(offsetXY)) {
        const lineWidth = selectedPaletteOption === PaletteOption.Eraser ? StrokeInfo.get(currentEraseStrokeSize).pixelSize : StrokeInfo.get(currentDrawStrokeSize).pixelSize;
        const strokeStyle = selectedPaletteOption === PaletteOption.Eraser ? 'white' : getComputedStyle(document.querySelector(`.${convertColorToString(currentColor)}`))["background-color"];

        const uuid = crypto.randomUUID();
        currentTripletIndexFromMouse = 0;
        allPaths.set(uuid, { points: [offsetXY], lineWidth, strokeStyle });
        currentPathUUIDFromMouse = uuid;
        setIsDrawing(true);
        trackDiffsAndPushUpdates(uuid, offsetXY);
    }
}

function mouseMoveEventListener(e) {
    const clientXY = { x: Number(e.clientX), y: Number(e.clientY) };
    const offsetXY = convertClientXYToOffsetXY(clientXY);

    if (isDrawing) {
        allPaths.get(currentPathUUIDFromMouse).points.push(offsetXY);
        drawRemainderOfPath(allPaths.get(currentPathUUIDFromMouse), currentTripletIndexFromMouse);

        if (allPaths.get(currentPathUUIDFromMouse).points.length >= 3) {
            currentTripletIndexFromMouse++;
        }

        trackDiffsAndPushUpdates(currentPathUUIDFromMouse, offsetXY);
    }

    //Move cursor anyways
    if (isPointOutsideOfCanvas(offsetXY) || isPointUnderPalette(offsetXY) || isPointUnderColorPicker(offsetXY) || isPointUnderDrawStrokePicker(offsetXY) || isPointUnderEraseStrokePicker(offsetXY)) {
        cursor.style.visibility = "hidden";
    } else {
        cursor.style.visibility = "visible";
        setCurrentMousePosition(offsetXY);
        setLeftAndTopForCursor();
    }
}

function mouseUpEventListener(e) {
    if (isDrawing) {
        const clientXY = { x: Number(e.clientX), y: Number(e.clientY) };
        const offsetXY = convertClientXYToOffsetXY(clientXY);

        allPaths.get(currentPathUUIDFromMouse).points.push(offsetXY);
        drawRemainderOfPath(allPaths.get(currentPathUUIDFromMouse), currentTripletIndexFromMouse);

        setIsDrawing(false);

        trackDiffsAndPushUpdates(currentPathUUIDFromMouse, offsetXY);
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

        const newUUID = crypto.randomUUID();

        newAllPaths.set(newUUID, newSerializedPath);

        if (uuid === currentPathUUIDFromMouse) {
            currentPathUUIDFromMouse = uuid;
        }
    }

    allPaths = newAllPaths;
}


function windowResizeListener(e) {
    console.log("window resize being called");
    drawingCanvas.height = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("height"), 10);
    drawingCanvas.width = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("width"), 10);
    console.log(drawingCanvas.height);
    console.log(drawingCanvas.width);
    console.log(getCurrentCanvasHeight());

    const xScale = drawingCanvas.width / getCurrentCanvasWidth();
    const yScale = drawingCanvas.height / getCurrentCanvasHeight();
    scaleAllPathsAndRedrawAllCurves(xScale, yScale);
    setCurrentCanvasWidth(drawingCanvas.width);
    setCurrentCanvasHeight(drawingCanvas.height);

    const currentMousePosition = getCurrentMousePosition();
    const newCurrentMousePosition = { x: currentMousePosition.x * xScale, y: currentMousePosition.y * yScale };

    setCurrentMousePosition(newCurrentMousePosition);

    // Change position of cursor to account for changed room name header and member sidebar sizes
    setLeftAndTopForCursor();

}

function onMouseDownClearCanvasButton(e: Event) {
    (e.currentTarget as HTMLDivElement).style.height = "30px";
    (e.currentTarget as HTMLDivElement).style.width = "30px";
}

function onMouseUpClearCanvasButton(e: Event) {
    (e.currentTarget as HTMLDivElement).style.height = "40px";
    (e.currentTarget as HTMLDivElement).style.width = "40px";
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
    cursorRef: React.MutableRefObject<HTMLDivElement>,
    drawStrokePickerRef: React.MutableRefObject<HTMLDivElement>,
    eraseStrokePickerRef: React.MutableRefObject<HTMLDivElement>,
    colorPickerRef: React.MutableRefObject<HTMLDivElement>,
    showColorPickerVar: boolean,
    showEraseStrokePickerVar: boolean,
    showDrawStrokePickerVar: boolean,
    roomIdVar: string,
    clearCanvasButtonRefVar: React.MutableRefObject<HTMLDivElement>,
}


function setUpDrawingForCanvas({ drawingCanvasRef, currColor, currDrawStrokeSize, setIsDrawingFn, isDrawingVar, selectedPaletteOptionVar, currEraseStrokeSize, paletteRefVar, cursorRef, drawStrokePickerRef, eraseStrokePickerRef, colorPickerRef, showColorPickerVar, showEraseStrokePickerVar, showDrawStrokePickerVar, roomIdVar, clearCanvasButtonRefVar }: SetUpDrawingForCanvasParamsType) {

    cursor = cursorRef.current;
    cursorWidth = parseInt(window.getComputedStyle(cursor).getPropertyValue("width"), 10);
    cursorHeight = parseInt(window.getComputedStyle(cursor).getPropertyValue("height"), 10);
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

    roomId = roomIdVar;

    drawStrokePickerBoundingRect = drawStrokePickerRef?.current?.getBoundingClientRect();
    eraseStrokePickerBoundingRect = eraseStrokePickerRef?.current?.getBoundingClientRect();
    colorPickerBoundingRect = colorPickerRef?.current?.getBoundingClientRect();

    showColorPicker = showColorPickerVar;
    showDrawStrokePicker = showDrawStrokePickerVar;
    showEraseStrokePicker = showEraseStrokePickerVar;

    window.addEventListener("mousedown", mouseDownEventListener);
    window.addEventListener("mousemove", mouseMoveEventListener);
    window.addEventListener("mouseup", mouseUpEventListener);
    window.addEventListener("resize", windowResizeListener);
    socket.on('broadcastDrawingPathsDiff', drawingPathsDiffEventListener);
    console.log(clearCanvasButtonRefVar.current);
    clearCanvasButtonRefVar.current.addEventListener("mousedown", onMouseDownClearCanvasButton);
    clearCanvasButtonRefVar.current.addEventListener("mouseup", onMouseUpClearCanvasButton);

    return () => {
        window.removeEventListener("mousedown", mouseDownEventListener);
        window.removeEventListener("mousemove", mouseMoveEventListener);
        window.removeEventListener("mouseup", mouseUpEventListener);
        window.removeEventListener("resize", windowResizeListener);
        socket.off('broadcastDrawingPathsDiff', drawingPathsDiffEventListener);
        clearCanvasButtonRefVar.current.removeEventListener("mousedown", onMouseDownClearCanvasButton);
        clearCanvasButtonRefVar.current.removeEventListener("mouseup", onMouseUpClearCanvasButton);
    }
}



export default setUpDrawingForCanvas;



// const CLOSE_PATH_RADIUS = 10;
// const MIN_POINTS_IN_CLOSED_PATH = 30;


