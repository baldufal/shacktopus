import { Box, Text } from "@chakra-ui/react";
import { Switch } from "../ui/switch";


function ParameterBoolean(props: { name: string, value: boolean, setValue: (newValue: boolean) => void }) {

    return (
        <Box
            width={"fit-content"}
            border={"2px"}
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}>
                
                <Text>{props.name}</Text>
            <Switch
                checked={props.value}
                onCheckedChange={(event) =>
                    props.setValue(event.checked)}>
            </Switch>
        </Box>
    )
}

export default ParameterBoolean;