import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Menubar, { menuItems } from "./Menubar";
import { useThemeColors } from "../../contexts/ThemeContext";

function Layout() {

    const { primary, secondary } = useThemeColors();
    const navigate = useNavigate();
    const location = useLocation();

    const [largeScreen, setLargeScreen] = useState<boolean>(
        window.matchMedia("(min-width: 768px)").matches
    )

    const [hugeScreen, setHugeScreen] = useState<boolean>(
        window.matchMedia("(min-width: 1024px)").matches
    )

    useEffect(() => {
        const mediaQuery768 = window.matchMedia("(min-width: 768px)");
        const mediaQuery1024 = window.matchMedia("(min-width: 1024px)");
    
        const handle768Change = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setLargeScreen(e.matches);
        const handle1024Change = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setHugeScreen(e.matches);
    
        mediaQuery768.addEventListener('change', handle768Change);
        mediaQuery1024.addEventListener('change', handle1024Change);
    
        // Cleanup function
        return () => {
            mediaQuery768.removeEventListener('change', handle768Change);
            mediaQuery1024.removeEventListener('change', handle1024Change);
        };
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
                            (item.path != "/floorplan" || hugeScreen) ?
                                <IconButton
                                    key={item.name}
                                    bg={isActive(item.path) ? secondary : primary}
                                    icon={item.icon}
                                    aria-label={item.name}
                                    onClick={() => navigate(item.path)}
                                /> : null)}
                    </VStack>
                    <Outlet />
                </HStack>
                :
                <Outlet />}


        </Box>

    );
}


export default Layout;