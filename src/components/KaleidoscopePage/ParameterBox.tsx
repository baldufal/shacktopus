import { Box, HStack, Radio, RadioGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from "@chakra-ui/react";
import { ContinuousParameter, DiscreteParameter, Parameter } from "./kaleidoscopeTypes";
import { useThemeColors } from "../../ThemeContext";
import { useKaleidoscopeSet } from "./KaleidoscopeSetContext";
import { useCallback, useEffect, useState } from "react";

function DiscreteParameterBox(props: { fixture: string, program: string, parameterName: string, data: DiscreteParameter }) {

    const { indicator } = useThemeColors();
    const valueNames = Object.keys(props.data.levels).sort()
    const { setDiscrete } = useKaleidoscopeSet();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(false);

    }, [props.data.current_level]);

    return (
        <Box
            width={"fit-content"}
            border={"2px"}
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}
            borderColor={loading ? indicator.dirty : indicator.ok}>

            <Text>{props.parameterName}</Text>
            <RadioGroup
                value={props.data.current_level}
                onChange={(nextValue) => {
                    setLoading(true)
                    setDiscrete(props.fixture, props.program, props.parameterName, nextValue)
                }}>
                <HStack>
                    {valueNames.map((valueName) =>
                        <Radio
                            key={valueName}
                            value={valueName}>
                            {valueName}
                        </Radio>)}
                </HStack>
            </RadioGroup>
        </Box>

    )
}


function ContinuousParameterBox(props: { fixture: string, program: string, parameterName: string, data: ContinuousParameter }) {
    const REFRESH_INTERVAL = 300;
    const DEBOUNCE_DELAY = 200;
    const { primary, bwForeground, indicator } = useThemeColors();
    const { setContinuous } = useKaleidoscopeSet();

    const [uiValue, setUiValue] = useState<number>(props.data.current);

    // Stop periodic UI updates while we are editing
    const [isTyping, setIsTyping] = useState<boolean>(false);
    // API request was sent and not yet answered
    const [loading, setLoading] = useState<boolean>(true);
    // Used for debouncing
    const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
    const [timeoutId2, setTimeoutId2] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!isTyping) {
            setUiValue(props.data.current);
            setLoading(false);
        }
    }, [props.data.current, isTyping]);

    // Debounced function to handle UI data changes
    const debouncedSendData = useCallback(
        (newValue: number) => {
            if (timeoutId)
                clearTimeout(timeoutId);
            if (timeoutId2)
                clearTimeout(timeoutId2);

            setIsTyping(true);
            // For marking data in ui as dirty
            setLoading(true);

            const newTimeoutId = window.setTimeout(() => {
                setContinuous(props.fixture, props.program, props.parameterName, newValue)
            }, DEBOUNCE_DELAY);
            setTimeoutId(newTimeoutId);


            const newTimeoutId2 = window.setTimeout(() => {
                setIsTyping(false);
            }, DEBOUNCE_DELAY + REFRESH_INTERVAL)
            setTimeoutId2(newTimeoutId2)
        },
        [timeoutId]
    );

    return (
        <Box
            width={"fit-content"}
            border={"2px"}
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}
            borderColor={loading ? indicator.dirty : indicator.ok}>
            <Text>{props.parameterName}</Text>
            <Slider
                minWidth={"250px"}
                defaultValue={0}
                min={props.data.lower_limit_incl}
                max={props.data.upper_limit_incl}
                step={0.1}
                value={uiValue}
                onChange={(newValue) => {
                    setUiValue(newValue);
                    debouncedSendData(newValue)
                }}>
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
                        {uiValue}
                    </Text>
                </SliderThumb>
            </Slider>
        </Box>
    )
}

function ParameterBox(props: { fixture: string, program: string, parameterName: string, data: Parameter }) {

    return (<>
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
    </>
    )
}



export default ParameterBox;