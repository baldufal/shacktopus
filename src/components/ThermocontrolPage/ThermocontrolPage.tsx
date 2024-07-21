import { Box } from "@chakra-ui/react";
import ThermocontrolDetails from "./ThermocontrolDetails";

function ThermocontrolPage() {


    return (
        <Box as="main" flex="1" p={4} width="100%">
            <ThermocontrolDetails/>
        </Box>
    )
}

export default ThermocontrolPage;