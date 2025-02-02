import { Box, Divider, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import "./../../fixturebox.scss"
import { AuxBoxProps } from "./AuxBox";

function AuxDetails(props: AuxBoxProps) {

    const { indicator } = useThemeColors();

    if (!props.error && props.loading)
        return <Skeleton className="fixturebox" width={"250px"} height={"250px"}></Skeleton>

    return (
        <Box
            className="fixturebox"
            width={"fit-content"}
            borderColor={props.borderColor}
            p={2}>
            {props.error ?
                <Text color={indicator.error}>{props.error}</Text> :
                <VStack
                    align={"start"}
                >
                    <Text className="fixturebox_heading">{props.title}</Text>
                    <Divider></Divider>
                    <VStack
                        align={"start"}
                        paddingRight={2}
                        marginRight={-2}
                        maxWidth={"400px"}
                        maxHeight={"500px"}
                        overflow={"scroll"}>{props.dataFromAPI ? Object.entries(props.dataFromAPI).map(([key, value]) => {

                            let symbol;
                            if (key.includes("dewpoint"))
                                symbol = "🔹";
                            else if (key.includes("target"))
                                symbol = "🎯";
                            else if (key.includes("energy"))
                                symbol = "⚡";
                            else if (key.includes("gas") || key.includes("iaq"))
                                symbol = "👃";
                            else if (key.includes("heating"))
                                symbol = "🔥";
                            else if (key.includes("power"))
                                symbol = "🔌";
                            else if (key.includes("heat"))
                                symbol = "🏜️";
                            else if (key.includes("temperature"))
                                symbol = "🌡️";
                            else if (key.includes("humidity"))
                                symbol = "💧";
                            else if (key.includes("pressure"))
                                symbol = "⚖️";
                            else if (key.includes("vent") || key.includes("umluft"))
                                symbol = "🌬️";
                            else if (key.includes("uptime"))
                                symbol = "🕓";
                            else if (key.includes("water_density"))
                                symbol = "👨‍🔬";
                            else
                                symbol = "❔";

                            let readableKey = key.replace(/_/g, " ");

                            let readableValue = value? typeof value === "number" ?
                                (value > 999 ? value.toFixed(0) : value.toFixed(2)) :
                                typeof value === "boolean" ? (value ? "True" : "False") : value.toString() : "null";

                            return (
                                <Box
                                    key={key}
                                    display="flex"
                                    justifyContent="space-between"
                                    width="100%"
                                >
                                    <Text>{symbol + " " + readableKey + ":"}</Text>
                                    <Text pl={2}>{readableValue}</Text>
                                </Box>
                            );
                        })
                            : <Text color={indicator.error}>There is no data to display.</Text>}</VStack>
                </VStack>
            }
        </Box>
    )
}

export default AuxDetails;