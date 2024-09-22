import React, { useContext, useEffect, forwardRef } from 'react';
import './styles/DrawStrokePicker.css';
import { DrawingContext } from '../contexts/DrawingContext.ts';
import { convertStringToStrokeSize, getStrokeSizeStrings } from '../helpers/Enums.ts';


const DrawStrokePicker = forwardRef(function DrawStrokePicker(props, drawStrokePickerRef: React.MutableRefObject<HTMLDivElement>) {
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
            {getStrokeSizeStrings().map((drawStrokeString, index) => {
                return (<div className={drawStrokeString} key={index} onClick={(e) => {
                    setCurrentDrawStrokeSize(convertStringToStrokeSize(drawStrokeString));
                    setShowDrawStrokePicker(false);
                }} />);
            })}
        </div>
    );
});

export default DrawStrokePicker;

