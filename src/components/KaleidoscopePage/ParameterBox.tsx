import { Box, Button, Divider, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text, useColorMode, useDisclosure, useTheme, VStack } from "@chakra-ui/react";
import { ContinuousParameter, DiscreteParameter, Fixture, Parameter } from "./kaleidoscopeTypes";

function DiscreteParameterBox(props: { data: DiscreteParameter }) {

    const valueNames = Object.keys(props.data.levels).sort()

    return (
        <RadioGroup value={props.data.current_level}>
            <Stack>
                {valueNames.map((valueName) =>
                    <Radio
                        key={valueName}
                        value={valueName}>
                        {valueName}
                    </Radio>)}
            </Stack>
        </RadioGroup>
    )
}
function ContinuousParameterBox(props: { data: ContinuousParameter }) {

    const { colorMode } = useColorMode();
    const theme = useTheme();
    const bgColor = colorMode === 'dark' ? theme.colors.primary[200] : theme.colors.primary[500];
    //const contrastColor = colorMode === 'dark' ? theme.colors.secondary[400] : theme.colors.secondary[700];
    const fgColor = colorMode === 'dark' ? "black" : "white";

    return (
        <Slider
            defaultValue={0}
            min={props.data.lower_limit_incl}
            max={props.data.upper_limit_incl}
            step={0.1}
            value={props.data.current}
            onChange={() => {}}>
            <SliderTrack >
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb
                boxSize={6}
                bg={bgColor}>
                <Text
                    color={fgColor}
                    fontSize={"14px"}
                    fontWeight={"700"}>
                    {props.data.current}
                </Text>
            </SliderThumb>
        </Slider>
    )
}

function ParameterBox(props: { parameterName: string, data: Parameter }) {

    return (
        <Box width={"fit-content"} border={"2px"} p={2}>
            <Text>{props.parameterName}</Text>
            {props.data.type === "discrete" ?
                <DiscreteParameterBox data={props.data as DiscreteParameter} /> :
                <ContinuousParameterBox data={props.data as ContinuousParameter} />}
        </Box>
    )
}



export default ParameterBox;