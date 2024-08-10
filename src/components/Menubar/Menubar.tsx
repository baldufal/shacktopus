import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, IconButton, Box, VStack, Switch, useColorMode, Divider, DrawerFooter, Text, Heading, Spacer } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Router/AuthContext";
import { useThemeColors } from "../../ThemeContext";

function Menubar() {

    const { colorMode, toggleColorMode } = useColorMode()
    const { primary, secondary } = useThemeColors();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();

    const handleLinkClick = (path: string) => {
        navigate(path);
        onClose();
    };

    const isActive = (path: string) => location.pathname === path;

    let locationString = "";
    switch (location.pathname) {
        case "/":
            locationString = "Dashboard";
            break;
        case "/kaleidoscope":
            locationString = "Kaleidoscope";
            break;
        case "/heating":
            locationString = "Heating";
            break;
        case "/settings":
            locationString = "Settings"
            break;
    }

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

            <Heading
                marginStart={"10px"}
            >{locationString}</Heading>

            <Spacer></Spacer>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader >Shacktopus</DrawerHeader>

                    <DrawerBody >
                        <VStack align={"start"} >
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/')}
                                color={isActive('/') ? secondary : primary}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/kaleidoscope')}
                                color={isActive('/kaleidoscope') ? secondary : primary}
                            >
                                Kaleidoscope
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/heating')}
                                color={isActive('/heating') ? secondary : primary}
                            >
                                Heating
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/settings')}
                                color={isActive('/settings') ? secondary : primary}
                            >
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
                            <Text>{auth.user}</Text>
                            <Button onClick={auth.logout}>Logout</Button>
                        </VStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Menubar;