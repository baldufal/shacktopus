import { Box, CircularProgress, CircularProgressLabel, Divider, HStack, Icon, Progress, Text, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import "./../../fixturebox.scss"
import { ThermocontrolAuxData } from "../Thermocontrol/ThermocontrolDetails";
import { ColorTriple, interpolateColor } from "./interpolateColor";
import { GiPoisonGas } from "react-icons/gi";

function ClimateDetails(props: { title: string, error: string | undefined, stale: boolean, dataFromAPI: ThermocontrolAuxData | undefined, borderColor: string }) {

    const { indicator } = useThemeColors();

    // All the data we need is there
    const dataFromAPI_ok = props.dataFromAPI &&
        props.dataFromAPI["temperature_inside"] &&
        props.dataFromAPI["humidity_inside"] &&
        props.dataFromAPI["gas_inside"] &&
        props.dataFromAPI["temperature_outside"] &&
        props.dataFromAPI["humidity_outside"] &&
        props.dataFromAPI["temperature_basement"];

    if (props.error || !dataFromAPI_ok)
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
    const gas_inside = props.dataFromAPI!["gas_inside"] as number;
    const temp_outside = props.dataFromAPI!["temperature_outside"] as number;
    const hum_outside = props.dataFromAPI!["humidity_outside"] as number;
    const temp_basement = props.dataFromAPI!["temperature_basement"] as number;

    const tempColors: [number, ColorTriple][] = [
        [10, [0, 20, 200]],   // Blue
        [15, [0, 200, 190]],  // Teal
        [20, [0, 200, 20]],    // Green
        [25, [0, 200, 20]],    // Green
        [30, [200, 0, 0]],    // Red
    ];

    const humColors: [number, ColorTriple][] = [
        [0, [200, 0, 0]],   // Red
        [35, [200, 200, 0]],  // Yellow
        [40, [0, 200, 20]],  // Green
        [60, [0, 200, 20]],  // Green
        [65, [0, 200, 190]],  // Teal
        [100, [0, 20, 200]],    // Blue
    ];


    return (
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
                        <HStack>
                            <CircularProgress
                                color={interpolateColor(temp_inside, tempColors)}
                                size={"4rem"}
                                min={0}
                                max={30}
                                capIsRound={true}
                                value={temp_inside} >
                                <CircularProgressLabel>{temp_inside.toFixed(1) + "°C"}</CircularProgressLabel>
                            </CircularProgress>
                            <CircularProgress
                                color={interpolateColor(hum_inside, humColors)}
                                size={"4rem"}
                                min={0}
                                max={100}
                                capIsRound={true}
                                value={hum_inside} >
                                <CircularProgressLabel>{hum_inside.toFixed(0) + "%"}</CircularProgressLabel>

                            </CircularProgress>
                        </HStack>
                        <HStack width={"100%"}>
                            <Icon as={GiPoisonGas} />
                            <Progress
                                width={"100%"}
                                height={"1rem"}
                                min={40}
                                max={120}
                                value={gas_inside / 1000} />
                        </HStack>

                        <Divider />
                        <Text>Basement</Text>
                        <CircularProgress
                            color={interpolateColor(temp_basement, tempColors)}
                            size={"4rem"}
                            min={0}
                            max={30}
                            capIsRound={true}
                            value={temp_basement} >
                            <CircularProgressLabel>{temp_basement.toFixed(1) + "°C"}</CircularProgressLabel>
                        </CircularProgress>
                        <Divider />
                        <Text>Outside</Text>
                        <HStack>
                            <CircularProgress
                                color={interpolateColor(temp_outside, tempColors)}
                                size={"4rem"}
                                min={0}
                                max={30}
                                capIsRound={true}
                                value={temp_outside} >
                                <CircularProgressLabel>{temp_outside.toFixed(1) + "°C"}</CircularProgressLabel>
                            </CircularProgress>
                            <CircularProgress
                                color={interpolateColor(hum_outside, humColors)}
                                size={"4rem"}
                                min={0}
                                max={100}
                                capIsRound={true}
                                value={hum_outside} >
                                <CircularProgressLabel>{hum_outside.toFixed(0) + "%"}</CircularProgressLabel>
                            </CircularProgress>
                        </HStack>


                    </VStack>
                    :
                    <Text color={indicator.error}>{"Data from API not okay"}</Text>
            }
        </Box>
    )
}

export default ClimateDetails;