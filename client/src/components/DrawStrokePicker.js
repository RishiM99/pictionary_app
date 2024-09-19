import React, { useContext, useEffect, forwardRef } from 'react';
import './styles/DrawStrokePicker.css';
import { DrawingContext } from '../contexts/DrawingContext.js';
import { DRAW_STROKE_CLASS_TO_PIXEL_MAPPING } from '../helpers/DrawAndEraseStrokeSizeMapping.js';


const DrawStrokePicker = forwardRef(function DrawStrokePicker(props, drawStrokePickerRef) {
    const { setShowDrawStrokePicker, setCurrentDrawStrokeSize, openDrawStrokePickerButtonRef } = useContext(DrawingContext);


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
    }, [openDrawStrokePickerButtonRef, setShowDrawStrokePicker, drawStrokePickerRef]);

    return (
        <div className="draw-stroke-picker-container" ref={drawStrokePickerRef}>
            {Object.keys(DRAW_STROKE_CLASS_TO_PIXEL_MAPPING).map((drawStrokeClass, index) => {
                return (<div className={drawStrokeClass} key={index} onClick={(e) => {
                    setCurrentDrawStrokeSize(DRAW_STROKE_CLASS_TO_PIXEL_MAPPING[drawStrokeClass].penSize);
                    setShowDrawStrokePicker(false);
                }} />);
            })}
        </div>
    );
});

export default DrawStrokePicker;

