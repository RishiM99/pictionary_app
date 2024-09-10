import React, { useState, useEffect, useRef} from 'react';
import './styles/Room.css';

let quadraticBezierPointGroup = [];


export default function Room() {
    const [messages, setMessages] = useState([
        { user: 'John Doe', text: 'Hello, everyone!' },
        { user: 'Jane Smith', text: 'Hi John! How\'s it going?' },
        { user: 'Emily Johnson', text: 'Hey! Ready for the meeting?' }
    ]);
    
    const colorClassesForColorPicker = [
        "black",
        "gray",
        "purple",
        "blue",
        "teal",
        "green",
        "yellow",
        "orange",
        "brown",
        "red",
        "white"
    ];

    const currentPlayerList = ["Emily Johnson", "Jane Smith", "John Doe"];
    const [newMessage, setNewMessage] = useState('');
    const [currentColorClass, setCurrentColorClass] = useState('black');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [copyUrlClicked, setCopyUrlClicked] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);


    const colorPickerRef = useRef(null);
    const drawingCanvasRef = useRef(null);

    useEffect(() => {
        const drawingCanvas = drawingCanvasRef.current;
        if (drawingCanvas) {
            drawingCanvas.height = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("height"), 10);
            drawingCanvas.width = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("width"), 10);
            console.log(drawingCanvas.height);
            console.log(drawingCanvas.width);
        }
        return () => {}
    }, []);

    useEffect(() => {
        function handleClickOutsidePalette() {
            function handleClickOutside(event) {
                console.log(event);
                if (colorPickerRef.current) {
                    const boundingRect = colorPickerRef.current.getBoundingClientRect();
                    console.log(boundingRect);
                    if (event.clientX < boundingRect.x || event.clientX > boundingRect.right ||
                        event.clientY < boundingRect.y || event.clientY > boundingRect.bottom) {
                            setShowColorPicker(false);
                    }
                } 
              }
            
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }

        function handleCopyUrlClicked() {
            let intervalId = null;
            if (copyUrlClicked) {
                intervalId = setInterval(() => setCopyUrlClicked(false), 5000);
            }    
        
            return () => {
                if (intervalId != null) {
                    clearInterval(intervalId)
                  }
            };
        }

        function setUpDrawingCanvas() {
            const drawingCanvas = drawingCanvasRef.current;

            // function calculateControlPoint(positionOne, positionTwo, distanceAwayRelativeToSegmentLength) {
            //     const midpointVector = {x: (positionOne.x + positionTwo.x)/2, y: (positionOne.y + positionTwo.y)/2}; 
            //     const lengthOfSegment = Math.sqrt((positionOne.x - positionTwo.x)**2 + (positionOne.y - positionTwo.y)**2);
            //     const distanceAwayFromSegment = distanceAwayRelativeToSegmentLength*lengthOfSegment;

            //     let perpendicularVector = null;
            //     if (positionOne.x > positionTwo.x) {
            //         perpendicularVector = {x: (positionTwo.y - positionOne.y), y: (positionOne.x - positionTwo.x)}; 
            //     } else {
            //         perpendicularVector = {x: (positionTwo.y - positionOne.y), y: (positionOne.x - positionTwo.x)}; 
            //     }
            //     const lengthOfPerpendicularVector = Math.sqrt(perpendicularVector.x**2 + perpendicularVector.y**2);
            //     const unitPerpendicularVector = {x: perpendicularVector.x/lengthOfPerpendicularVector, y: perpendicularVector.y/lengthOfPerpendicularVector};
            //     console.log(unitPerpendicularVector);
            //     const scaledPerpendicularVector = {x: unitPerpendicularVector.x * distanceAwayFromSegment, y: unitPerpendicularVector.y * distanceAwayFromSegment};

            //     return {x: midpointVector.x + scaledPerpendicularVector.x, y: midpointVector.y + scaledPerpendicularVector.y};
            // }

            function calcMidpoint(point1, point2) {
                return {x: 0.5*point1.x + 0.5*point2.x, y: 0.5*point1.y + 0.5*point2.y};
            }

            function expandArrWithMidpoints(arr) {
                let arrWithMidpoints = [arr[0]];
                for (let i = 1; i < arr.length; i++) {
                    arrWithMidpoints.push(calcMidpoint(arr[i-1], arr[i]));
                    arrWithMidpoints.push(arr[i]);
                }
                return arrWithMidpoints;
            }

            function drawQuadraticBezierCurve() {
                const context = drawingCanvas.getContext("2d");
                context.beginPath();
                context.strokeStyle = getComputedStyle(document.querySelector(`.${currentColorClass}`))["background-color"];
                context.lineWidth = 3;
                console.log(`quadratic bezier group ${quadraticBezierPointGroup.map((x) => JSON.stringify(x))}`)
                let expandedPointGroup = expandArrWithMidpoints(quadraticBezierPointGroup);
                console.log(`expanded midpoint ${expandedPointGroup.map((x) => JSON.stringify(x))}`)
                context.moveTo(expandedPointGroup[1].x, expandedPointGroup[1].y);
                context.quadraticCurveTo(expandedPointGroup[2].x, expandedPointGroup[2].y, expandedPointGroup[3].x, expandedPointGroup[3].y);
                context.stroke();

                quadraticBezierPointGroup = quadraticBezierPointGroup.slice(1, quadraticBezierPointGroup.length);
                console.log(`new quadratic bezier group ${quadraticBezierPointGroup.map((x) => JSON.stringify(x))}`)
            
               // context.closePath();
            }

            function mouseDownEventListener(e) {
                if (drawingCanvas) {
                    console.log(e);
                    const currentX = e.offsetX;
                    const currentY = e.offsetY;
                    quadraticBezierPointGroup.push({x: currentX, y: currentY});
                    setIsDrawing(true);
                }
            }

            function mouseMoveEventListener(e) {
                if (drawingCanvas) {
                    if (isDrawing) {
                        const currentX = e.offsetX;
                        const currentY = e.offsetY;
                        quadraticBezierPointGroup.push({x: currentX, y: currentY});
                        if (quadraticBezierPointGroup.length === 3) {
                            drawQuadraticBezierCurve();
                        }
                    }
                }
            }

            function mouseUpEventListener(e) {
                if (drawingCanvas) {
                    if (isDrawing) {
                        const currentX = e.offsetX;
                        const currentY = e.offsetY;
                        quadraticBezierPointGroup.push({x: currentX, y: currentY});
                        if (quadraticBezierPointGroup.length === 3) {
                            drawQuadraticBezierCurve();
                        }
                        quadraticBezierPointGroup = [];
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

        const handleClickOutsidePaletteCleanup = handleClickOutsidePalette();
        const handleCopyUrlClickedCleanup = handleCopyUrlClicked();
        const setUpDrawingCanvasCleanup = setUpDrawingCanvas();

        return () => {
          handleClickOutsidePaletteCleanup();
          handleCopyUrlClickedCleanup();
          setUpDrawingCanvasCleanup();
        }
      }, [colorPickerRef, copyUrlClicked, drawingCanvasRef, isDrawing]);


    const handleSubmit = (event) => {
        event.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { user: 'You', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className="container">
            <div className="chat-name">
                <p className="chat-name-text"> Example Chat Name </p>
                {copyUrlClicked ? 
                    <p className="copy-url-copied-confirmation-text"> ✔ Room link has been copied </p> : 
                    <div className="copy-url-show-tooltip">
                        <img src={require("../assets/copy.png")} alt="Copy link" className="copy-url-image" onClick={() => {
                            setCopyUrlClicked(true);
                            navigator.clipboard.writeText(window.location.href);
                        }}/>
                        <span> Copy room URL </span>
                    </div>
                }
            </div>
            <div className="game-play-area">
                <div className="current-players-list">
                    {currentPlayerList.map((player, index) => (
                        <div className="current-player" key={index}>
                            <p>
                                {player}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="drawing-board-container">
                    <canvas className="drawing-canvas" ref={drawingCanvasRef}/>
                    <div className="palette">
                        <div className="draw-icon-background">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="draw-icon" height="70%" width="70%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 
                                49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 
                                30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 
                                339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 
                                5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path>
                            </svg>
                        </div>
                       
                        <div className="erase-icon-background"> 
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="erase-icon" height="70%" width="70%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 
                                0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 
                                12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 
                                416H150.628l-80-80 124.686-124.686z"></path>
                            </svg>
                        </div>
                        <div className={currentColorClass} style = {{"height": "40px", "width": "40px"}} onClick={() => setShowColorPicker(true)}/>
                    </div>
                </div>
                <div className="chat-area-container">
                    <div className="chat-area">
                        <div className="messages">
                            {messages.map((message, index) => (
                                <div className="message" key={index}>
                                    <span className="username">{message.user}:</span> {message.text}
                                </div>
                            ))}
                        </div>
                        <form className="message-input" onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                value={newMessage} 
                                onChange={(e) => setNewMessage(e.target.value)} 
                                placeholder="Type a message..." 
                                required 
                            />
                        </form>
                    </div>
                </div>
            </div>
            {showColorPicker && 
                <div className="color-picker" ref={colorPickerRef}>
                    {colorClassesForColorPicker.map((colorClass, index) => (

                        <div className={colorClass} key={index} onClick={(e) => {
                            setCurrentColorClass(e.target.className);
                            setShowColorPicker(false);
                        }
                        }/>
                    ))}
                </div>}
        </div>
    );
};