import { Box, Wrap, Text, VStack, Divider, Button } from "@chakra-ui/react";
import FixtureBox from "../KaleidoscopePage/FixtureBox";
import { useKaleidoscope } from "../KaleidoscopePage/KaleidoscopeContext";
import ThermocontrolDetails from "../HeatingPage/Thermocontrol/ThermocontrolDetails";


function DashboardPage() {
    const { fixturesData, fixtureNames, error } = useKaleidoscope();

      return (
        <Box as="main" flex="1" p={4} width="100%">
            <VStack>
            <Wrap>
                {error ? <Text>{error}</Text> :
                    fixtureNames && fixturesData ?
                        fixtureNames.map((fixtureName, index) =>
                            <FixtureBox key={index} fixtureName={fixtureName} data={fixturesData.fixtures[fixtureName.original]} />)
                        : <Text>Loading...</Text>}
            </Wrap>
            <Divider></Divider>
            <ThermocontrolDetails></ThermocontrolDetails>
            </VStack>
            
        </Box>
      );
}

export default DashboardPage;