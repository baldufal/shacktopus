import { Box, Button, Divider, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../contexts/ThemeContext";
import "./../fixturebox.scss"
import { ScriptContainer } from "./scripting/Script";
import { validateScript } from "./scripting/validateScript";
import ParameterNumber from "./ParameterNumber";
import ParameterBoolean from "./ParameterBoolean";
import ParameterColorRGB from "./ParameterColorRGB";

function ScriptBox(props: { data: ScriptContainer }) {

    const { colorMode } = useColorMode()


    const { indicator } = useThemeColors();

    const { isOpen, onOpen, onClose } = useDisclosure()


    const script = validateScript(props.data.script)

    return (
        <>
            <Box
                width={"fit-content"}
                className="fixturebox"
                p={2}
                borderColor=
                {script.valid ?
                    indicator.ok : indicator.error}>
                <VStack align={"start"}>
                    <Flex >
                        <Text
                            className="fixturebox_heading"
                            bg={"var(--chakra-colors-chakra-body-bg)"}
                            borderRadius={"0.375rem"}
                            padding={"0.2rem"}
                            margin={"-0.2rem"}>
                            {props.data.name}
                        </Text>
                        <Button
                            marginTop={"1px"}
                            marginStart={"10px"}
                            size={"20px"}
                            borderRadius={"20px"}
                            height={"20px"}
                            width={"20px"}
                            onClick={onOpen}>i</Button>
                    </Flex>

                    <Divider></Divider>
                    {script.valid ?
                        <VStack align="start">
                            {script.script.parameters.map((parameter, index) => {
                                switch (parameter.type) {
                                    case "BOOLEAN":
                                        return <ParameterBoolean 
                                        name={parameter.name} 
                                        value={parameter.value} 
                                        setValue={function (newValue: boolean): void {
                                            console.log(newValue)
                                        } }/>
                                    case "NUMBER":
                                        return <ParameterNumber
                                            name={parameter.name}
                                            value={parameter.value}
                                            min={parameter.min}
                                            max={parameter.max}
                                            setValue={function (newValue: number): void {
                                                console.log(newValue);
                                            }} />
                                    case "COLOR_RGB":
                                        return <ParameterColorRGB
                                        name={parameter.name}
                                        red={parameter.red}
                                        green={parameter.green}
                                        blue={parameter.blue}
                                        setValue={function (newValue: {red: number, green: number, blue: number}): void {
                                            console.log(newValue);
                                        }}/>
                                    default:
                                        return <Text key={index}>Unknown Parameter</Text>;
                                }
                            })}
                        </VStack>

                        :
                        <Text>Script contains error: {script.error}</Text>}

                </VStack>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Heading</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align={"start"}>
                            <Text>Placeholder</Text>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>


    )
}

export default ScriptBox;