import { Box, Text} from "@chakra-ui/react";
import { Slider } from "../ui/slider";


function ParameterNumber(props: { name: string, value: number, min: number, max: number, setValue: (newValue: number) => void }) {



    return (
        <Box
            width={"fit-content"}
            border={"2px"}
            p={2}
            paddingTop={"2px"}
            paddingBottom={"2px"}>
            <Text>{props.name}</Text>
            <Slider
                minWidth={"250px"}
                min={props.min}
                max={props.max}
                //step={0.1}
                value={[props.value]}
                onValueChange={(event) => {
                    props.setValue(event.value[0])
                }}>
            </Slider>
        </Box>
    )
}

export default ParameterNumber;