import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, IconButton, Box, VStack, Switch, useColorMode, Divider } from "@chakra-ui/react";
import "./menubar.scss";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function Menubar() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate = useNavigate();

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

                            <Button variant="link" onClick={() => handleLinkClick('/')}>
                                Dashboard
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/heating')}>
                                Heating
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/settings')}>
                                Settings
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/nothing-here')}>
                                Nothing here
                            </Button>
                            <Divider m="1em"></Divider>
                            <Switch
                                isChecked={colorMode === "dark"}
                                onChange={() => toggleColorMode()}>
                                Dark Mode
                            </Switch>



                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Menubar;