import { Box, Button, Divider, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure, useToast, VStack, Wrap } from "@chakra-ui/react";
import { Fixture } from "./kaleidoscopeTypes";
import ParameterBox from "./ParameterBox";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import { useEffect, useState } from "react";
import "./../fixturebox.scss"
import { FixtureName } from "../DashboardPage/obtainTiles";


function FixtureBox(props: { fixtureName: FixtureName, data: Fixture }) {

    const { colorMode } = useColorMode()

    const { setProgram, error: kaleidoscopeSetError } = useKaleidoscope();

    const programNames = Object.keys(props.data.programs)
        .sort()
        .filter((value) => value !== "EXTERNAL")
        // Explicitely sort OFF, ON, MANUAL to the front
        .sort((a, b) => {
            const priority = ["OFF", "ON", "MANUAL"];
            const aIndex = priority.indexOf(a);
            const bIndex = priority.indexOf(b);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return 0;
        });
    const selectedProgram = props.data.programs[props.data.selected_program];
    const parameterNames = Object.keys(selectedProgram.parameters).sort();

    const { indicator } = useThemeColors();

    const { isOpen, onOpen, onClose } = useDisclosure()

    // API request was sent and not yet answered
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useToast()

    useEffect(() => {
        setLoading(false);
    }, [props.data.selected_program]);

    function changeProgram(programName: string) {
        setLoading(true);
        const error = setProgram(props.fixtureName.original, programName)
        if (error)
            toast({
                title: "Error",
                description: error,
                status: "error",
                duration: 2000,
                isClosable: true
            })
    }

    return (
        <>
            <div className="containerdiv">
                {props.data.selected_program !== "OFF" ?
                    <div
                        className="fixturebox_background_image"
                        style={{
                            backgroundImage: props.fixtureName.background_active,
                            opacity: 1,
                            zIndex: -2,
                        }} />
                    : null
                }
                <div
                    className={"fixturebox_background_color"} />

                <div
                    className={"fixturebox_background_image " +
                        (colorMode === "light" ? "" : "inverted")}
                    style={{ backgroundImage: props.fixtureName.background_inactive }} />
                <Box
                    position={"relative"}
                    width={"fit-content"}
                    className="fixturebox"
                    p={2}
                    borderColor=
                    {kaleidoscopeSetError ? indicator.read_only :
                        loading ?
                            indicator.dirty : indicator.ok}>
                    <VStack align={"start"}>
                        <Flex >
                            <Text
                                className="fixturebox_heading"
                                bg={"var(--chakra-colors-chakra-body-bg)"}
                                borderRadius={"0.375rem"}
                                padding={"0.2rem"}
                                paddingRight={"30px"}
                                margin={"-0.2rem"}>
                                {props.fixtureName.display}
                            </Text>
                            <Button
                                position={"absolute"}
                                top={"4px"}
                                right={"4px"}
                                marginTop={"1px"}
                                marginStart={"10px"}
                                size={"20px"}
                                borderRadius={"20px"}
                                height={"20px"}
                                width={"20px"}
                                onClick={onOpen}>i</Button>
                        </Flex>

                        <Divider></Divider>
                        <Wrap maxWidth={"300"}>
                            {programNames.map((programName) =>
                                <Button
                                    isDisabled={kaleidoscopeSetError ? true : false}
                                    key={programName}
                                    margin="2px"
                                    padding={"10px"}
                                    borderWidth={props.data.selected_program === programName ? "5px" : undefined}
                                    borderColor={props.data.selected_program === programName ?
                                        props.data.selected_program === "OFF" ? "var(--chakra-colors-primary-700)" : "var(--chakra-colors-secondary-700)"
                                        : undefined}
                                    //fontSize={props.data.selected_program === programName ? undefined : "smaller"}
                                    colorScheme={props.data.selected_program === programName ?
                                        props.data.selected_program === "OFF" ? "primary" : "secondary"
                                        : "grey"}
                                    onClick={() => changeProgram(programName)}
                                >
                                    {programName}</Button>)}
                        </Wrap>
                        <VStack align={"start"}>
                            {parameterNames.map((parameterName) =>
                                <ParameterBox
                                    key={parameterName}
                                    fixture={props.fixtureName.original}
                                    program={props.data.selected_program}
                                    parameterName={parameterName}
                                    data={selectedProgram.parameters[parameterName]} />)}
                        </VStack>
                    </VStack>
                </Box>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.fixtureName.display}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align={"start"}>
                            <Text>{"API name: " + props.fixtureName.original}</Text>
                            <Text maxWidth={"300px"}>{"Output aliases: " + props.data.output_aliases.sort()}</Text>
                            {props.fixtureName.rooms &&
                                <Text maxWidth={"300px"}>{"Areas: " + props.fixtureName.rooms}</Text>}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>


    )
}

export default FixtureBox;