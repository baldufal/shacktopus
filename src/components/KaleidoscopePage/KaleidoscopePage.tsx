import { Box, Text, VStack } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { FixturesData } from "./kaleidoscopeTypes";
import FixtureBox from "./FixtureBox";

function KaleidoscopePage() {

    const [fixturesData, setFixturesData] = useState<FixturesData | null>(null);
    const [fixtureNames, setFixtureNames] = useState <string[] | null>(null);
    const [error, setError] = useState<boolean | undefined>(undefined);
    const [permissionError, setPermissionError] = useState<string | undefined>(undefined);

    const updateSocketRef = useRef<WebSocket | undefined>(undefined);
    const setSocketRef = useRef<WebSocket | undefined>(undefined);
    const token = localStorage.getItem('jwt')

    useEffect(() => {
        if (!token) {
            setPermissionError("Not logged in!");
            return;
        }
        const updateSocket = new WebSocket(`wss://${window.location.host}/api/kaleidoscope/updates?token=${token}`);
        updateSocketRef.current = updateSocket;

        updateSocket.onopen = () => {
            console.log('WebSocket for Kaleidoscope updates opened');
            setPermissionError(undefined);
        };

        updateSocket.onmessage = (message: MessageEvent) => {
            const parsedMessage = JSON.parse(message.data)
            if (parsedMessage.health === "good") {
                setFixturesData(parsedMessage.data as FixturesData)
                if(!fixtureNames){
                    const extractedNames = Object.keys(parsedMessage.data.fixtures).sort()
                    setFixtureNames(extractedNames)
                }
            } else {
                console.log("Received kaleidoscope update with health != good")
            }
        }

        updateSocket.onclose = () => {
            console.log('WebSocket for Kaleidoscope updates closed');
            setPermissionError("No permission to read data. Check login.")
            setError(true);
        };


        return () => {
            if (updateSocketRef.current)
                updateSocketRef.current.close();
            if (setSocketRef.current)
                setSocketRef.current.close();
        };
    }, [token, fixtureNames]);

    return (
        <Box as="main" flex="1" p={4} width="100%">
            <VStack>
                {fixtureNames && fixturesData? fixtureNames.map((fixtureName, index) => 
                <FixtureBox key={index} fixtureName={fixtureName} data={fixturesData.fixtures[fixtureName]}/>)
            : <Text>Loading...</Text>}
            </VStack>
        </Box>
    )
}

export default KaleidoscopePage;