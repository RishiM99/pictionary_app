import React, { forwardRef, useContext, useEffect } from 'react';
import './styles/EraseStrokePicker.css';
import { DrawingContext } from '../contexts/DrawingContext.ts';
import { getStrokeSizeStrings, convertStringToStrokeSize } from '../helpers/Enums.ts';


const EraseStrokePicker = forwardRef(function EraseStrokePicker(props, eraseStrokePickerRef: React.MutableRefObject<HTMLDivElement>) {
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
            {getStrokeSizeStrings().map((eraseStrokeString, index) => {
                return (<div className={eraseStrokeString} key={index} onClick={(e) => {
                    setCurrentEraseStrokeSize(convertStringToStrokeSize(eraseStrokeString));
                    setShowEraseStrokePicker(false);
                }} />);
            })}
        </div>
    );
});

export default EraseStrokePicker;