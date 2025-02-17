import { Box, Text, Switch } from "@chakra-ui/react";


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
                isChecked={props.value}
                onChange={(event) =>
                    props.setValue(event.target.checked)}>
            </Switch>
        </Box>
    )
}

export default ParameterBoolean;