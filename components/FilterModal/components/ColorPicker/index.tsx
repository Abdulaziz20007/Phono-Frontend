import React from "react";
import { Color } from "../../types";
import { FaCheck } from "react-icons/fa6";
import { ColorOption, ColorOptions } from "./Color.style";

interface ColorPickerProps {
  colors: Color[];
  selectedColor: string;
  onSelectColor: (colorId: string) => void;
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
  // Find selected color object for comparison
  const selectedColorObj = colors.find(
    (c) => c.id.toString() === selectedColor
  );

  // Handle color click with toggle functionality
  const handleColorClick = (colorId: string) => {
    if (selectedColor === colorId) {
      // If clicking the already selected color, unselect it (pass empty string)
      onSelectColor("");
    } else {
      // Otherwise select the new color
      onSelectColor(colorId);
    }
  };

  return (
    <ColorOptions>
      {colors.map((color) => (
        <ColorOption
          key={color.id}
          style={{
            backgroundColor: color.value,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          selected={selectedColor === color.id.toString()}
          onClick={() => handleColorClick(color.id.toString())}
          title={color.name}
        >
          {selectedColor === color.id.toString() && (
            <FaCheck color={getIconColor(color.value)} />
          )}
        </ColorOption>
      ))}
    </ColorOptions>
  );
};

export default ColorPicker;
