import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Menubar, { menuItems } from "./Menubar";

function Layout() {

    const navigate = useNavigate();
    const location = useLocation();

    const [largeScreen, setLargeScreen] = useState<boolean>(
        window.matchMedia("(min-width: 768px)").matches
    )

    useEffect(() => {
        const mediaQuery768 = window.matchMedia("(min-width: 768px)");
        const handle768Change = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setLargeScreen(e.matches);
        mediaQuery768.addEventListener('change', handle768Change);

        return () => {
            mediaQuery768.removeEventListener('change', handle768Change);
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
                            <IconButton
                                key={item.name}
                                colorScheme={isActive(item.path) ? "secondary" : "primary"}
                                aria-label={item.name}
                                onClick={() => navigate(item.path)}>
                                {item.icon}
                            </IconButton>
                        )}
                    </VStack>
                    <Outlet />
                </HStack>
                :
                <Outlet />}


        </Box>

    );
}


export default Layout;