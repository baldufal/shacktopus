import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { RgbColor, RgbColorPicker } from "react-colorful";


function ParameterColorRGB(props: { name: string, red: number, green: number, blue: number, setValue: (newValue: { red: number, green: number, blue: number }) => void }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    // luminance > 127?
    const lightColor = ((Math.min(props.red, props.green, props.blue) + Math.max(props.red, props.green, props.blue)) / 2) > 0.5;

    return (
        <>
            <Box
                width={"fit-content"}
                //border={"2px"}
                p={2}
                paddingTop={"2px"}
                paddingBottom={"2px"}>

                <Text>{props.name}</Text>
                <Button
                marginTop={"2px"}
                    bg={`rgb(${props.red * 255}, ${props.green * 255}, ${props.blue * 255})`}
                    color={lightColor ? "black" : "white"}
                    padding={"10px"}
                    borderRadius={"5px"}
                    cursor={"pointer"}
                    onClick={onOpen}
                >
                    Pick Color
                </Button>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    width={"fit-content"}>
                    <ModalHeader>Pick Color</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RgbColorPicker
                            color={{ r: props.red * 255, g: props.green * 255, b: props.blue * 255 }}
                            onChange={({ r, g, b }: RgbColor) => { props.setValue({ red: r / 255, green: g / 255, blue: b / 255 }) }}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ParameterColorRGB;