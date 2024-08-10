import { Box, Button, Divider, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, useToast, VStack, Wrap } from "@chakra-ui/react";
import { Fixture } from "./kaleidoscopeTypes";
import ParameterBox from "./ParameterBox";
import { useKaleidoscopeSet } from "../../contexts/KaleidoscopeSetContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import { useEffect, useState } from "react";
import { FixtureName } from "../../contexts/KaleidoscopeUpdatesContext";




function FixtureBox(props: { fixtureName: FixtureName, data: Fixture }) {

    const { setProgram, error: kaleidoscopeSetError } = useKaleidoscopeSet();

    const programNames = Object.keys(props.data.programs).sort().filter((value) => value !== "EXTERNAL");
    const selectedProgram = props.data.programs[props.data.selected_program];
    const parameterNames = Object.keys(selectedProgram.parameters).sort();

    const { primary, secondary, indicator } = useThemeColors();

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
            <Box
                width={"fit-content"}
                border={"2px"} p={2}
                borderColor=
                {kaleidoscopeSetError ? indicator.read_only :
                    loading ?
                        indicator.dirty : indicator.ok}>
                <VStack align={"start"}>
                    <Flex>
                        <Text>{props.fixtureName.display}</Text>
                        <Button
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
                                bg={props.data.selected_program === programName ? secondary : primary}
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.fixtureName.display}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align={"start"}>
                            <Text>{"API name: " + props.fixtureName.original}</Text>
                            <Text maxWidth={"300px"}>{"Output aliases: " + props.data.output_aliases.sort()}</Text>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>


    )
}

export default FixtureBox;