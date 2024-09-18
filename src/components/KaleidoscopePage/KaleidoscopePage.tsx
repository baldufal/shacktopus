import { Box, Text, Wrap } from "@chakra-ui/react";
import FixtureBox from "./FixtureBox";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "../fixturebox.scss"

function KaleidoscopePage() {

    const { fixturesData, fixtureNames, error } = useKaleidoscope();

    return (
        <Box
            as="main"
            flex="1"
            p={4}
            paddingTop={0}
            width="100%">
            <Wrap>
                {error ?
                    <Text>{error}</Text> :
                    fixtureNames && fixturesData ?
                        fixtureNames.map((fixtureName, index) =>
                            <div key={index}>
                                <FixtureBox
                                    key={index}
                                    fixtureName={fixtureName}
                                    data={fixturesData.fixtures[fixtureName.original]} />
                                <div />
                            </div>
                        )
                        : <Text>Loading...</Text>}
            </Wrap>
        </Box>
    )
}

export default KaleidoscopePage;