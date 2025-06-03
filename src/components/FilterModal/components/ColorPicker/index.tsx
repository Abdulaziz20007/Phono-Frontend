import React from "react";
import { Color } from "../../types";
import { FaCheck } from "react-icons/fa6";
import { ColorOption, ColorOptions } from "./Color.style";

interface ColorPickerProps {
  colors: Color[];
  selectedColor: string;
  onSelectColor: (colorValue: string) => void;
}

const getIconColor = (colorValue: string) => {
  const normalizedColor = colorValue.replace("#", "").toLowerCase();

  if (
    normalizedColor === "ebebeb" ||
    normalizedColor === "fff" ||
    normalizedColor === "ffffff" ||
    normalizedColor === "f5f5f5"
  ) {
    return "#000"; 
  }
  return "#fff"; 
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <ColorOptions>
      {colors.map((color) => (
        <ColorOption
          key={color.value}
          style={{
            backgroundColor: color.value,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          selected={selectedColor === color.value}
          onClick={() => onSelectColor(color.value)}
        >
          {selectedColor === color.value && (
            <FaCheck color={getIconColor(color.value)} />
          )}
        </ColorOption>
      ))}
    </ColorOptions>
  );
};

export default ColorPicker;
