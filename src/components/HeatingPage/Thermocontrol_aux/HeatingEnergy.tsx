import { Box, Separator, Skeleton, Text, VStack } from "@chakra-ui/react";
import "./../../fixturebox.scss"
import { AuxBoxProps } from "./AuxBox";

function Energy(props: AuxBoxProps) {

    // All the data we need is there
    const dataFromAPI_ok = props.dataFromAPI &&
        props.dataFromAPI["energy_consumption_24h"] != undefined &&
        props.dataFromAPI["energy_consumption_current_W"] != undefined;

    if (!props.error && props.loading)
        return <Skeleton className="fixturebox" width={"250px"} height={"250px"}></Skeleton>

    if (!dataFromAPI_ok)
        return (<Box
            className="fixturebox"
            width={"fit-content"}
            borderColor={"indicator.error"}
            p={2}>
            {props.error ?
                <Text color={"indicator.error"}>{props.error}</Text> :
                <Text color={"indicator.error"}>{"Data from API missing"}</Text>
            }
        </Box>)

    const energy = props.dataFromAPI!["energy_consumption_24h"] as number;
    const power = props.dataFromAPI!["energy_consumption_current_W"] as number;

    return (
        <div className="containerdiv">
            <div className="backgroundTest" />

            <Box
                className="fixturebox"
                width={"fit-content"}
                borderColor={dataFromAPI_ok ? props.borderColor : "indicator.error"}
                p={2}
            //backgroundColor={"transparent"}
            >
                {props.error ?
                    <Text color={"indicator.error"}>{props.error}</Text> :
                    dataFromAPI_ok ?
                        <VStack

                            align={"start"}>
                            <Text className="fixturebox_heading">{props.title}</Text>

                            <Separator />
                            <Text>Current</Text>
                            {/*
                            <Progress
                                width={"100%"}
                                height={"1rem"}
                                max={1690}
                                value={power} />
                             */}

                            <Text>{power.toFixed(0) + " W"}</Text>


                            <Separator />
                            <Text>Last 24h</Text>
                            {/*
                            <Progress
                                width={"100%"}
                                height={"1rem"}
                                max={1690 * 24}
                                value={energy} />
                            */}

                            <Text>{(energy / 1000).toFixed(1) + " kWh"}</Text>


                        </VStack>
                        :
                        <Text color={"indicator.error"}>{"Data from API not okay"}</Text>
                }
            </Box>
        </div>

    )
}

export default Energy;