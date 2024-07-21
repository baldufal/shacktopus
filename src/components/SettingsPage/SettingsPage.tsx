import { Button, Divider, HStack, Input, Text, useNumberInput, VStack } from "@chakra-ui/react";
import useLocalStorage from "use-local-storage";

const MIN_REFRESH_INTERVAL = 100;
const MAX_REFRESH_INTERVAL = 3600000;
const STEP_REFRESH_INTERVAL = 500;

function SettingsPage() {

    const [refreshInterval, setRefreshInterval] = useLocalStorage('refreshInterval',5000);

    function enforceRefreshRange(inputValue: number){
        if(inputValue < MIN_REFRESH_INTERVAL){
        setRefreshInterval(MIN_REFRESH_INTERVAL);}
        else{
            if(inputValue > MAX_REFRESH_INTERVAL){
                setRefreshInterval(MAX_REFRESH_INTERVAL);
            }
            setRefreshInterval(inputValue);
        }
    }

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: STEP_REFRESH_INTERVAL,
            value: refreshInterval,
            onChange: (_valueString, valueAsNumber) => enforceRefreshRange(valueAsNumber),
            min: MIN_REFRESH_INTERVAL,
            max: MAX_REFRESH_INTERVAL,
            precision: 0,
        });


    function IntervalInput() {
        const inc = getIncrementButtonProps();
        const dec = getDecrementButtonProps();
        const input = getInputProps();

        return (
            <HStack maxW='200px'>
                <Button {...dec}>-</Button>
                <Input {...input} />
                <Button {...inc}>+</Button>
            </HStack>
        );
    }

    return (
        <VStack>
            <Text>Refresh interval [ms]</Text>
            <IntervalInput />
            <Divider />
        </VStack>
    );
}

export default SettingsPage;
