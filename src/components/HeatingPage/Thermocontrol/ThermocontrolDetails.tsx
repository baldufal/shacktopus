import { Box, Button, Divider, Flex, HStack, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Spacer, Switch, Text, useDisclosure, VStack } from "@chakra-ui/react";
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

    const { indicator } = useThemeColors();

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
    // API request was sent and not yet answered -> indicate unsaved changes
    const [dirty, setDirty] = useState<boolean>(true);
    // Last API request returned an error
    const [error, setError] = useState<string | undefined>(undefined);
    // Used for debouncing
    const [timeoutId2, setTimeoutId2] = useState<number | undefined>(undefined);

    const writePermission = auth.userData && auth.userData.permissions.find((val) => val === Permission.HEATING) != undefined

    const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/thermocontrol`, { share: true, retryOnError: true });
    //const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/thermocontrol`, { share: true, retryOnError: true });


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
    const sendData = useCallback(
        (data: ThermocontrolSettableDataType) => {
            if (timeoutId2)
                clearTimeout(timeoutId2);

            setIsTyping(true); // Used to block incoming updates from API while user is editing
            setDirty(true); // Show that there are unsaved changes

            console.log("Sending TC data: ", data);
            sendMessage(JSON.stringify({ token: auth.userData!.token, data: data }));

            const newTimeoutId2 = window.setTimeout(() => {
                setIsTyping(false);
            }, DEBOUNCE_DELAY + ADDITIONAL_WAIT)
            setTimeoutId2(newTimeoutId2)
        },
        [timeoutId2, auth.userData!.token]
    );


    const { isOpen: isOpenTemp, onOpen: onOpenTemp, onClose: onCloseTemp } = useDisclosure()
    const { isOpen: isOpenHum, onOpen: onOpenHum, onClose: onCloseHum } = useDisclosure()
    const { isOpen: isOpenPower, onOpen: onOpenPower, onClose: onClosePower } = useDisclosure()
    const { isOpen: isOpenVent, onOpen: onOpenVent, onClose: onCloseVent } = useDisclosure()

    const [temp, setTemp] = useState<string>(String(dataFromUI.target_temperature));
    useEffect(() => {
        setTemp(String(dataFromUI.target_temperature));
    }, [dataFromUI.target_temperature, isOpenTemp]);
    const [hum, setHum] = useState<string>(String(dataFromUI.target_humidity));
    useEffect(() => {
        setHum(String(dataFromUI.target_humidity));
    }, [dataFromUI.target_humidity, isOpenHum]);
    const [power, setPower] = useState<string>(String(dataFromUI.max_heating_power * 100));
    useEffect(() => {
        setPower(String(dataFromUI.max_heating_power * 100));
    }, [dataFromUI.max_heating_power, isOpenPower]);
    const [vent, setVent] = useState<string>(String(dataFromUI.extra_ventilation * 100));
    useEffect(() => {
        setVent(String(dataFromUI.extra_ventilation * 100));
    }, [dataFromUI.extra_ventilation, isOpenVent]);

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
                            <Flex width={"100%"}>
                                <Button
                                    isDisabled={!writePermission}
                                    onClick={onOpenTemp}
                                >{"🌡️ " + dataFromUI.target_temperature + "°C"}</Button>
                                <Spacer/>
                                <Button
                                    isDisabled={!writePermission}
                                    onClick={onOpenHum}
                                >{"💧 " + dataFromUI.target_humidity + "%"}</Button>
                            </Flex>

                            <Divider></Divider>

                           <Flex width={"100%"} align={"center"} gap={"5px"}>
                                <Text>Max heating power </Text>
                                <Spacer/>
                                <Button
                                    isDisabled={!writePermission}
                                    onClick={onOpenPower}
                                >{Math.round(dataFromUI.max_heating_power * 100) + "%"}</Button>
                            </Flex>

                            <Divider></Divider>

                           <Flex width={"100%"} align={"center"} gap={"5px"}>
                                <Text>Extra ventilation </Text>
                                <Spacer/>
                                <Button
                                    isDisabled={!writePermission}
                                    onClick={onOpenVent}
                                >{Math.round(dataFromUI.extra_ventilation * 100) + "%"}</Button>
                            </Flex>

                            {expanded && <>
                                <Divider></Divider>
                                <Switch
                                    isDisabled={!writePermission}
                                    isChecked={dataFromUI?.use_ventilation_for_heating}
                                    onChange={(event) => {
                                        const updatedData = { ...dataFromUI, use_ventilation_for_heating: event.target.checked }
                                        setDataFromUI(updatedData);
                                        sendData(updatedData);
                                    }}>Use ventilation for heating</Switch>
                                <Divider></Divider>
                                <Switch
                                    isDisabled={!writePermission}
                                    isChecked={dataFromUI?.use_ventilation_for_cooling}
                                    onChange={(event) => {
                                        const updatedData = { ...dataFromUI, use_ventilation_for_cooling: event.target.checked }
                                        setDataFromUI(updatedData);
                                        sendData(updatedData);
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

            {/*Temperature*/}
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
                        sendData(updatedData);
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

            {/*Humidity*/}
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
                        sendData(updatedData);
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

            {/*Max Power*/}
            <Modal isOpen={isOpenPower} onClose={onClosePower}>
                <ModalOverlay />
                <ModalContent
                    as="form"
                    onSubmit={(e) => {
                        e.preventDefault();

                        const powerNumber = parseFloat(power);
                        if (isNaN(powerNumber) || powerNumber < 0 || powerNumber > 100) return;

                        const updatedData = { ...dataFromUI, max_heating_power: powerNumber / 100 };
                        setDataFromUI(updatedData);
                        sendData(updatedData);
                        onClosePower();
                    }}
                >
                    <ModalHeader>Set Max Heating Power</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <HStack mb={"20px"}>
                            <Button
                                onClick={() => setPower("0")}
                            >Off</Button>
                            <Button
                                onClick={() => setPower("50")}
                            >50%</Button>
                            <Button
                                onClick={() => setPower("100")}
                            >100%</Button>
                        </HStack>
                        <Input
                            type="number"
                            value={power}
                            onChange={(e) => setPower(e.target.value)}
                        />
                        <Text>Max heating power must be a number between 0 and 100%</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClosePower}>
                            Close
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={isNaN(parseFloat(power)) || parseFloat(power) < 0 || parseFloat(power) > 100}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/*Extra Ventilation*/}
            <Modal isOpen={isOpenVent} onClose={onCloseVent}>
                <ModalOverlay />
                <ModalContent
                    as="form"
                    onSubmit={(e) => {
                        e.preventDefault();

                        const ventNumber = parseFloat(vent);
                        if (isNaN(ventNumber) || ventNumber < 0 || ventNumber > 100) return;

                        const updatedData = { ...dataFromUI, extra_ventilation: ventNumber / 100 };
                        setDataFromUI(updatedData);
                        sendData(updatedData);
                        onCloseVent();
                    }}
                >
                    <ModalHeader>Set Extra Ventilation</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <HStack mb={"20px"}>
                            <Button
                                onClick={() => setVent("0")}
                            >Off</Button>
                            <Button
                                onClick={() => setVent("50")}
                            >50%</Button>
                            <Button
                                onClick={() => setVent("100")}
                            >100%</Button>
                        </HStack>
                        <Input
                            type="number"
                            value={vent}
                            onChange={(e) => setVent(e.target.value)}
                        />
                        <Text>Extra ventilation must be a number between 0 and 100%</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onCloseVent}>
                            Close
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={isNaN(parseFloat(vent)) || parseFloat(vent) < 0 || parseFloat(vent) > 100}
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