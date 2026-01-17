import { Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { useThemeColors } from "../../contexts/ThemeContext";


function ParameterNumber(props: { name: string, value: number, min: number, max: number, setValue: (newValue: number) => void }) {

    const { primary, bwForeground } = useThemeColors();


    return (
        <Box
            width={"fit-content"}
            //border={"2px"}
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}>
            <Text>{props.name}</Text>
            <Slider
                minWidth={"250px"}
                defaultValue={0}
                min={props.min}
                max={props.max}
                step={(props.max - props.min)/ 100}
                value={props.value}
                onChange={(newValue) => {
                    props.setValue(newValue)
                }}>
                <SliderTrack >
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb
                    boxSize={6}
                    bg={primary}>
                    <Text
                        color={bwForeground}
                        fontSize={"10px"}
                        fontWeight={"700"}>
                        {props.value}
                    </Text>
                </SliderThumb>
            </Slider>
        </Box>
    )
}

export default ParameterNumber;