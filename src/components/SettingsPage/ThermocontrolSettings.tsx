import { VStack, Text, Box, Input, HStack, Button, Divider, InputGroup, InputRightElement } from "@chakra-ui/react";
import useLocalStorage from "use-local-storage";
import "./settingsPage.scss";
import { useState } from "react";

function ThermocontrolSettings() {
    const [thermocontrolAPI, setThermocontrolAPI] = useLocalStorage('thermocontrol-api', "http://192.168.88.30:9079");
    const [thermocontrolKey, setThermocontrolKey] = useLocalStorage('thermocontrol-key', "");

    function PasswordInput() {
        const [show, setShow] = useState(false)
        const handleClick = () => setShow(!show)
      
        return (
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder='Enter password'
              onChange={(event) => setThermocontrolKey(event.target.value)}
              value={thermocontrolKey}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        )
      }

    return (
        <Box className="settings-box">
            <VStack className="settings-box-stack" align={"start"}>
                <Text className="settings-box-heading shacktopus-heading">ThermoControl</Text>
                <Text>API URL</Text>
                <Input
                    value={thermocontrolAPI}
                    onChange={(event) => setThermocontrolAPI(event.target.value)} />
                <HStack>
                    <Button onClick={() => setThermocontrolAPI("http://192.168.88.30:9079")}>Local Network</Button>
                    <Button onClick={() => setThermocontrolAPI("http://10.0.2.2:9079")}>VPN</Button>
                </HStack>
                <Divider></Divider>
                <Text>API Key</Text>
                <PasswordInput></PasswordInput>
            </VStack>
        </Box>
    );
}

export default ThermocontrolSettings;
