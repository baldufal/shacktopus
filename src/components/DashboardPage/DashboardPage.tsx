import { Box, Wrap, Text } from "@chakra-ui/react";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";


function DashboardPage() {
    const { fixturesData, fixtureNames, error } = useKaleidoscope();

    return (
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
    );
}

export default DashboardPage;