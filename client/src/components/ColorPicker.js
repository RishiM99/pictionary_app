import React, { useRef, useContext, forwardRef, useEffect } from 'react';
import './styles/ColorPicker.css';
import { DrawingContext } from '../contexts/DrawingContext.js';

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
];


const ColorPicker = forwardRef(function ColorPicker(props, colorPickerRef) {
    const { setCurrentColorClass, setShowColorPicker, setSelectedPaletteOption, openColorPickerButtonRef } = useContext(DrawingContext);

    useEffect(() => {
        function handleClickOutsideColorPicker() {
            function handleClickOutside(event) {
                if (colorPickerRef?.current && openColorPickerButtonRef?.current) {
                    const colorPickerBoundingRect = colorPickerRef.current.getBoundingClientRect();
                    const openColorPickerButtonBoundingRect = openColorPickerButtonRef.current.getBoundingClientRect();
                    const outsideColorPicker = (event.clientX < colorPickerBoundingRect.x || event.clientX > colorPickerBoundingRect.right ||
                        event.clientY < colorPickerBoundingRect.y || event.clientY > colorPickerBoundingRect.bottom);
                    const outsideColorPickerButton = (event.clientX < openColorPickerButtonBoundingRect.x || event.clientX > openColorPickerButtonBoundingRect.right ||
                        event.clientY < openColorPickerButtonBoundingRect.y || event.clientY > openColorPickerButtonBoundingRect.bottom);

                    if (outsideColorPicker && outsideColorPickerButton) {
                        setShowColorPicker(false);
                        setSelectedPaletteOption('pen'); //default option
                    }
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }

        const handleClickOutsideColorPickerCleanup = handleClickOutsideColorPicker();
        return () => {
            handleClickOutsideColorPickerCleanup();
        }
    }, [setShowColorPicker, openColorPickerButtonRef, setSelectedPaletteOption, colorPickerRef]);

    return (
        <div className="color-picker-container" ref={colorPickerRef}>
            {colorClassesForColorPicker.map((colorClass, index) => (
                <div className={colorClass} key={index} onClick={(e) => {
                    console.log(e.target.className);
                    setCurrentColorClass(e.target.className);
                    setShowColorPicker(false);
                    setSelectedPaletteOption('pen');
                }
                } />
            ))}
        </div>
    );
});

export default ColorPicker;

