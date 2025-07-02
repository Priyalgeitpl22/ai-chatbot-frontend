import React from "react";
import styled from "@emotion/styled";

interface CustomColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    isSelected: boolean;
}

const ColorPickerWrapper = styled.div<{ isSelected: boolean, color: string }>`
  display: inline-block;
  border: 2px solid ${(props) => (props.isSelected ? "#ffffff" : "transparent")};
  outline: 3px solid ${(props) => (props.isSelected ? props.color : "transparent")};
  border-radius: 50%;
  overflow: hidden;
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease-in-out; /* Smooth transition */
  transform: ${(props) => (props.isSelected ? "scale(1.1)" : "scale(1)")}; 
  box-shadow: ${(props) => (props.isSelected ? `0 0 10px ${props.color}` : "none")}; /* Glow effect */
`;

const HiddenInput = styled.input`
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.color};
  border-radius:50%;
`;

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ value, onChange, isSelected }) => {
    return (
        <ColorPickerWrapper isSelected={isSelected} color={value}>
            <ColorPreview  color={value} />
            <HiddenInput
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                
            />
        </ColorPickerWrapper>
    );
};

export default CustomColorPicker;
