import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, Button, ModalHeader, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FixtureName } from "../../DashboardPage/obtainTiles";
import { FixturesData } from "../../KaleidoscopePage/kaleidoscopeTypes";
import FixtureBox from "../../KaleidoscopePage/FixtureBox";
import RadiantHeaters from "../../HeatingPage/Thermocontrol/RadiantHeaters";

export type RoomName = "kitchen" | "toilet" | "main room" | "bedroom" | "annex" | "awning";

type Room = {
    name: RoomName,
    display: string
    top: string,
    left: string,
    width: string,
    height: string
}

const rooms: Room[] = [
    {
        name: "kitchen",
        display: "Kitchen",
        top: "8%",
        left: "23.7%",
        width: "29.9%",
        height: "18.3%"
    },
    {
        name: "toilet",
        display: "Toilet",
        top: "8%",
        left: "55.9%",
        width: "12.7%",
        height: "13.3%"
    },
    {
        name: "main room",
        display: "Main Room",
        top: "27.8%",
        left: "8%",
        width: "60.6%",
        height: "34.3%"
    },
    {
        name: "bedroom",
        display: "Bedroom",
        top: "8%",
        left: "8%",
        width: "14.3%",
        height: "26.2%"
    },
    {
        name: "annex",
        display: "Annex",
        top: "65%",
        left: "9%",
        width: "50%",
        height: "28.1%"
    },
    {
        name: "awning",
        display: "Awning",
        top: "9%",
        left: "71.4%",
        width: "20%",
        height: "55%"
    }
]

function Rooms(props: { fixtureNames: FixtureName[], fixturesData: FixturesData }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [clickedRoom, setClickedRoom] = useState<string>("");
    const [fixturesInRooom, setFixturesInRoom] = useState<FixtureName[]>([]);


    const clickOnRoom = (roomName: string) => {
        setClickedRoom(roomName);
        const fixtures = props.fixtureNames.filter(fixture => fixture.rooms?.find((room => room === roomName)) != undefined);
        setFixturesInRoom(fixtures);
        onOpen();
    }

    return (
        <>
            {rooms.map((room) => <Button
                key={room.name}
                style={{
                    zIndex: 1,
                    position: "absolute",
                    borderRadius: 0,
                    top: room.top,
                    left: room.left,
                    width: room.width,
                    height: room.height,

                }}
                opacity={0}
                _hover={{ opacity: 0.4 }}
                onClick={() => clickOnRoom(room.name)}
            >
            </Button>)

            }

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{rooms.find(room => room.name === clickedRoom)?.display}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            {fixturesInRooom.map(fixture =>
                                props.fixturesData.fixtures[fixture.original] ?
                                    <div
                                        key={fixture.original}
                                    >
                                        <FixtureBox
                                            fixtureName={fixture}
                                            data={props.fixturesData.fixtures[fixture.original]} />
                                    </div>

                                    : null)}
                            {clickedRoom === "annex" && <RadiantHeaters />}
                        </VStack>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );

}

export default Rooms;