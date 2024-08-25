import { Box, Divider, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import TemperatureInput from "./components/TemperatureInput";
import HumidityInput from "./components/HumidityInput";
import { useThemeColors } from "../../../contexts/ThemeContext";
import { useAuth } from "../../Router/AuthContext";

export interface ThermocontrolSettableDataType {
    extra_ventilation: number;
    max_heating_power: number;
    target_humidity: number;
    target_temperature: number;
    use_ventilation_for_cooling: boolean;
    use_ventilation_for_heating: boolean;
}

interface ThermocontrolDataType extends ThermocontrolSettableDataType {
    emergency_heating_is_active: boolean;
    data_age_humidity: number;
    data_age_temperature: number;
}

function ThermocontrolDetails() {

    const auth = useAuth();

    const { primary, bwForeground, indicator } = useThemeColors();

    const REFRESH_INTERVAL = 300;
    const DEBOUNCE_DELAY = 200;

    const [dataFromAPI, setDataFromAPI] = useState<ThermocontrolDataType | null>(null);
    const [dataFromUI, setDataFromUI] = useState<ThermocontrolSettableDataType>(
        {
            extra_ventilation: 0,
            max_heating_power: 0,
            target_humidity: 0,
            target_temperature: 5,
            use_ventilation_for_cooling: false,
            use_ventilation_for_heating: false
        });
    const updateDataFromUI = (apiData: ThermocontrolDataType): void => {
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
    // API request was sent and not yet answered
    const [loading, setLoading] = useState<boolean>(true);
    // Last API request returned an error
    const [error, setError] = useState<string | undefined>(undefined);
    // Used for debouncing
    const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);
    const [timeoutId2, setTimeoutId2] = useState<number | undefined>(undefined);
    const [writePermission, setWritePermisson] = useState<boolean>(false);

    const updateSocketRef = useRef<WebSocket | undefined>(undefined);
    const setSocketRef = useRef<WebSocket | undefined>(undefined);

    useEffect(() => {
        isTypingRef.current = isTyping;
    }, [isTyping]);

    // Debounced function to handle UI data changes
    const handleMessage = useCallback(
        (message: MessageEvent) => {
            setLoading(false);
            if (isTypingRef.current) {
                console.log("Skipping data fetch because of ongoing user input");
                return;
            }
            try {
                const json = JSON.parse(message.data)
                if (json.health === "good") {
                    const data = json.data;
                    setDataFromAPI(data);
                    updateDataFromUI(data);
                    setError(undefined);
                } else {
                    setError("TC update health != good");
                }
            } catch (error) {
                setError("An error occured during parsing data");
                console.log(error)
            }
        },
        [isTyping]
    );

    const establishWebSocketConnection = () => {
        // Check if the update WebSocket is already connected or connecting
        if (updateSocketRef.current && (updateSocketRef.current.readyState === WebSocket.OPEN || updateSocketRef.current.readyState === WebSocket.CONNECTING)) {
            console.log('WebSocket for TC updates is already open or connecting.');
        } else {
            // Establish the update WebSocket connection
            const updateSocket = new WebSocket(`wss://${window.location.host}/api/thermocontrol/updates`);
            updateSocketRef.current = updateSocket;

            updateSocket.onopen = () => {
                console.log('WebSocket for TC updates opened');
                setError(undefined);
            };

            updateSocket.onmessage = handleMessage;

            updateSocket.onclose = () => {
                console.log('WebSocket for TC updates closed');
                setError("WebSocket for TC updates closed");
                attemptReconnect();  // Try to reconnect on close
            };

            updateSocket.onerror = () => {
                console.log('WebSocket for TC updates error');
                setError("WebSocket for TC updates encountered an error");
                attemptReconnect();  // Try to reconnect on error
            };
        }

        // Check if the set WebSocket is already connected or connecting
        if (setSocketRef.current && (setSocketRef.current.readyState === WebSocket.OPEN || setSocketRef.current.readyState === WebSocket.CONNECTING)) {
            console.log('WebSocket for TC set is already open or connecting.');
        } else {
            // Establish the set WebSocket connection
            const setSocket = new WebSocket(`wss://${window.location.host}/api/thermocontrol/set`);
            setSocketRef.current = setSocket;

            setSocket.onopen = () => {
                console.log('WebSocket for TC set opened');
                setWritePermisson(true);
            };

            setSocket.onclose = () => {
                console.log('WebSocket for TC set closed');
                setWritePermisson(false);
                attemptReconnect();  // Try to reconnect on close
            };

            setSocket.onerror = () => {
                console.log('WebSocket for TC set error');
                setWritePermisson(false);
                attemptReconnect();  // Try to reconnect on error
            };
        }
    };

    const attemptReconnect = () => {
            setTimeout(() => {
                console.log(`Attempting to reconnect...`);
                establishWebSocketConnection();
            }, 3000);
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            // Try to reconnect when the page becomes visible
            establishWebSocketConnection();
        }
    };

    useEffect(() => {
        establishWebSocketConnection();

        // Listen for visibility change events
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // Cleanup on component unmount
            if (updateSocketRef.current) updateSocketRef.current.close();
            if (setSocketRef.current) setSocketRef.current.close();

            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [auth.user]);

    // Debounced function to handle UI data changes
    const debouncedSendData = useCallback(
        (data: ThermocontrolSettableDataType) => {
            if (timeoutId)
                clearTimeout(timeoutId);
            if (timeoutId2)
                clearTimeout(timeoutId2);

            setIsTyping(true);
            // For marking data in ui as dirty
            setLoading(true);


            const newTimeoutId = window.setTimeout(() => {
                if (setSocketRef.current && setSocketRef.current.OPEN)
                    setSocketRef.current!.send(JSON.stringify(data));
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
            borderColor={
                error ? indicator.error :
                    writePermission ?
                        (loading ? indicator.dirty : indicator.ok)
                        : indicator.read_only} p={2}>
            {error ? <Text color={indicator.error}>{error}</Text> :
                <VStack align={"start"}>
                    <Text className="shacktopus-heading">ThermoControl</Text>
                    <Text>Target temperature</Text>
                    <TemperatureInput
                        isDisabled={!writePermission}
                        dataFromUI={dataFromUI}
                        onChange={(temp) => {
                            const updatedData = { ...dataFromUI, target_temperature: temp }
                            setDataFromUI(updatedData);
                            debouncedSendData(updatedData);
                        }}>
                    </TemperatureInput>
                    <Divider></Divider>
                    <Text>Target humidity</Text>
                    <HumidityInput
                        isDisabled={!writePermission}
                        dataFromUI={dataFromUI}
                        onChange={(humidity) => {
                            const updatedData = { ...dataFromUI, target_humidity: humidity }
                            setDataFromUI(updatedData);
                            debouncedSendData(updatedData);
                        }}
                    ></HumidityInput>
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
                    <Divider></Divider>
                    <Text>{"Data age temperature: " + dataFromAPI?.data_age_temperature}</Text>
                    <Text>{"Data age humidity: " + dataFromAPI?.data_age_humidity}</Text>

                    {dataFromAPI?.emergency_heating_is_active ? <Text color={"red"}>Emergency heating is active!</Text> : null}
                </VStack>
            }

        </Box>
    )
}

export default ThermocontrolDetails;