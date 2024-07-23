import { Box, Divider, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, useColorMode, useTheme, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import TemperatureInput from "./components/TemperatureInput";
import HumidityInput from "./components/HumidityInput";
import { sendDataToAPI } from "./thermocontrolAPI";

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

    const { colorMode } = useColorMode();
    const theme = useTheme();

    // Determine the colors based on the color mode
    const bgColor = colorMode === 'dark' ? theme.colors.primary[200] : theme.colors.primary[500];
    const fgColor = colorMode === 'dark' ? "black" : "white";

    const [refreshInterval] = useLocalStorage('refresh-interval', 5000);
    const [thermocontrolAPI] = useLocalStorage('thermocontrol-api', "http://192.168.88.30:9079");
    const [thermocontrolKey] = useLocalStorage('thermocontrol-key', "");
    const DEBOUNCE_DELAY = 100;

    const [dataFromAPI, setDataFromAPI] = useState<ThermocontrolDataType | null>(null);
    const [dataFromUI, setDataFromUI] = useState<ThermocontrolSettableDataType>(
        {
            extra_ventilation: 0,
            max_heating_power: 0,
            target_humidity: 0,
            target_temperature: 0,
            use_ventilation_for_cooling: false,
            use_ventilation_for_heating: false
        });
    // Stop periodic UI updates while we are editing
    const [isTyping, setIsTyping] = useState<boolean>(false);
    // API request was sent and not yet answered
    const [loading, setLoading] = useState<boolean>(true);
    // Last API request returned an error
    const [error, setError] = useState<string | null>(null);
    // Used for debouncing
    const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);


    // Effect to fetch data periodically
    useEffect(() => {
        let isMounted = true;

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

        const fetchDataForPosts = async () => {
            if (isTyping) {
                console.log("Skipping data fetch because of ongoing user input");
                return;
            }
            try {
                const response = await axios.get<ThermocontrolDataType>(
                    `${thermocontrolAPI}/json`
                );
                if (isMounted) {
                    setDataFromAPI(response.data);
                    updateDataFromUI(response.data);
                    setError(null);
                }
            } catch (error) {
                if (isMounted) {
                    if (axios.isAxiosError(error)) {
                        setError(error.message);
                    } else {
                        setError("error");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDataForPosts();

        const interval = setInterval(fetchDataForPosts, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [isTyping]);

    // Debounced function to handle UI data changes
    const debouncedSendData = useCallback(
        (data: ThermocontrolSettableDataType) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            setIsTyping(true);
            // For marking data in ui as dirty
            setLoading(true);

            const newTimeoutId = window.setTimeout(() => {
                sendDataToAPI(thermocontrolAPI, thermocontrolKey, data);
            }, DEBOUNCE_DELAY);
            setTimeoutId(newTimeoutId);

            window.setTimeout(() => {
                setIsTyping(false);
            }, DEBOUNCE_DELAY + refreshInterval)
        },
        [timeoutId]
    );

    return (
        <Box width={"fit-content"} border={"2px"} borderColor={loading ? "orange" : error ? "red" : "green"} p={2}>
            <VStack align={"start"}>
                <Text className="shacktopus-heading">ThermoControl</Text>
                <Text>Target temperature</Text>
                <TemperatureInput
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
                            bg={bgColor}>
                            <Text
                                color={fgColor}
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
                            bg={bgColor}>
                            <Text
                                color={fgColor}
                                fontSize={"14px"}
                                fontWeight={"700"}>
                                {dataFromUI?.max_heating_power}
                            </Text>
                        </SliderThumb>
                    </Slider>
                </Box>

                <Divider></Divider>
                <Switch
                    isChecked={dataFromUI?.use_ventilation_for_heating}
                    onChange={(event) => {
                        const updatedData = { ...dataFromUI, use_ventilation_for_heating: event.target.checked }
                        setDataFromUI(updatedData);
                        debouncedSendData(updatedData);
                    }}>Use ventilation for heating</Switch>
                <Divider></Divider>
                <Switch isChecked={dataFromUI?.use_ventilation_for_cooling}
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
        </Box>
    )
}

export default ThermocontrolDetails;