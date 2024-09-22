import { createContext } from 'react';
import { Color, StrokeSize, PaletteOption } from '../helpers/Enums.ts';

type DrawingContextType = {
    setCurrentColor: React.Dispatch<React.SetStateAction<Color>>,
    currentColor: Color,
    showColorPicker: boolean,
    setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDrawStrokeSize: React.Dispatch<React.SetStateAction<StrokeSize>>,
    currentDrawStrokeSize: StrokeSize,
    setCurrentEraseStrokeSize: React.Dispatch<React.SetStateAction<StrokeSize>>,
    currentEraseStrokeSize: StrokeSize,
    setShowDrawStrokePicker: React.Dispatch<React.SetStateAction<boolean>>,
    showDrawStrokePicker: boolean,
    setShowEraseStrokePicker: React.Dispatch<React.SetStateAction<boolean>>,
    showEraseStrokePicker: boolean,
    openColorPickerButtonRef: React.MutableRefObject<any>,
    openDrawStrokePickerButtonRef: React.MutableRefObject<any>,
    openEraseStrokePickerButtonRef: React.MutableRefObject<any>,
    selectedPaletteOption: PaletteOption,
    setSelectedPaletteOption: React.Dispatch<React.SetStateAction<PaletteOption>>,
}

export const DrawingContext = createContext<DrawingContextType>({
    setCurrentColor: null,
    currentColor: null,
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
    openColorPickerButtonRef: null,
    openDrawStrokePickerButtonRef: null,
    openEraseStrokePickerButtonRef: null,
    selectedPaletteOption: null,
    setSelectedPaletteOption: null,
});