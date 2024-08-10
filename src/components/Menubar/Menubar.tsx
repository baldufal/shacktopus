import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, IconButton, Box, VStack, Switch, useColorMode, Divider, DrawerFooter, Text, useTheme, Heading, Spacer } from "@chakra-ui/react";
import "./menubar.scss";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Router/AuthContext";

function Menubar() {

    const { colorMode, toggleColorMode } = useColorMode()
    const theme = useTheme();
    const foregroundColor = colorMode === 'dark' ? theme.colors.primary[200] : theme.colors.primary[500];
    const contrastColor = colorMode === 'dark' ? theme.colors.secondary[400] : theme.colors.secondary[700];

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

            <Heading marginStart={"10px"} color={'primary.700'}>{locationString}</Heading>

            <Spacer></Spacer>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader color={'primary.700'}>Shacktopus</DrawerHeader>

                    <DrawerBody >
                        <VStack align={"start"} >
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/')}
                                color={isActive('/') ? contrastColor : foregroundColor}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/kaleidoscope')}
                                color={isActive('/kaleidoscope') ? contrastColor : foregroundColor}
                            >
                                Kaleidoscope
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/heating')}
                                color={isActive('/heating') ? contrastColor : foregroundColor}
                            >
                                Heating
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleLinkClick('/settings')}
                                color={isActive('/settings') ? contrastColor : foregroundColor}
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