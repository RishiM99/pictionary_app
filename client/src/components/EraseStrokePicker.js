import React, { useRef, useContext, useEffect } from 'react';
import './styles/EraseStrokePicker.css';
import { DrawingContext } from '../contexts/DrawingContext.js';

const eraseStrokeClassToPixelSize = {
    "small": 3,
    "medium": 6,
    "large": 9,
}


export default function EraseStrokePicker({ openEraseStrokePickerButtonRef }) {
    const { setShowEraseStrokePicker, setCurrentEraseStrokeSize } = useContext(DrawingContext);
    const eraseStrokePickerRef = useRef(null);

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
    }, [openEraseStrokePickerButtonRef, setShowEraseStrokePicker]);

    return (
        <div className="erase-stroke-picker-container" ref={eraseStrokePickerRef}>
            {Object.keys(eraseStrokeClassToPixelSize).map((eraseStrokeClass, index) => {
                return (<div className={eraseStrokeClass} key={index} onClick={(e) => {
                    setCurrentEraseStrokeSize(eraseStrokeClassToPixelSize[e.target.className]);
                    setShowEraseStrokePicker(false);
                }} />);
            })}
        </div>
    );
}