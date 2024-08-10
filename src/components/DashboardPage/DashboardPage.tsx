import { Box, Wrap, Text } from "@chakra-ui/react";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import { useKaleidoscopeUpdates } from "../KaleidoscopePage/KaleidoscopeUpdatesContext";
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails";


function DashboardPage() {
    const { fixturesData, fixtureNames, error } = useKaleidoscopeUpdates();

      return (
        <Box as="main" flex="1" p={4} width="100%">
            <Wrap>
                {error ? <Text>{error}</Text> :
                    fixtureNames && fixturesData ?
                        fixtureNames.map((fixtureName, index) =>
                            <FixtureBox key={index} fixtureName={fixtureName} data={fixturesData.fixtures[fixtureName.original]} />)
                        : <Text>Loading...</Text>}
                        <ThermocontrolDetails></ThermocontrolDetails>
            </Wrap>
            
            
        </Box>
      );
}

export default DashboardPage;