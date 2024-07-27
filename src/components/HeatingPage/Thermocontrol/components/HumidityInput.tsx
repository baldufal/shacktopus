import { useNumberInput, HStack, Button, Input } from "@chakra-ui/react"
import { ThermocontrolSettableDataType } from "../ThermocontrolDetails"

function HumidityInput(props: {dataFromUI: ThermocontrolSettableDataType, onChange : (humidity: number) => void}) {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            min: 0,
            max: 100,
            precision: 0,
            value: props.dataFromUI?.target_humidity,
            onChange: (_valueString, valueAsNumber) => props.onChange(valueAsNumber),
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


export default HumidityInput;