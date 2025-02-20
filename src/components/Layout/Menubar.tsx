import {
    Button, IconButton, Box, VStack, Text, Heading, Spacer, MenuItem, HStack, Icon,
    Separator,
    Link
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Router/AuthContext";
import { MdArchitecture, MdDashboard, MdLightbulb, MdSettings } from "react-icons/md";
import { IoIosFlame } from "react-icons/io";
import { TbScript } from "react-icons/tb";
import { useColorMode } from "../ui/color-mode";
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import React, { useState } from "react";
import { Switch } from "../ui/switch";

export type MenuItem = {
    name: string;
    path: string;
    icon: JSX.Element;
    as: React.ElementType;
}

export const menuItems: MenuItem[] = [
    {
        name: "Dashboard",
        path: "/",
        icon: <MdDashboard />,
        as: MdDashboard
    },
    {
        name: "Floor Plan",
        path: "/floorplan",
        icon: <MdArchitecture />,
        as: MdArchitecture
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
        name: "Scripts",
        path: "/scripts",
        icon: <TbScript />,
        as: TbScript
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

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();

    const handleLinkClick = (path: string) => {
        navigate(path);
        setOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const locationString = menuItems.find((menuItem) => menuItem.path === location.pathname)?.name || ""

    return (
        <Box
            width="100%"
            p={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center">

            <DrawerRoot
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
                placement={"start"}
                >
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    <IconButton
                        onClick={() => setOpen(true)}
                        aria-label={"open menu"}>
                        <HamburgerIcon />
                    </IconButton>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Shacktopus</DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack
                            align={"start"}>
                            {menuItems.map((menuitem, index) => <HStack
                                key={index}
                                alignItems={"center"}>
                                <Icon
                                    key={menuitem.name + "icon"}
                                    as={menuitem.as}
                                    color={isActive(menuitem.path) ? "brand.secondary.solid" : "brand.solid"}
                                    onClick={() => handleLinkClick(menuitem.path)} />
                                <Link
                                    key={menuitem.name + "button"}
                                    marginBottom={"0.1rem"}
                                    onClick={() => handleLinkClick(menuitem.path)}
                                    color={isActive(menuitem.path) ? "brand.secondary.solid" : "brand.solid"}
                                >
                                    {menuitem.name}
                                </Link>
                            </HStack>
                            )}
                            <Separator m="1em"></Separator>
                            <Switch
                                checked={colorMode === "dark"}
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
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>

            <Heading
                marginStart={"10px"}
            >{locationString}</Heading>

            <Spacer></Spacer>



        </Box>

    )
}

export default Menubar;