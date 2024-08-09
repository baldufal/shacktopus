import { Box, Button, Divider, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure, useTheme, VStack, Wrap } from "@chakra-ui/react";
import { Fixture } from "./kaleidoscopeTypes";
import ParameterBox from "./ParameterBox";
import { FixtureName } from "./KaleidoscopeUpdatesContext";
import { useKaleidoscopeSet } from "./KaleidoscopeSetContext";




function FixtureBox(props: { fixtureName: FixtureName, data: Fixture }) {

    const { setProgram, error } = useKaleidoscopeSet();

    const programNames = Object.keys(props.data.programs).sort().filter((value) => value !== "EXTERNAL");
    const selectedProgram = props.data.programs[props.data.selected_program];
    const parameterNames = Object.keys(selectedProgram.parameters).sort();

    const { colorMode } = useColorMode();
    const theme = useTheme();
    const bgColor = colorMode === 'dark' ? theme.colors.primary[200] : theme.colors.primary[500];
    const contrastColor = colorMode === 'dark' ? theme.colors.secondary[400] : theme.colors.secondary[700];
    const fgColor = colorMode === 'dark' ? "black" : "white";

    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>
            <Box width={"fit-content"} border={"2px"} p={2}>
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
                                key={programName}
                                margin="2px"
                                padding={"10px"}
                                bg={props.data.selected_program === programName ? contrastColor : bgColor}
                                onClick={() => console.log(setProgram(props.fixtureName.original, programName))}
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