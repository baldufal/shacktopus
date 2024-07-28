import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, IconButton, Box, VStack, Switch, useColorMode, Divider, DrawerFooter, Text } from "@chakra-ui/react";
import "./menubar.scss";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Router/AuthContext";

function Menubar() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate = useNavigate();

    const auth = useAuth();

    const handleLinkClick = (path: string) => {
        navigate(path);
        onClose();
    };

    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Box
            width="100%"
            p={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <IconButton
                onClick={onOpen}
                aria-label={"open menu"}
                icon={<HamburgerIcon />} />

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Shacktopus</DrawerHeader>

                    <DrawerBody >
                        <VStack align={"start"} >
                            <Button variant="link" onClick={() => handleLinkClick('/kaleidoscope')}>
                                Kaleidoscope
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/heating')}>
                                Heating
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/settings')}>
                                Settings
                            </Button>
                            <Divider m="1em"></Divider>
                            <Switch
                                isChecked={colorMode === "dark"}
                                onChange={() => toggleColorMode()}>
                                Dark Mode
                            </Switch>



                        </VStack>
                    </DrawerBody>
                    <DrawerFooter>
                        <VStack>
                        <Text>{ auth.user}</Text>
                        <Button onClick={auth.logout}>Logout</Button>
                        </VStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Menubar;