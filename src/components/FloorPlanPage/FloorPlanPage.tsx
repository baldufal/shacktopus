import { Box, Image, useColorMode } from "@chakra-ui/react";
import floorplan from "./../../assets/floorplan.png"
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import { useEffect, useState } from "react";
import { KNOWN_FIXTURES } from "../KaleidoscopePage/KNOWN_FIXTURES";
import Rooms from "./components/Rooms";
import { FixtureName } from "../DashboardPage/obtainTiles";
import Symbols from "./components/Symbols";

function FloorPlanPage() {

    const { fixturesData, fixtureNames } = useKaleidoscope();

    const [knownFixtureNames, setKnownFixtureNames] = useState<FixtureName[]>(
        fixtureNames ?
            fixtureNames!.map(name => KNOWN_FIXTURES[name.original] || undefined).filter(element => element != undefined)
            : []
    );

    useEffect(() => {
        console.log("fixture names: " + fixtureNames?.map(fn => fn.original))

        const updatedNames = fixtureNames ?
            fixtureNames!.map(name => KNOWN_FIXTURES[name.original] || undefined).filter(element => element != undefined)
            : [];

        setKnownFixtureNames(updatedNames);
        console.log("known fixture names: " + updatedNames.map(fn => fn.original))
        console.log("Defined: " + (fixtureNames && fixturesData) ? "yes" : "no")

    }, [fixtureNames]);

    const { colorMode } = useColorMode()
    const darkMode = colorMode === "dark";

    const [largeScreen, setLargeScreen] = useState<boolean>(
        window.matchMedia("(min-width: 768px)").matches)
    const [hugeScreen, setHugeScreen] = useState<boolean>(
        window.matchMedia("(min-width: 1024px)").matches)

    useEffect(() => {
        const mediaQuery768 = window.matchMedia("(min-width: 768px)");
        const mediaQuery1024 = window.matchMedia("(min-width: 1024px)");

        const handle768Change = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setLargeScreen(e.matches);
        const handle1024Change = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setHugeScreen(e.matches);

        mediaQuery768.addEventListener('change', handle768Change);
        mediaQuery1024.addEventListener('change', handle1024Change);

        // Cleanup function
        return () => {
            mediaQuery768.removeEventListener('change', handle768Change);
            mediaQuery1024.removeEventListener('change', handle1024Change);
        };
    }, []);

    return (

        <Box
            as="main"
            flex="1"
            //p={4}
            marginTop={largeScreen ? "-2rem" : ""}
            width="100%"
        >

            <div
                style={{
                    position: "relative",
                    display: "inline-block",
                    width: "auto",
                    maxWidth: "min(1200px, 100%)",
                }}
            >
                {fixtureNames && fixturesData ?
                    <Rooms
                        fixtureNames={knownFixtureNames}
                        fixturesData={fixturesData} />
                    : null}
                {fixtureNames && fixturesData && hugeScreen ?
                    <Symbols
                        fixtureNames={knownFixtureNames}
                        fixturesData={fixturesData} />
                    : null}
                < Image
                    zIndex={-1}
                    opacity={0.8}
                    filter={darkMode ? "invert(100%)" : ""}
                    src={floorplan}
                />
            </div>

        </Box>

    );

}

export default FloorPlanPage;