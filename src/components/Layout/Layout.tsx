import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Menubar, { menuItems } from "./Menubar";
import { useThemeColors } from "../../contexts/ThemeContext";

function Layout() {

    const { primary, secondary } = useThemeColors();
    const navigate = useNavigate();
    const location = useLocation();

    const [largeScreen, setScreenSize] = useState<boolean>(
        window.matchMedia("(min-width: 768px)").matches
    )

    useEffect(() => {
        window
            .matchMedia("(min-width: 768px)")
            .addEventListener('change', e => setScreenSize(e.matches));
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
        >
            <Menubar />
            {largeScreen ?
                <HStack
                    p={4}
                    align={"start"}>
                    <VStack marginTop={-4} >
                        {menuItems.map((item) =>
                            <IconButton
                                bg={isActive(item.path) ? secondary : primary}
                                icon={item.icon}
                                aria-label={item.name}
                                onClick={() => navigate(item.path)}
                            />)}
                    </VStack>
                    <Outlet />
                </HStack>
                :
                <Outlet />}


        </Box>

    );
}


export default Layout;