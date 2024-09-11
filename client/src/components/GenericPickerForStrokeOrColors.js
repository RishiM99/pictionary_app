import React, {useState, forwardRef} from 'react';
import './styles/GenericPickerForStrokeOrColors.css';

const GenericPickerForStrokeOrColors = forwardRef(
    function GenericPickerForStrokeOrColors({children, style}, ref) {
        return (
            <div className="generic-picker" ref={ref}>
                {children}
            </div> 
        );
    }
);

export default GenericPickerForStrokeOrColors;