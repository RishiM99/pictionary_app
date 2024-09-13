import { setOldCanvasWidth, setOldCanvasHeight, getOldCanvasHeight, getOldCanvasWidth } from './CanvasResizingHelper.js';


export let allPaths = [];
export let currentPathIndexFromMouse = 0;
export let currentPath2DObjectFromMouse = new Path2D();
export let currentTripletIndexFromMouse = 0;

export function setUpDrawingForCanvas({ drawingCanvasRef, currentColorClass, currentDrawStrokeSize, setIsDrawing, isDrawing, selectedPaletteOption, currentEraseStrokeSize }) {
    const drawingCanvas = drawingCanvasRef?.current;
    const context = drawingCanvas?.getContext("2d");

    function calcMidpoint(point1, point2) {
        return { x: 0.5 * point1.x + 0.5 * point2.x, y: 0.5 * point1.y + 0.5 * point2.y };
    }

    function drawPathIncrementally(serializedPath, currentTripletIndex, path2DObject) {
        if (serializedPath.points.length >= 3) {
            console.log(serializedPath);
            console.log(currentTripletIndex);
            const { lineWidth, strokeStyle, points } = serializedPath;
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;

            const firstMidpoint = calcMidpoint(points[currentTripletIndex], points[currentTripletIndex + 1])
            console.log(currentTripletIndex);
            console.log(currentPathIndexFromMouse);
            console.log(allPaths);
            const secondMidpoint = calcMidpoint(points[currentTripletIndex + 1], points[currentTripletIndex + 2])
            path2DObject.moveTo(firstMidpoint.x, firstMidpoint.y);
            path2DObject.quadraticCurveTo(points[currentTripletIndex + 1].x, points[currentTripletIndex + 1].y, secondMidpoint.x, secondMidpoint.y);

            context.stroke(path2DObject);
        }
    }

    function drawFullPath(serializedPath, path2DObject) {
        const { lineWidth, strokeStyle } = serializedPath;
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;

        for (let currentTripletIndex = 0; currentTripletIndex <= serializedPath.points.length - 3; currentTripletIndex++) {
            const path2DObject = new Path2D();
            drawPathIncrementally(serializedPath, currentTripletIndex, path2DObject);
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
            allPaths.push({ points: [{ x: currentX, y: currentY }], lineWidth, strokeStyle });
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
                if (allPaths[currentPathIndexFromMouse].points.length >= 3) {
                    drawPathIncrementally(allPaths[currentPathIndexFromMouse], currentTripletIndexFromMouse, currentPath2DObjectFromMouse);
                    currentTripletIndexFromMouse++;
                }
            }
        }
    }

    function mouseUpEventListener(e) {
        console.log('mouseup');
        if (context) {
            if (isDrawing) {
                if (allPaths[currentPathIndexFromMouse].points.length >= 3) {
                    const currentX = e.offsetX;
                    const currentY = e.offsetY;
                    console.log(allPaths[currentPathIndexFromMouse]);
                    allPaths[currentPathIndexFromMouse].points.push({ x: currentX, y: currentY });
                    drawPathIncrementally(allPaths[currentPathIndexFromMouse], currentTripletIndexFromMouse, currentPath2DObjectFromMouse);

                    console.log(allPaths);
                    currentPathIndexFromMouse++;
                    currentTripletIndexFromMouse = 0;
                    currentPath2DObjectFromMouse = new Path2D();
                    setIsDrawing(false);
                }
            }
        }
    }

    function redrawAllCurves() {
        console.log(allPaths);
        for (let currentPathIndex = 0; currentPathIndex < allPaths.length; currentPathIndex++) {
            drawFullPath(allPaths[currentPathIndex]);
        }
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
            context.scale(xScale, yScale);
            redrawAllCurves();
            context.scale(1 / xScale, 1 / yScale);
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