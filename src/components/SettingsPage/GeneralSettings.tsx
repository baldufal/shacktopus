import { Box, Button, HStack, Input, Text, useNumberInput, VStack } from "@chakra-ui/react";
import useLocalStorage from "use-local-storage";
import "./settingsPage.scss";


function GeneralSettings() {

    const [apiUrl, setApiUrl] = useLocalStorage('api-url', "http://192.168.88.30:4048");



    return (
        <Box className="settings-box">
            <VStack className="settings-box-stack" align={"start"} spacing={1}>
            <Text className="settings-box-heading shacktopus-heading">General</Text>
                <Text>Server URL</Text>
                <Input
                    value={apiUrl}
                    onChange={(event) => setApiUrl(event.target.value)} />
                <HStack>
                    <Button onClick={() => setApiUrl("https://192.168.88.30:8443")}>Local Network</Button>
                    <Button onClick={() => setApiUrl("https://10.0.2.2:8443")}>VPN</Button>
                    <Button onClick={() => setApiUrl("https://10.0.2.6:8443")}>Debug VPN</Button>
                    <Button onClick={() => setApiUrl("https://192.168.0.249:8443")}>Debug</Button>
                </HStack>
            </VStack>
        </Box>
    );
}

export default GeneralSettings;
