export let allPaths = [[]];
export let currentPathIndex = 0;
export let currentTripletIndex = 0;

export function setUpDrawingForCanvas({drawingCanvasRef, currentColorClass, currentDrawStrokeSize, setIsDrawing, isDrawing}) {
    const drawingCanvas = drawingCanvasRef?.current;

    function calcMidpoint(point1, point2) {
        return {x: 0.5*point1.x + 0.5*point2.x, y: 0.5*point1.y + 0.5*point2.y};
    }

    function drawQuadraticBezierCurve() {
        const context = drawingCanvas.getContext("2d");
        context.beginPath();
        context.strokeStyle = getComputedStyle(document.querySelector(`.${currentColorClass}`))["background-color"];
        context.lineWidth = currentDrawStrokeSize;
        const currentPath = allPaths[currentPathIndex];
        const firstMidpoint = calcMidpoint(currentPath[currentTripletIndex], currentPath[currentTripletIndex+1])
        const secondMidpoint = calcMidpoint(currentPath[currentTripletIndex+1], currentPath[currentTripletIndex+2])
        context.moveTo(firstMidpoint.x, firstMidpoint.y);
        context.quadraticCurveTo(currentPath[currentTripletIndex+1].x, currentPath[currentTripletIndex+1].y, secondMidpoint.x, secondMidpoint.y);
        context.stroke();
    }

    function mouseDownEventListener(e) {
        if (drawingCanvas) {
            console.log(e);
            const currentX = e.offsetX;
            const currentY = e.offsetY;
            allPaths[currentPathIndex].push({x: currentX, y: currentY});
            setIsDrawing(true);
        }
    }

    function mouseMoveEventListener(e) {
        if (drawingCanvas) {
            if (isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                allPaths[currentPathIndex].push({x: currentX, y: currentY});

                if (allPaths[currentPathIndex].length >= 3) {
                    drawQuadraticBezierCurve();
                    currentTripletIndex += 1;
                }
            }
        }
    }

    function mouseUpEventListener(e) {
        if (drawingCanvas) {
            if (isDrawing) {
                const currentX = e.offsetX;
                const currentY = e.offsetY;
                allPaths[currentPathIndex].push({x: currentX, y: currentY});
                if (allPaths[currentPathIndex].length >= 3) {
                    drawQuadraticBezierCurve();
                    currentTripletIndex += 1;
                    currentTripletIndex = 0;
                }
                allPaths.push([]);
                console.log(allPaths);
                currentPathIndex++;
                setIsDrawing(false);
            }
        }
    }

    if (drawingCanvas) {
        drawingCanvas.addEventListener("mousedown", mouseDownEventListener);
        drawingCanvas.addEventListener("mousemove", mouseMoveEventListener);
        window.addEventListener("mouseup", mouseUpEventListener);
    }

    return () => {
        if (drawingCanvas) {
            drawingCanvas.removeEventListener("mousedown", mouseDownEventListener);
            drawingCanvas.removeEventListener("mousemove", mouseMoveEventListener);
            window.removeEventListener("mouseup", mouseUpEventListener);
            }
        }
}