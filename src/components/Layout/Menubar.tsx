import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, IconButton, Box, VStack, Switch, useColorMode, Divider, DrawerFooter, Text, Heading, Spacer, MenuItem, HStack, Icon, As } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Router/AuthContext";
import { useThemeColors } from "../../contexts/ThemeContext";
import { MdDashboard, MdLightbulb, MdSettings } from "react-icons/md";
import { IoIosFlame } from "react-icons/io";

export type MenuItem = {
    name: string;
    path: string;
    icon: JSX.Element;
    as: As;
}

export const menuItems: MenuItem[] = [
    {
        name: "Dashboard",
        path: "/",
        icon: <MdDashboard />,
        as: MdDashboard
    },
    {
        name: "Kaleidoscope",
        path: "/kaleidoscope",
        icon: <MdLightbulb />,
        as: MdLightbulb
    },
    {
        name: "Heating",
        path: "/heating",
        icon: <IoIosFlame />,
        as: IoIosFlame
    },
    {
        name: "Settings",
        path: "/settings",
        icon: <MdSettings />,
        as: MdSettings
    }
]

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
                            {menuItems.map((menuitem) =>
                                <HStack alignItems={"center"}>
                                    <Icon
                                        as={menuitem.as}
                                        color={isActive(menuitem.path) ? secondary : primary}
                                        onClick={() => handleLinkClick(menuitem.path)}
                                    />
                                    <Button
                                        key={menuitem.name}
                                        marginBottom={"0.1rem"}
                                        variant="link"
                                        onClick={() => handleLinkClick(menuitem.path)}
                                        color={isActive(menuitem.path) ? secondary : primary}
                                    >
                                        {menuitem.name}
                                    </Button>
                                </HStack>
                            )}
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
                            <Text>{auth.userData?.username}</Text>
                            <Button onClick={auth.logout}>Logout</Button>
                        </VStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Menubar;