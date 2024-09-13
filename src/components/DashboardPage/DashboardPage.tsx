import { Box, Wrap, Text, Button, Flex, Spacer, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, VStack, useDisclosure, Divider, HStack, IconButton } from "@chakra-ui/react";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails";
import { FixtureName, useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "./../fixturebox.scss"
import { useState } from "react";
import { MdAdd, MdMoveUp, MdRemove } from "react-icons/md";
import { TiDelete } from "react-icons/ti";


function DashboardPage() {
    const { fixturesData, fixtureNames, error } = useKaleidoscope();

    const allTiles: FixtureName[] = [
        { display: "Thermocontrol", original: "tc" },
        ...(fixtureNames ? fixtureNames : [])
    ];

    const [selectedTiles, setSelectedTiles] = useState<FixtureName[]>([]);

    const { isOpen, onOpen, onClose } = useDisclosure()


    return (<>

        <Flex paddingEnd={4}>
            <Spacer></Spacer>
            <Button onClick={onOpen}>Edit Dashboard</Button>

        </Flex>
        <Box as="main" flex="1" p={4} width="100%">
            <Wrap>

                {error ? <Text color={"red"}>{"Error reading Kaleidoscope data: " + error}</Text> :
                    fixtureNames && fixturesData ?
                        fixtureNames.map((fixtureName, index) =>
                            <FixtureBox
                                key={index}
                                fixtureName={fixtureName}
                                data={fixturesData.fixtures[fixtureName.original]} />)
                        : <Text>Loading...</Text>}
                <ThermocontrolDetails></ThermocontrolDetails>
            </Wrap>


        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{"Edit Dashboard"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align={"start"}>
                        <Text>Select tiles and configure their order.</Text>
                        <Divider></Divider>
                        <Text>Selected</Text>

                        <VStack align={"start"}>
                            {selectedTiles.map((tile, index) => (
                                <HStack key={tile.original}>
                                    

                                    {/* Move Up Button */}
                                    <IconButton
                                    isRound={true}
                                    aria-label="move up"
                                    icon={<MdMoveUp></MdMoveUp>}
                                        onClick={() => {
                                            if (index > 0) {
                                                setSelectedTiles((selected) => {
                                                    const newSelected = [...selected];
                                                    [newSelected[index], newSelected[index - 1]] = [newSelected[index - 1], newSelected[index]]; // Swap with previous element
                                                    return newSelected;
                                                });
                                            }
                                        }}
                                        isDisabled={index === 0} // Disable if the tile is the first item
                                    >
                                        ^
                                    </IconButton>

                                    <Text>{tile.display}</Text>
                                    <IconButton 
                                    isRound={true}
                                    padding={"0"}
                                    aria-label="remove"
                                    icon={<MdRemove/>}
                                    onClick={() =>
                                        setSelectedTiles((selected) =>
                                            selected.filter(value => value.original !== tile.original))}>
                                        
                                    </IconButton>
                                </HStack>
                            ))}

                        </VStack>
                        <Text>Available</Text>

                        <VStack align={"start"}>
                            {allTiles.filter(tile =>
                                selectedTiles.findIndex(selected =>
                                    selected.original === tile.original) === -1).map((unselected =>
                                        <HStack>
                                            <IconButton 
                                            aria-label={"add"}
                                            icon={<MdAdd></MdAdd>}
                                            isRound={true}
                                            onClick={() =>
                                                setSelectedTiles((selected) =>
                                                    [...selected, unselected])}>
                                                +</IconButton>
                                            <Text>{unselected.display}</Text>
                                        </HStack>
                                    ))}
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
    );
}

export default DashboardPage;