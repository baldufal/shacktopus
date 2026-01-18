import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Tooltip, useDisclosure } from "@chakra-ui/react";
import { MdLight } from "react-icons/md";
import { useState } from "react";
import FixtureBox from "../../KaleidoscopePage/FixtureBox";
import { KNOWN_FIXTURES } from "../../KaleidoscopePage/KNOWN_FIXTURES";
import { FixturesData } from "../../KaleidoscopePage/kaleidoscopeTypes";
import { FixtureName } from "../../DashboardPage/obtainTiles";

function Symbols(props: { fixtureNames: FixtureName[], fixturesData: FixturesData }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [clickedFixture, setClickedFixture] = useState<string>("");

    const clickOnFixture = (fixtureName: string) => {
        setClickedFixture(fixtureName);
        onOpen();
    }

    return (
        <>
            {props.fixtureNames.map((name) =>
                (name.floorplan_position) ?
                    name.floorplan_position!.map((position, index) => 
                    <div
                        key={name.original + index}
                        style={{
                            zIndex: 1,
                            position: "absolute",
                            top: position.top,
                            left: position.left,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <Tooltip label={name.display}>
                            <IconButton
                            colorScheme={props.fixturesData.fixtures[name.original].selected_program === "OFF" ? "primary" : "secondary"}
                                zIndex={1}
                                aria-label={name.original}
                                onClick={() => clickOnFixture(name.original)}
                                icon={<MdLight />}
                            />
                        </Tooltip>
                    </div>)

                    : null)
            }

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            <div
                                style={{
                                    display: "inline-block",
                                    width: "auto",
                                }}>
                                <FixtureBox
                                    fixtureName={KNOWN_FIXTURES[clickedFixture]}
                                    data={props.fixturesData.fixtures[clickedFixture]}
                                />
                            </div>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );

}

export default Symbols;