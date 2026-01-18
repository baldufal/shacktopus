import { Box, Text, Wrap } from "@chakra-ui/react";
import FixtureBox from "./FixtureBox";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import "../fixturebox.scss"
import { KNOWN_FIXTURES } from "./KNOWN_FIXTURES";


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
                        fixtureNames.sort((a, b) => {
                            // Put unknown fixtures at the end, then sort alphabetically
                            const aKnown = a.original in KNOWN_FIXTURES;
                            const bKnown = b.original in KNOWN_FIXTURES;
                            if (aKnown !== bKnown)
                                return bKnown ? 1 : -1;
                            return a.display.localeCompare(b.display);
                        }).map((fixtureName, index) =>
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