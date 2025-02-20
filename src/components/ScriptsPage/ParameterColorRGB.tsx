import { HStack, parseColor } from "@chakra-ui/react";
import { ColorPickerArea, ColorPickerContent, ColorPickerControl, ColorPickerEyeDropper, ColorPickerInput, ColorPickerLabel, ColorPickerRoot, ColorPickerSliders, ColorPickerSwatchGroup, ColorPickerSwatchTrigger, ColorPickerTrigger } from "../ui/color-picker";

export type RGBColor = {
    red: number,
    green: number,
    blue: number
}

function ParameterColorRGB(props: { name: string, value: RGBColor, setValue: (newValue: RGBColor) => void }) {


    return (
        <ColorPickerRoot
            defaultValue={parseColor("#eb5e41")}
            maxW="200px"
        >
            <ColorPickerLabel>{props.name}</ColorPickerLabel>
            <ColorPickerControl>
                <ColorPickerInput />
                <ColorPickerTrigger />
            </ColorPickerControl>
            <ColorPickerContent>
                <ColorPickerArea />
                <HStack>
                    <ColorPickerEyeDropper />
                    <ColorPickerSliders />
                </HStack>
            </ColorPickerContent>
        </ColorPickerRoot>
    )
}



function rgbToHex(rgb: RGBColor): string {
    if (rgb.red < 0 || rgb.red > 255 || rgb.green < 0 || rgb.green > 255 || rgb.blue < 0 || rgb.blue > 255) {
        throw new Error("RGB values must be in the range 0-255");
    }
    return "#" + ((1 << 24) | (rgb.red << 16) | (rgb.green << 8) | rgb.blue).toString(16).slice(1).toUpperCase();
}

function hexToRgb(hex: string): RGBColor {
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
        throw new Error("Invalid HEX color format");
    }
    hex = hex.replace(/^#/, "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { red: r, green: g, blue: b };
}

export default ParameterColorRGB;