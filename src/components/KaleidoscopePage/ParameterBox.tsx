import { Box, HStack, Radio, RadioGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useToast } from "@chakra-ui/react";
import { ContinuousParameter, DiscreteParameter, Parameter } from "./kaleidoscopeTypes";
import { useThemeColors } from "../../contexts/ThemeContext";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import { useCallback, useEffect, useState } from "react";
import "./../fixturebox.scss";

function DiscreteParameterBox(props: { fixture: string, program: string, parameterName: string, data: DiscreteParameter }) {

    const toast = useToast()
    const { indicator } = useThemeColors();
    const valueNames = Object.keys(props.data.levels).sort()
    const { setDiscrete, error: kaleidoscopeSetError } = useKaleidoscope();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(false);
    }, [props.data.current_level]);

    return (
        <Box
            width={"fit-content"}
            className="fixturebox_subbox"
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}
            borderColor={kaleidoscopeSetError ?
                indicator.read_only : loading ?
                    indicator.dirty : indicator.ok}>

            <Text>{props.parameterName}</Text>
            <RadioGroup
                isDisabled={kaleidoscopeSetError ? true : false}
                value={props.data.current_level}
                onChange={(nextValue) => {
                    setLoading(true)
                    const error = setDiscrete(props.fixture, props.program, props.parameterName, nextValue)
                    if (error)
                        toast({
                            title: "Error",
                            description: error,
                            status: "error",
                            duration: 2000,
                            isClosable: true
                        })
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
    const { setContinuous, error: kaleidoscopeSetError } = useKaleidoscope();

    const [uiValue, setUiValue] = useState<number>(props.data.current);

    // Stop periodic UI updates while we are editing
    const [isTyping, setIsTyping] = useState<boolean>(false);
    // API request was sent and not yet answered
    const [loading, setLoading] = useState<boolean>(true);
    // Used for debouncing
    const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
    const [timeoutId2, setTimeoutId2] = useState<number | undefined>(undefined);

    const toast = useToast()

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
                const error = setContinuous(props.fixture, props.program, props.parameterName, newValue)
                if (error)
                    toast({
                        title: "Error",
                        description: error,
                        status: "error",
                        duration: 2000,
                        isClosable: true
                    })
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
            borderColor={kaleidoscopeSetError ?
                indicator.read_only : loading ?
                    indicator.dirty : indicator.ok}>
            <Text>{props.parameterName}</Text>
            <Slider
                isDisabled={kaleidoscopeSetError ? true : false}
                minWidth={"250px"}
                defaultValue={0}
                min={props.data.lower_limit_incl}
                max={props.data.upper_limit_incl}
                step={(props.data.upper_limit_incl - props.data.lower_limit_incl) / 100}
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
                        fontSize={"10px"}
                        fontWeight={"700"}>
                        {Math.round(uiValue * 100) / 100}
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