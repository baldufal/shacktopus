import { Box, Wrap } from "@chakra-ui/react";
import ThermocontrolDetails from "./Thermocontrol/ThermocontrolDetails";
import AuxBox from "./Thermocontrol_aux/AuxBox";
import RadiantHeaters from "./Thermocontrol/RadiantHeaters";

function HeatingPage() {

    return (
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
    )
}

export default HeatingPage;