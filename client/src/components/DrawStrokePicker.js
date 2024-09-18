import React, { useRef, useContext, useEffect } from 'react';
import './styles/DrawStrokePicker.css';
import { DrawingContext } from '../contexts/DrawingContext.js';

const drawStrokeClassToPixelSize = {
    "small": 2,
    "medium": 6,
    "large": 9,
}


export default function DrawStrokePicker({ openDrawStrokePickerButtonRef }) {
    const { setShowDrawStrokePicker, setCurrentDrawStrokeSize } = useContext(DrawingContext);
    const drawStrokePickerRef = useRef(null);


    useEffect(() => {
        function handleClickOutsideDrawStrokePicker() {
            function handleClickOutside(event) {
                if (drawStrokePickerRef?.current && openDrawStrokePickerButtonRef?.current) {
                    const drawStrokePickerBoundingRect = drawStrokePickerRef.current.getBoundingClientRect();
                    const openDrawStrokePickerButtonBoundingRect = openDrawStrokePickerButtonRef.current.getBoundingClientRect();
                    const outsideDrawStrokePicker = (event.clientX < drawStrokePickerBoundingRect.x || event.clientX > drawStrokePickerBoundingRect.right ||
                        event.clientY < drawStrokePickerBoundingRect.y || event.clientY > drawStrokePickerBoundingRect.bottom);
                    const outsideDrawStrokePickerButton = (event.clientX < openDrawStrokePickerButtonBoundingRect.x || event.clientX > openDrawStrokePickerButtonBoundingRect.right ||
                        event.clientY < openDrawStrokePickerButtonBoundingRect.y || event.clientY > openDrawStrokePickerButtonBoundingRect.bottom);

                    if (outsideDrawStrokePicker && outsideDrawStrokePickerButton) {
                        console.log("changing2");
                        setShowDrawStrokePicker(false);
                    }
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }

        const handleClickOutsideDrawStrokePickerCleanup = handleClickOutsideDrawStrokePicker();
        return () => {
            handleClickOutsideDrawStrokePickerCleanup();
        }
    }, [openDrawStrokePickerButtonRef, setShowDrawStrokePicker]);

    return (
        <div className="draw-stroke-picker-container" ref={drawStrokePickerRef}>
            {Object.keys(drawStrokeClassToPixelSize).map((drawStrokeClass, index) => {
                console.log("HERE");
                console.log(drawStrokeClass);
                return (<div className={drawStrokeClass} key={index} onClick={(e) => {
                    setCurrentDrawStrokeSize(drawStrokeClassToPixelSize[e.target.className]);
                    setShowDrawStrokePicker(false);
                }} />);
            })}
        </div>
    );
}

