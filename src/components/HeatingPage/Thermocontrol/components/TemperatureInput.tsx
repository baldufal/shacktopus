import { useNumberInput, HStack, Button, Input } from "@chakra-ui/react"
import { ThermocontrolSettableDataType } from "../ThermocontrolDetails"

function TemperatureInput(props: {dataFromUI: ThermocontrolSettableDataType, onChange : (temp: number) => void}) {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 0.5,
            min: 5,
            max: 30,
            precision: 1,
            value: props.dataFromUI?.target_temperature,
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

export default TemperatureInput;