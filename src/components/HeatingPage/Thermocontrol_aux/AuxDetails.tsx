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
                                if (typeof value === "number")
                                    return <Text key={key}>{key + ": " + value.toFixed(2)}</Text>
                                if (typeof value === "string")
                                    return <Text key={key}>{key + ": " + value}</Text>
                                if (typeof value === "boolean")
                                    return <Text key={key}>{key + ": " + (value ? "True" : "False")}</Text>
                            })
                                : <Text color={indicator.error}>There is no data to display.</Text>}</VStack>


                    </VStack>
                }
            </Box>
    )
}

export default AuxDetails;