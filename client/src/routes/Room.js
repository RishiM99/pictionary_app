import React, { useState, useEffect, useRef} from 'react';
import './styles/Room.css';
import {drawToCanvas} from '../DrawToCanvasHelper.js';

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

        const handleClickOutsidePaletteCleanup = handleClickOutsidePalette();
        const handleCopyUrlClickedCleanup = handleCopyUrlClicked();
        const setUpDrawingCanvasCleanup = drawToCanvas(drawingCanvasRef, isDrawing, setIsDrawing, currentColorClass);

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
        </div>
    );
};