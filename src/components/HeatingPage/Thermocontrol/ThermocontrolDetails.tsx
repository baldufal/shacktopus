import { Box, Button, Divider, Flex, HStack, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer, Switch, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import { Permission, useAuth } from "../../Router/AuthContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./../../fixturebox.scss"
import { MdExpandLess, MdExpandMore, MdHourglassTop, MdLock } from "react-icons/md";
import { TcUpdates, TcData, TcMessage } from "./ThermocontrolMessage";

export interface ThermocontrolSettableDataType {
    extra_ventilation: number;
    max_heating_power: number;
    target_humidity: number;
    target_temperature: number;
    use_ventilation_for_cooling: boolean;
    use_ventilation_for_heating: boolean;
    heizstrahler_is_active?: boolean;
}


function ThermocontrolDetails() {

    const auth = useAuth();

    const { primary, bwForeground, indicator } = useThemeColors();

    const ADDITIONAL_WAIT = 100;
    const DEBOUNCE_DELAY = 200;

    const [dataFromAPI, setDataFromAPI] = useState<TcData | null>(null);
    const [dataFromUI, setDataFromUI] = useState<ThermocontrolSettableDataType>(
        {
            extra_ventilation: 0,
            max_heating_power: 0,
            target_humidity: 0,
            target_temperature: 5,
            use_ventilation_for_cooling: false,
            use_ventilation_for_heating: false
        });
    const updateDataFromUI = (apiData: TcData): void => {
        setDataFromUI({
            extra_ventilation: apiData.extra_ventilation,
            max_heating_power: apiData.max_heating_power,
            target_humidity: apiData.target_humidity,
            target_temperature: apiData.target_temperature,
            use_ventilation_for_cooling: apiData.use_ventilation_for_cooling,
            use_ventilation_for_heating: apiData.use_ventilation_for_heating
        });
    };

    // Stop periodic UI updates while we are editing
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const isTypingRef = useRef(isTyping);
    // No data received yet
    const [loading, setLoading] = useState<boolean>(true);
    // API request was sent and not yet answered
    const [dirty, setDirty] = useState<boolean>(true);
    // Last API request returned an error
    const [error, setError] = useState<string | undefined>(undefined);
    // Used for debouncing
    const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
    const [timeoutId2, setTimeoutId2] = useState<number | undefined>(undefined);

    const writePermission = auth.userData && auth.userData.permissions.find((val) => val === Permission.HEATING) != undefined

    const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/thermocontrol`, { share: true, retryOnError: true });


    useEffect(() => {
        isTypingRef.current = isTyping;
    }, [isTyping]);

    // Debounced function to handle UI data changes
    const handleMessage = useCallback(
        (message: MessageEvent) => {
            try {
                const parsedMessage = JSON.parse(message.data) as TcMessage;
                switch (parsedMessage.messageType) {
                    case "error":
                        console.log("Received thermocontrol error: " + parsedMessage.error);
                        break;
                    case "tokenError":
                        console.log("Received thermocontrol token error: " + parsedMessage.error);
                        // Investigate token health
                        auth.refreshToken();
                        break;
                    case "update":
                        if (isTypingRef.current) {
                            console.log("Skipping data fetch because of ongoing user input");
                            return;
                        }

                        const update = parsedMessage.data as TcUpdates
                        if (update.type != "tc")
                            return;
                        if (!update.stale) {
                            const data = update.data!;
                            setDataFromAPI(data);
                            updateDataFromUI(data);
                            setError(undefined);
                            setDirty(false);
                            setLoading(false);
                        } else {
                            setError("TC update health != good");
                        }
                }
            } catch (error) {
                setError("An error occured during parsing thermocontrol message");
                console.log("An error occured during parsing thermocontrol message: " + error)
            }
        },
        [isTyping]
    );

    useEffect(() => {
        if (lastMessage !== null) {
            handleMessage(lastMessage);
        }
    }, [lastMessage]);

    useEffect(() => {
        if (readyState === ReadyState.OPEN || readyState === ReadyState.CONNECTING) {
            setError(undefined);
        } else {
            setError("WebSocket for TC: state != OPEN or CONNECTING");
        }
    }, [readyState]);

    // Debounced function to handle UI data changes
    const debouncedSendData = useCallback(
        (data: ThermocontrolSettableDataType) => {
            if (timeoutId)
                clearTimeout(timeoutId);
            if (timeoutId2)
                clearTimeout(timeoutId2);

            setIsTyping(true);
            setDirty(true);


            const newTimeoutId = window.setTimeout(() => {
                if (readyState === ReadyState.OPEN) {
                    console.log("Sending updated Thermocontrol data to server:", data);
                    sendMessage(JSON.stringify({ token: auth.userData!.token, data: data }));
                }
            }, DEBOUNCE_DELAY);
            setTimeoutId(newTimeoutId);


            const newTimeoutId2 = window.setTimeout(() => {
                setIsTyping(false);
            }, DEBOUNCE_DELAY + ADDITIONAL_WAIT)
            setTimeoutId2(newTimeoutId2)
        },
        [timeoutId, timeoutId2, auth.userData!.token]
    );

    const { isOpen: isOpenTemp, onOpen: onOpenTemp, onClose: onCloseTemp } = useDisclosure()
    const { isOpen: isOpenHum, onOpen: onOpenHum, onClose: onCloseHum } = useDisclosure()

    const [temp, setTemp] = useState<string>(String(dataFromUI.target_temperature));
    useEffect(() => {
        setTemp(String(dataFromUI.target_temperature));
    }, [dataFromUI.target_temperature, isOpenTemp]);
    const [hum, setHum] = useState<string>(String(dataFromUI.target_humidity));
    useEffect(() => {
        setHum(String(dataFromUI.target_humidity));
    }, [dataFromUI.target_humidity, isOpenHum]);

    const [expanded, setExpanded] = useState<boolean>(false);

    if (!error && loading)
        return <Skeleton
            width={"200px"}
            height={"250px"} />


    const borderColor = error ? indicator.error : dirty ? indicator.dirty : indicator.ok;
    return (
        <>
            <div className="containerdiv">
                <div
                    className={"fixturebox_background_color"} />
                <Box
                    className="fixturebox"
                    width={"fit-content"}
                    borderColor={borderColor}
                    p={2}>
                    {error ? <Text color={indicator.error}>{error}</Text> :
                        <VStack align={"start"}>
                            <Flex width={"100%"}>
                                <Text className="fixturebox_heading">ThermoControl</Text>
                                <Spacer />
                                {writePermission ?
                                    (dirty ?
                                        <Icon as={MdHourglassTop} color={indicator.dirty} />
                                        : null)
                                    :
                                    <Icon as={MdLock} margin={"4px"} />}
                            </Flex>
                            <Divider></Divider>
                            <Text>Current mode: {dataFromAPI?.current_heating_mode}</Text>
                            <Divider></Divider>

                            <HStack>
                                <Text>Target temp: </Text>
                                <Button
                                    isDisabled={!writePermission}
                                    onClick={onOpenTemp}
                                >{dataFromUI.target_temperature + "°C"}</Button>
                            </HStack>

                            {/*
                        <TemperatureInput
                            isDisabled={!writePermission}
                            dataFromUI={dataFromUI}
                            onChange={(temp) => {
                                const updatedData = { ...dataFromUI, target_temperature: temp }
                                setDataFromUI(updatedData);
                                debouncedSendData(updatedData);
                            }}>
                        </TemperatureInput>
                        */}

                            <Divider></Divider>

                            <HStack>
                                <Text>Target humidity: </Text>
                                <Button
                                    isDisabled={!writePermission}
                                    onClick={onOpenHum}
                                >{dataFromUI.target_humidity + "%"}</Button>
                            </HStack>

                            {expanded && <>

                                <Divider></Divider>
                                <Text>Max heating power</Text>
                                <Box width={"full"} paddingEnd={"7px"} paddingStart={"7px"}>
                                    <Slider
                                        isDisabled={!writePermission}
                                        defaultValue={0}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={dataFromUI?.max_heating_power}
                                        onChange={(power) => {
                                            const updatedData = { ...dataFromUI, max_heating_power: power }
                                            setDataFromUI(updatedData);
                                            debouncedSendData(updatedData);
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
                                                {dataFromUI?.max_heating_power}
                                            </Text>
                                        </SliderThumb>
                                    </Slider>
                                </Box>

                                <Divider></Divider>
                                <Text>Extra ventilation</Text>
                                <Box width={"full"} paddingEnd={"7px"} paddingStart={"7px"}>
                                    <Slider
                                        isDisabled={!writePermission}
                                        defaultValue={0}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={dataFromUI?.extra_ventilation}
                                        onChange={(power) => {
                                            const updatedData = { ...dataFromUI, extra_ventilation: power }
                                            setDataFromUI(updatedData);
                                            debouncedSendData(updatedData);
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
                                                {dataFromUI?.extra_ventilation}
                                            </Text>
                                        </SliderThumb>
                                    </Slider>
                                </Box>


                                <Divider></Divider>
                                <Switch
                                    isDisabled={!writePermission}
                                    isChecked={dataFromUI?.use_ventilation_for_heating}
                                    onChange={(event) => {
                                        const updatedData = { ...dataFromUI, use_ventilation_for_heating: event.target.checked }
                                        setDataFromUI(updatedData);
                                        debouncedSendData(updatedData);
                                    }}>Use ventilation for heating</Switch>
                                <Divider></Divider>
                                <Switch
                                    isDisabled={!writePermission}
                                    isChecked={dataFromUI?.use_ventilation_for_cooling}
                                    onChange={(event) => {
                                        const updatedData = { ...dataFromUI, use_ventilation_for_cooling: event.target.checked }
                                        setDataFromUI(updatedData);
                                        debouncedSendData(updatedData);
                                    }}>
                                    Use ventilation for cooling</Switch>

                                {dataFromAPI?.emergency_heating_is_active ? <Text color={"red"}>Emergency heating is active!</Text> : null}
                            </>}

                            <IconButton
                                width={"100%"}
                                height={"20px"}
                                onClick={() => setExpanded((oldExpanded) => !oldExpanded)}
                                aria-label={"expand"}
                                icon={expanded ? <MdExpandLess /> : <MdExpandMore />}
                            />
                        </VStack>
                    }
                </Box>
            </div>

            <Modal isOpen={isOpenTemp} onClose={onCloseTemp}>
                <ModalOverlay />
                <ModalContent
                    as="form"
                    onSubmit={(e) => {
                        e.preventDefault();

                        const tempNumber = parseFloat(temp);
                        if (isNaN(tempNumber) || tempNumber < 0 || tempNumber > 100) return;

                        const updatedData = { ...dataFromUI, target_temperature: tempNumber };
                        setDataFromUI(updatedData);
                        debouncedSendData(updatedData);
                        onCloseTemp();
                    }}>
                    <ModalHeader>Set Target Temperature</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            type="number"
                            value={temp}
                            onChange={(e) => {
                                setTemp(e.target.value);
                            }} />
                        <Text>Temperature must be a number between 0 and 30°C</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onCloseTemp}>
                            Close
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={isNaN(parseFloat(temp)) || parseFloat(temp) < 0 || parseFloat(temp) > 30}
                        >Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenHum} onClose={onCloseHum}>
                <ModalOverlay />
                <ModalContent
                    as="form"
                    onSubmit={(e) => {
                        e.preventDefault();

                        const humNumber = parseFloat(hum);
                        if (isNaN(humNumber) || humNumber < 0 || humNumber > 100) return;

                        const updatedData = { ...dataFromUI, target_humidity: humNumber };
                        setDataFromUI(updatedData);
                        debouncedSendData(updatedData);
                        onCloseHum();
                    }}
                >
                    <ModalHeader>Set Target Humidity</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Input
                            type="number"
                            value={hum}
                            onChange={(e) => setHum(e.target.value)}
                        />
                        <Text>Humidity must be a number between 0 and 100%</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onCloseHum}>
                            Close
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={isNaN(parseFloat(hum)) || parseFloat(hum) < 0 || parseFloat(hum) > 100
                            }
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ThermocontrolDetails;