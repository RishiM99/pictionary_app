import React, { useState, useRef, useEffect } from 'react';
import DrawToCanvas from '../DrawToCanvas.js';
import './styles/Canvas.css';
import { DrawingContext } from '../contexts/DrawingContext.js';
import ColorPicker from './ColorPicker.js';
import DrawStrokePicker from './DrawStrokePicker.js';
import EraseStrokePicker from './EraseStrokePicker.js';
import { setOldCanvasHeight, setOldCanvasWidth } from '../CanvasResizingHelper.js';



export default function Canvas() {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showDrawStrokePicker, setShowDrawStrokePicker] = useState(false);
    const [showEraseStrokePicker, setShowEraseStrokePicker] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    const [selectedPaletteOption, setSelectedPaletteOption] = useState('pen');

    const [currentColorClass, setCurrentColorClass] = useState('black');
    const [currentDrawStrokeSize, setCurrentDrawStrokeSize] = useState(2);
    const [currentEraseStrokeSize, setCurrentEraseStrokeSize] = useState(2);

    const openColorPickerButtonRef = useRef(null);
    const openDrawStrokePickerButtonRef = useRef(null);
    const openEraseStrokePickerButtonRef = useRef(null);
    const fillButtonRef = useRef(null);


    const drawingCanvasRef = useRef(null);

    useEffect(() => {
        const drawingCanvas = drawingCanvasRef.current;
        if (drawingCanvas) {
            drawingCanvas.height = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("height"), 10);
            drawingCanvas.width = parseInt(window.getComputedStyle(drawingCanvas).getPropertyValue("width"), 10);
            console.log(drawingCanvas.height);
            console.log(drawingCanvas.width);
            setOldCanvasHeight(drawingCanvas.height);
            setOldCanvasWidth(drawingCanvas.width);
        }
        return () => { }
    }, []);

    useEffect(() => {
        const setUpDrawingCanvasCleanup = DrawToCanvas.setUpDrawingForCanvas({ drawingCanvasRef, currentColorClass, currentDrawStrokeSize, isDrawing, setIsDrawing, currentEraseStrokeSize, selectedPaletteOption });

        return () => {
            setUpDrawingCanvasCleanup();
        }
    }, [currentDrawStrokeSize, currentColorClass, isDrawing, drawingCanvasRef, setIsDrawing, currentEraseStrokeSize, selectedPaletteOption]);

    const colorPickerButtonOnClick = () => {
        if (!showColorPicker && showDrawStrokePicker) {
            setShowDrawStrokePicker(false);
        }
        if (!showColorPicker && showEraseStrokePicker) {
            setShowEraseStrokePicker(false);
        }
        if (showColorPicker) {
            // Default option
            setSelectedPaletteOption('pen');
        }
        setShowColorPicker(!showColorPicker);
        setSelectedPaletteOption('color-picker');
    }


    const penButtonOnClick = () => {
        if (!showDrawStrokePicker && showColorPicker) {
            setShowColorPicker(false);
        }
        if (!showDrawStrokePicker && showEraseStrokePicker) {
            setShowEraseStrokePicker(false);
        }
        setShowDrawStrokePicker(!showDrawStrokePicker);
        setSelectedPaletteOption('pen');
    }


    const eraserButtonOnClick = () => {
        console.log(showEraseStrokePicker);
        console.log(showColorPicker);
        console.log(showDrawStrokePicker);
        if (!showEraseStrokePicker && showColorPicker) {
            setShowColorPicker(false);
        }
        if (!showEraseStrokePicker && showDrawStrokePicker) {
            setShowDrawStrokePicker(false);
        }
        setShowEraseStrokePicker(!showEraseStrokePicker);
        setSelectedPaletteOption('eraser');
    }

    const fillButtonOnClick = () => {
        console.log('clicked fill button');
        setShowColorPicker(false);
        setShowEraseStrokePicker(false);
        setShowDrawStrokePicker(false);
        setSelectedPaletteOption('fill');
    }

    return (
        <DrawingContext.Provider value={{ currentColorClass, setCurrentColorClass, showColorPicker, setShowColorPicker, currentDrawStrokeSize, setCurrentDrawStrokeSize, currentEraseStrokeSize, setCurrentEraseStrokeSize, showEraseStrokePicker, setShowEraseStrokePicker, showDrawStrokePicker, setShowDrawStrokePicker, selectedPaletteOption, setSelectedPaletteOption }}>
            <div className="drawing-board-container">
                <canvas className="drawing-canvas" ref={drawingCanvasRef} />
                <div className="palette">
                    <div className={selectedPaletteOption === 'pen' ? "draw-icon-background-selected" : "draw-icon-background-unselected"} ref={openDrawStrokePickerButtonRef} onClick={penButtonOnClick}>
                        <svg viewBox="0 0 512 512" className="draw-icon" height="70%" width="70%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 
                            49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 
                            30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 
                            339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 
                            5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path>
                        </svg>
                    </div>

                    <div className={selectedPaletteOption === 'eraser' ? "erase-icon-background-selected" : "erase-icon-background-unselected"} ref={openEraseStrokePickerButtonRef} onClick={eraserButtonOnClick}>
                        <svg viewBox="0 0 512 512" className="erase-icon" height="70%" width="70%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 
                            0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 
                            12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 
                            416H150.628l-80-80 124.686-124.686z"></path>
                        </svg>
                    </div>
                    <div className={selectedPaletteOption === 'fill' ? "fill-icon-background-selected" : "fill-icon-background-unselected"} ref={fillButtonRef} onClick={fillButtonOnClick}>
                        <svg viewBox="0 0 512 512" className="fill-icon" height="70%" width="70%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z">
                            </path>
                        </svg>
                    </div>
                    <div className="color-picker-button-border" ref={openColorPickerButtonRef} onClick={colorPickerButtonOnClick}>
                        <div className={currentColorClass} style={{ "height": "25px", "width": "25px" }} />
                    </div>
                </div>
                {showColorPicker && <ColorPicker openColorPickerButtonRef={openColorPickerButtonRef} />}
                {showDrawStrokePicker && <DrawStrokePicker openDrawStrokePickerButtonRef={openDrawStrokePickerButtonRef} />}
                {showEraseStrokePicker && <EraseStrokePicker openEraseStrokePickerButtonRef={openEraseStrokePickerButtonRef} />}
            </div>
        </DrawingContext.Provider >
    );
}