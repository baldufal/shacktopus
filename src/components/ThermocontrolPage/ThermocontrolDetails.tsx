import { Box, Button, Divider, HStack, Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, useNumberInput, VStack } from "@chakra-ui/react";

function ThermocontrolDetails() {

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
                <Input {...input} />
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
                <Input {...input} />
                <Button {...inc}>+</Button>
            </HStack>
        )
    }

    return (
        <Box width={"fit-content"} border={"2px"} p={2}>
            <VStack>
                <Text>Target Temperature</Text>
                <TemperatureInput></TemperatureInput>
                <Divider></Divider>
                <Text>Target Humidity</Text>
                <HumidityInput></HumidityInput>
                <Divider></Divider>
                <Text>Extra ventilation</Text>
                <Slider defaultValue={1} min={0} max={1} step={0.1}>
                    <SliderTrack >
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
                <Divider></Divider>
                <Text>Max heating power</Text>
                <Slider defaultValue={1} min={0} max={1} step={0.1}>
                    <SliderTrack >
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
                <Divider></Divider>
                <Divider></Divider>
                <Switch>Use ventilation for heating</Switch>
                <Divider></Divider>
                <Switch>Use ventilation for cooling</Switch>
            </VStack>
        </Box>
    )
}

export default ThermocontrolDetails;