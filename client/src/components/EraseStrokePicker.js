import React, { forwardRef, useContext, useEffect } from 'react';
import './styles/EraseStrokePicker.css';
import { DrawingContext } from '../contexts/DrawingContext.js';
import { ERASER_STROKE_CLASS_TO_PIXEL_MAPPING } from '../helpers/DrawAndEraseStrokeSizeMapping.js';


const EraseStrokePicker = forwardRef(function EraseStrokePicker(props, eraseStrokePickerRef) {
    const { setShowEraseStrokePicker, setCurrentEraseStrokeSize, openEraseStrokePickerButtonRef } = useContext(DrawingContext);

    useEffect(() => {
        function handleClickOutsideEraseStrokePicker() {
            function handleClickOutside(event) {
                if (eraseStrokePickerRef?.current && openEraseStrokePickerButtonRef?.current) {
                    const eraseStrokePickerRefBoundingRect = eraseStrokePickerRef.current.getBoundingClientRect();
                    const openEraseStrokePickerButtonBoundingRect = openEraseStrokePickerButtonRef.current.getBoundingClientRect();
                    const outsideEraseStrokePicker = (event.clientX < eraseStrokePickerRefBoundingRect.x || event.clientX > eraseStrokePickerRefBoundingRect.right ||
                        event.clientY < eraseStrokePickerRefBoundingRect.y || event.clientY > eraseStrokePickerRefBoundingRect.bottom);
                    const outsideEraseStrokePickerButton = (event.clientX < openEraseStrokePickerButtonBoundingRect.x || event.clientX > openEraseStrokePickerButtonBoundingRect.right ||
                        event.clientY < openEraseStrokePickerButtonBoundingRect.y || event.clientY > openEraseStrokePickerButtonBoundingRect.bottom);

                    if (outsideEraseStrokePicker && outsideEraseStrokePickerButton) {
                        setShowEraseStrokePicker(false);
                    }
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }

        const handleClickOutsideEraseStrokePickerCleanup = handleClickOutsideEraseStrokePicker();
        return () => {
            handleClickOutsideEraseStrokePickerCleanup();
        }
    }, [openEraseStrokePickerButtonRef, setShowEraseStrokePicker, eraseStrokePickerRef]);

    return (
        <div className="erase-stroke-picker-container" ref={eraseStrokePickerRef}>
            {Object.keys(ERASER_STROKE_CLASS_TO_PIXEL_MAPPING).map((eraseStrokeClass, index) => {
                return (<div className={eraseStrokeClass} key={index} onClick={(e) => {
                    setCurrentEraseStrokeSize(eraseStrokeClass);
                    setShowEraseStrokePicker(false);
                }} />);
            })}
        </div>
    );
});

export default EraseStrokePicker;