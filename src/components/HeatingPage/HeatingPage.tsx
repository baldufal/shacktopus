import { Box, Wrap, Image } from "@chakra-ui/react";
import ThermocontrolDetails from "./Thermocontrol/ThermocontrolDetails";
import AuxBox from "./Thermocontrol_aux/AuxBox";
import RadiantHeaters from "./Thermocontrol/RadiantHeaters";
import heatingShacktopus from "./../../assets/heating.png"

function HeatingPage() {

    return (
        <div
            style={{
                position: "relative"
            }}
        >
            <Box
                as="main"
                flex="1"
                p={4}
                paddingTop={0}
                width="100%">

                <Wrap>
                    <div>
                        <ThermocontrolDetails />
                        <div />
                    </div>

                    <div>
                        <AuxBox type={"climate_details"} />
                        <div />
                    </div>
                    <div>
                        <AuxBox type={"energy"} />
                        <div />
                    </div>
                    <div>
                        <AuxBox type={"details"} />
                        <div />
                    </div>
                    <div>
                        <RadiantHeaters />
                        <div />
                    </div>
                </Wrap>
            </Box>

                < Image
                position={"fixed"}
                top={"50vh"}
                filter={"blur(4px)"}
                left={"50vw"}
                maxHeight={"100vh"}
                transform={"translate(-50%, -50%)"}
                zIndex={-10}
                opacity={0.8}
                //filter={darkMode ? "invert(100%)" : ""}
                src={heatingShacktopus}
            />

            
        </div>

    )
}

export default HeatingPage;