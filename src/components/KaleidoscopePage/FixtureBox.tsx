import { Box, Button, Divider, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure, useTheme, VStack } from "@chakra-ui/react";
import { Fixture } from "./kaleidoscopeTypes";
import ParameterBox from "./ParameterBox";


const ALIASES: { [key: string]: string } = {
    'kitchen_rgbw': 'Kitchen Light',
    'kitchen_spots': 'Kitchen Spots',
    'klo_rgbw': 'Toilet Light',
    'lichterketten': 'Fairy Lights',
    'putzlicht': 'Outside Work Lights',
    'red_green_party_light': 'Party Spots red+green',
    'spoider': 'Spoider',
    'umluft': 'Air Circulation',
    'bedroom_light': 'Bedroom Light',
    'blacklight': 'Black Light',
    'front_door': 'Front Door Light',
};

function FixtureBox(props: { fixtureName: string, data: Fixture }) {

    const renderedName = (ALIASES[props.fixtureName] || props.fixtureName);
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
                        <Text>{renderedName}</Text>
                        <Button
                            marginStart={"10px"}
                            size={"20px"}
                            borderRadius={"20px"}
                            height={"20px"}
                            width={"20px"}
                            onClick={onOpen}>i</Button>
                    </Flex>

                    <Divider></Divider>
                    <HStack>
                        {programNames.map((programName) =>
                            <Button
                                key={programName}
                                margin="2px"
                                padding={"10px"}
                                bg={props.data.selected_program === programName ? contrastColor : bgColor}
                            >
                                {programName}</Button>)}
                    </HStack>
                    <HStack>
                        {parameterNames.map((parameterName) => 
                        <ParameterBox 
                        key={parameterName}
                        parameterName={parameterName} 
                        data={selectedProgram.parameters[parameterName]}/>)}
                    </HStack>


                </VStack>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{renderedName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align={"start"}>
                        <Text>{"API name: " + props.fixtureName}</Text>
                        <Text maxWidth={"300px"}>{"Output aliases: " + props.data.output_aliases.sort()}</Text>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>


    )
}

export default FixtureBox;