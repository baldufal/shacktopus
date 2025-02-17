import { Box, Text, Switch } from "@chakra-ui/react";


function ParameterColorRGB(props: { name: string, red: number, green: number, blue: number, setValue: (newValue: { red: number, green: number, blue: number }) => void }) {

    return (
        <Box
            width={"fit-content"}
            border={"2px"}
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}>

            <Text>{props.name}</Text>
            <Box
                bg={`rgb(${props.red * 255}, ${props.green * 255}, ${props.blue * 255})`}>
                <Text>Select color</Text>
            </Box>
        </Box>
    )
}

export default ParameterColorRGB;