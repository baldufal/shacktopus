import { Box, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useColorMode, useDisclosure, Text } from "@chakra-ui/react";
import floorplan from "./../../assets/floorplan.png"
import { MdLight } from "react-icons/md";
import "./../fixturebox.scss"
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import { useState } from "react";
import { KNOWN_FIXTURES } from "../KaleidoscopePage/KNOWN_FIXTURES";

function FloorPlanPage() {

    const { fixturesData, fixtureNames, error } = useKaleidoscope();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { colorMode } = useColorMode()
    const darkMode = colorMode === "dark";

    const [clickedFixture, setClickedFixture] = useState<string>("");

    const clickOnFixture = (fixtureName: string) => {
        setClickedFixture(fixtureName);
        onOpen();
    }

    return (
        <>
            <Box
                as="main"
                flex="1"
                // p={4}
                paddingTop={0}
                width="100%"
            >

                <div
                    style={{ position: "relative",
                        display: "inline-block", // Ensures that the div wraps around the image
            width: "auto", // Ensures the width adjusts to the image size
                     }}
                >
                    {fixtureNames && fixturesData ?
                        fixtureNames.map((name) =>
                            (KNOWN_FIXTURES[name.original]
                                && KNOWN_FIXTURES[name.original].floorplan_position) ?
                                <div
                                    key={name.original}
                                    style={{
                                        zIndex: 1,
                                        position: "absolute",
                                        top: KNOWN_FIXTURES[name.original].floorplan_position!.top,
                                        left: KNOWN_FIXTURES[name.original].floorplan_position!.left,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <IconButton
                                        zIndex={1}
                                        aria-label={name.original}
                                        onClick={() => clickOnFixture(name.original)}
                                        icon={<MdLight />}
                                    />
                                </div>
                                : null)
                        : null}
                    < Image
                        zIndex={0}
                        opacity={0.8}
                        filter={darkMode ? "invert(100%)" : ""}
                        src={floorplan}
                    />
                </div>

            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        {error ? (
                            <Text>{error}</Text>
                        ) : fixtureNames && fixturesData ? (
                            <div key={7}>
                                <FixtureBox
                                    key={77}
                                    fixtureName={KNOWN_FIXTURES[clickedFixture]}
                                    data={fixturesData.fixtures[clickedFixture]}
                                />
                                <div />
                            </div>
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );

}

export default FloorPlanPage;