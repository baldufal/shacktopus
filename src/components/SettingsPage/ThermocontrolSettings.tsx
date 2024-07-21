import { VStack, Text, Box, Input, HStack, Button } from "@chakra-ui/react";
import useLocalStorage from "use-local-storage";
import "./settingsPage.scss";

function ThermocontrolSettings() {
    const [thermocontrolAPI, setThermocontrolAPI] = useLocalStorage('thermocontrol-api', "http://192.168.88.30:9079/json");


    return (
        <Box className="settings-box">
            <VStack className="settings-box-stack" align={"start"}>
            <Text className="settings-box-heading shacktopus-heading">ThermoControl</Text>
                <Text>API URL</Text>
                <Input
                    value={thermocontrolAPI}
                    onChange={(event) => setThermocontrolAPI(event.target.value)} />
                <HStack>
                    <Button onClick={() => setThermocontrolAPI("http://192.168.88.30:9079/json")}>Local Network</Button>
                    <Button onClick={() => setThermocontrolAPI("http://10.0.2.2:9079/json")}>VPN</Button>
                </HStack>
            </VStack>
        </Box>
    );
}

export default ThermocontrolSettings;
