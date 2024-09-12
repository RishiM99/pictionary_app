import { createContext } from 'react';

export const DrawingContext = createContext({
    setCurrentColorClass: null,
    currentColorClass: null,
    showColorPicker: null,
    setShowColorPicker: null,
    setCurrentDrawStrokeSize: null,
    currentDrawStrokeSize: null,
    setCurrentEraseStrokeSize: null,
    currentEraseStrokeSize: null,
    setShowDrawStrokePicker: null,
    showDrawStrokePicker: null,
    setShowEraseStrokePicker: null,
    showEraseStrokePicker: null,
});