import { Box, Button, Divider, HStack, Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, useNumberInput, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";

interface ThermocontrolDataType {
    emergency_heating_is_active: boolean;
    extra_ventilation: number;
    max_heating_power: number;
    climate_data_age: number;
    target_humidity: number;
    target_temperature: number;
    use_ventilation_for_cooling: boolean;
    use_ventilation_for_heating: boolean;
}

function ThermocontrolDetails() {

    const [refreshInterval] = useLocalStorage('refreshInterval',5000);
    const [thermocontrolAPI] = useLocalStorage('thermocontrol-api',"http://192.168.88.30:9079/json");

    const [data, setData] = useState<ThermocontrolDataType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDataForPosts = async () => {
            try {
                const postsData = await axios.get<ThermocontrolDataType>(
                    thermocontrolAPI
                );
                //console.log(postsData)
                setData(postsData.data);
                setError(null);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.message);
                } else {
                    setError("error");
                }
            }
            finally {
                setLoading(false);
            }
        };

        fetchDataForPosts();

        const interval=setInterval(()=>{
            fetchDataForPosts()
            },refreshInterval)
       
       
           return()=>clearInterval(interval)
    }, []);

    function TemperatureInput() {
        const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
            useNumberInput({
                step: 0.5,
                defaultValue: 18,
                min: 5,
                max: 30,
                precision: 1,
            })

        const inc = getIncrementButtonProps()
        const dec = getDecrementButtonProps()
        const input = getInputProps()

        return (
            <HStack maxW='200px'>
                <Button {...dec}>-</Button>
                <Input {...input} value={data?.target_temperature}/>
                <Button {...inc}>+</Button>
            </HStack>
        )
    }

    function HumidityInput() {
        const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
            useNumberInput({
                step: 5,
                defaultValue: 70,
                min: 0,
                max: 100,
                precision: 0,
            })

        const inc = getIncrementButtonProps()
        const dec = getDecrementButtonProps()
        const input = getInputProps()

        return (
            <HStack maxW='200px'>
                <Button {...dec}>-</Button>
                <Input {...input} value={data?.target_humidity}/>
                <Button {...inc}>+</Button>
            </HStack>
        )
    }

    return (
        <Box width={"fit-content"} border={"2px"} borderColor={loading? "orange" : error? "red" : "green"} p={2}>
            <VStack align={"start"}>
                <Text className="shacktopus-heading">ThermoControl</Text>
                <Text>Target Temperature</Text>
                <TemperatureInput></TemperatureInput>
                <Divider></Divider>
                <Text>Target Humidity</Text>
                <HumidityInput></HumidityInput>
                <Divider></Divider>
                <Text>Extra ventilation</Text>
                <Slider defaultValue={1} min={0} max={1} step={0.1} value={data?.extra_ventilation}>
                    <SliderTrack >
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
                <Divider></Divider>
                <Text>Max heating power</Text>
                <Slider defaultValue={1} min={0} max={1} step={0.1} value={data?.max_heating_power}>
                    <SliderTrack >
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
                <Divider></Divider>
                <Divider></Divider>
                <Switch isChecked={data?.use_ventilation_for_heating}>Use ventilation for heating</Switch>
                <Divider></Divider>
                <Switch isChecked={data?.use_ventilation_for_cooling}>Use ventilation for cooling</Switch>
                <Divider></Divider>
                <Text>{"Data age: " + data?.climate_data_age}</Text>
                {data?.emergency_heating_is_active ? <Text>Emergency heating is active!</Text> : null}
            </VStack>
        </Box>
    )
}

export default ThermocontrolDetails;