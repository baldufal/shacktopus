import { Button, IconButton } from "@chakra-ui/react";
import { MdLight } from "react-icons/md";
import { useState } from "react";
import FixtureBox from "../../KaleidoscopePage/FixtureBox";
import { KNOWN_FIXTURES } from "../../KaleidoscopePage/KNOWN_FIXTURES";
import { FixturesData } from "../../KaleidoscopePage/kaleidoscopeTypes";
import { FixtureName } from "../../DashboardPage/obtainTiles";
import { Tooltip } from "../../ui/tooltip";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle } from "../../ui/dialog";

function Symbols(props: { fixtureNames: FixtureName[], fixturesData: FixturesData }) {

    const [open, setOpen] = useState(false);

    const [clickedFixture, setClickedFixture] = useState<string>("");

    const clickOnFixture = (fixtureName: string) => {
        setClickedFixture(fixtureName);
        setOpen(true);
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
                            <Tooltip content={name.display}>
                                <IconButton
                                    zIndex={1}
                                    aria-label={name.original}
                                    onClick={() => clickOnFixture(name.original)}
                                >
                                    <MdLight />
                                </IconButton>

                            </Tooltip>
                        </div>)

                    : null)
            }

            <DialogRoot
             lazyMount 
             open={open}
              onOpenChange={(e) => setOpen(e.open)}
              >
                <DialogContent>
                    <DialogBody>
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
                    </DialogBody>

                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>

        </>
    );

}

export default Symbols;