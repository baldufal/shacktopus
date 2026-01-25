import { Box, Divider, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import "./../../fixturebox.scss"
import { AuxBoxProps } from "./AuxBox";

function ClimateDetails(props: AuxBoxProps) {

    const { indicator } = useThemeColors();

    // All the data we need is there
    const dataFromAPI_ok = props.dataFromAPI &&
        props.dataFromAPI["temperature_inside"] != undefined &&
        props.dataFromAPI["humidity_inside"] != undefined &&
        props.dataFromAPI["gas_inside"] != undefined &&
        props.dataFromAPI["temperature_outside"] != undefined &&
        props.dataFromAPI["humidity_outside"] != undefined &&
        props.dataFromAPI["temperature_basement"] != undefined;

    if (!props.error && props.loading)
        return <Skeleton className="fixturebox" width={"200px"} height={"300px"}></Skeleton>


    if (!dataFromAPI_ok && !props.loading)
        return (<Box
            className="fixturebox"
            width={"fit-content"}
            borderColor={indicator.error}
            p={2}>
            {props.error ?
                <Text color={indicator.error}>{props.error}</Text> :
                <Text color={indicator.error}>{"Data from API missing"}</Text>
            }
        </Box>)

    const temp_inside = props.dataFromAPI!["temperature_inside"] as number;
    const hum_inside = props.dataFromAPI!["humidity_inside"] as number;
    //const gas_inside = props.dataFromAPI!["gas_inside"] as number;
    const temp_outside = props.dataFromAPI!["temperature_outside"] as number;
    const hum_outside = props.dataFromAPI!["humidity_outside"] as number;
    const temp_basement = props.dataFromAPI!["temperature_basement"] as number;

    return (
        <div className="containerdiv">
            <div
                className={"fixturebox_background_color"} />
            <Box
                className="fixturebox"
                width={"fit-content"}
                borderColor={dataFromAPI_ok ? props.borderColor : indicator.error}
                p={2}>
                {props.error ?
                    <Text color={indicator.error}>{props.error}</Text> :
                    dataFromAPI_ok ?
                        <VStack align={"start"}>
                            <Text className="fixturebox_heading">{props.title}</Text>
                            <Divider />
                            <Text>Inside</Text>
                            <Text >{"🌡️ " + temp_inside.toFixed(1) + "°C 💧 " + hum_inside.toFixed(0) + "%"}</Text>

                            <Divider />
                            <Text>Basement</Text>
                            <Text >{"🌡️ " + temp_basement.toFixed(1) + "°C"}</Text>

                            <Divider />
                            <Text>Outside</Text>
                            <Text >{"🌡️ " + temp_outside.toFixed(1) + "°C 💧 " + hum_outside.toFixed(0) + "%"}</Text>

                        </VStack>
                        :
                        <Text color={indicator.error}>{"Data from API not okay"}</Text>
                }
            </Box>
        </div>
    )
}

export default ClimateDetails;