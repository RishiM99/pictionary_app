import React, { useRef, useContext, forwardRef, useEffect } from 'react';
import './styles/ColorPicker.css';
import { DrawingContext } from '../contexts/DrawingContext.ts';
import { getColorStrings, convertStringToColor, PaletteOption } from '../helpers/Enums.ts';


const ColorPicker = forwardRef(function ColorPicker(props, colorPickerRef: React.MutableRefObject<HTMLDivElement>) {
    const { setCurrentColor, setShowColorPicker, setSelectedPaletteOption, openColorPickerButtonRef } = useContext(DrawingContext);

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
                        setSelectedPaletteOption(PaletteOption.Pen); //default option
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
            {getColorStrings().map((colorStr, index) => (
                <div className={colorStr} key={index} onClick={(e) => {
                    console.log(colorStr);
                    setCurrentColor(convertStringToColor(colorStr));
                    setShowColorPicker(false);
                    setSelectedPaletteOption(PaletteOption.Pen);
                }
                } />
            ))}
        </div>
    );
});

export default ColorPicker;

