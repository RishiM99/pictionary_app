import React, {useState, forwardRef} from 'react';
import './styles/GenericPickerForStrokeOrColors.css';

const GenericPickerForStrokeOrColors = forwardRef(
    function GenericPickerForStrokeOrColors({children}, ref) {
        return (
            <div className="color-picker" ref={ref}>
                {children}
            </div> 
        );
    }
);

export default GenericPickerForStrokeOrColors;