import { Box, Divider, IconButton, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import "./../../fixturebox.scss"
import { AuxBoxProps } from "./AuxBox";
import { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const HEIGHT_LARGE = "500px";
const HEIGHT_SMALL = "197px"; // Same height as ThermocontrolDetails

function AuxDetails(props: AuxBoxProps) {

    const { indicator } = useThemeColors();

    const [height, setHeight] = useState(HEIGHT_SMALL);

    if (!props.error && props.loading)
        return <Skeleton className="fixturebox" width={"350px"} height={"250px"}></Skeleton>

    return (
        <div className="containerdiv">
            <div
                className={"fixturebox_background_color"} />
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
                            maxHeight={height}
                            overflowY={"scroll"}
                        //style={{
                        //    scrollbarWidth: "none"
                        //}}
                        >
                            {props.dataFromAPI ? Object.entries(props.dataFromAPI).map(([key, value]) => {

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

                                let readableValue = value !== null && value !== undefined
                                    ? typeof value === "number"
                                        ? (value < 0.01 ? 0 : value > 999 ? value.toFixed(0) : value.toFixed(2))
                                        : typeof value === "boolean"
                                            ? (value ? "True" : "False")
                                            : value.toString()
                                    : "null";

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
                <IconButton
                    width={"100%"}
                    height={"20px"}
                    onClick={() => setHeight((oldHeight) => oldHeight === HEIGHT_SMALL ? HEIGHT_LARGE : HEIGHT_SMALL

                    )} aria-label={"expand"}
                    icon={height === HEIGHT_SMALL ? <MdExpandMore /> : <MdExpandLess />}
                />
            </Box>
        </div>
    )
}

export default AuxDetails;