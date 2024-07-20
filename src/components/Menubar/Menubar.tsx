import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, IconButton, Flex, Box, VStack } from "@chakra-ui/react";
import "./menubar.scss";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";

function Menubar() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate = useNavigate();

    const handleLinkClick = (path: string) => {
        navigate(path);
        onClose();
    };


    return (
        <Box
            width="100%"
            p={4}
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <IconButton
                className="topbarbutton"
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

                    <DrawerBody>
                        <VStack align={"start"}>


                            <Button variant="link" onClick={() => handleLinkClick('/')}>
                                Dashboard
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/thermocontrol')}>
                                Thermo Control
                            </Button>
                            <Button variant="link" onClick={() => handleLinkClick('/nothing-here')}>
                                Nothing here
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Menubar;