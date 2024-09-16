import { Box, Divider, Progress, Text, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import "./../../fixturebox.scss"
import { ThermocontrolAuxData } from "../Thermocontrol/ThermocontrolDetails";

function Energy(props: {title: string, error: string | undefined, stale: boolean, dataFromAPI: ThermocontrolAuxData | undefined, borderColor: string }) {

    const { indicator } = useThemeColors();

    // All the data we need is there
    const dataFromAPI_ok = props.dataFromAPI &&
        props.dataFromAPI["energy_consumption_24h"] &&
        props.dataFromAPI["energy_consumption_current"];

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

    const energy = props.dataFromAPI!["energy_consumption_24h"] as number;
    const power = props.dataFromAPI!["energy_consumption_current"] as number;

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
                        <Text>Current</Text>
                        <Progress
                            width={"100%"}
                            height={"1rem"}
                            max={1.69}
                            value={power} />
                        <Text>{power.toFixed(2) + " kW"}</Text>


                        <Divider />
                        <Text>Last 24h</Text>
                        <Progress
                        width={"100%"}
                        height={"1rem"}
                            max={1.69 * 24}
                            value={energy} />
                        <Text>{energy.toFixed(2) + " kWh"}</Text>


                    </VStack>
                    :
                    <Text color={indicator.error}>{"Data from API not okay"}</Text>
            }
        </Box>
    )
}

export default Energy;