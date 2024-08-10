import { Box, HStack, Radio, RadioGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import { ContinuousParameter, DiscreteParameter, Parameter } from "./kaleidoscopeTypes";
import { useThemeColors } from "../../ThemeContext";

function DiscreteParameterBox(props: { fixture: string, program: string, parameterName: string, data: DiscreteParameter }) {

    const valueNames = Object.keys(props.data.levels).sort()

    return (
        <RadioGroup value={props.data.current_level}>
            <HStack>
                {valueNames.map((valueName) =>
                    <Radio
                        key={valueName}
                        value={valueName}>
                        {valueName}
                    </Radio>)}
            </HStack>
        </RadioGroup>
    )
}


function ContinuousParameterBox(props: { fixture: string, program: string, parameterName: string, data: ContinuousParameter }) {

    const { primary, bwForeground } = useThemeColors();

    return (
        <Slider
            minWidth={"250px"}
            defaultValue={0}
            min={props.data.lower_limit_incl}
            max={props.data.upper_limit_incl}
            step={0.1}
            value={props.data.current}
            onChange={() => { }}>
            <SliderTrack >
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb
                boxSize={6}
                bg={primary}>
                <Text
                    color={bwForeground}
                    fontSize={"14px"}
                    fontWeight={"700"}>
                    {props.data.current}
                </Text>
            </SliderThumb>
        </Slider>
    )
}

function ParameterBox(props: { fixture: string, program: string, parameterName: string, data: Parameter }) {

    return (
        <Box width={"fit-content"} border={"2px"} p={2} paddingTop={"2px"} paddingBottom={"2px"}>
            <Text>{props.parameterName}</Text>
            {props.data.type === "discrete" ?
                <DiscreteParameterBox
                    fixture={props.fixture}
                    program={props.program}
                    parameterName={props.parameterName}
                    data={props.data as DiscreteParameter} /> :
                <ContinuousParameterBox
                    fixture={props.fixture}
                    program={props.program}
                    parameterName={props.parameterName}
                    data={props.data as ContinuousParameter} />}
        </Box>
    )
}



export default ParameterBox;