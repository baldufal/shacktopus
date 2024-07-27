import { VStack, Text, Box, Input, Divider, Button } from "@chakra-ui/react";
import "./settingsPage.scss";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "use-local-storage";

function TestSettings() {

    const updateSocketRef = useRef<WebSocket | null>(null);
    const setSocketRef = useRef<WebSocket | null>(null);

    const [password, setPassword] = useState("");
    const [user, setUser] = useState("guest");
    const [error, setError] = useState("");
    const [token, setToken] = useLocalStorage('jwt', "");

    async function login(username: string, password: string): Promise<string> {
        try {
            setError("logging in");
    
            const response = await fetch('https://192.168.0.249:8443/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setError("no error during login");
                return data.token;
            } else {
                const errorText = await response.text();
                setError(`error during login: ${errorText}`);
                throw new Error(`Login failed: ${errorText}`);
            }
        } catch (error) {
            setError(`Network error: ${error.message}`);
            throw error;
        }
    }

    async function connectUpdateWebSocket(token: string) {
        const socket = new WebSocket(`wss://192.168.0.249:8443/thermocontrol/updates?token=${token}`);
        updateSocketRef.current = socket;  // Save the WebSocket instance to the ref

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            //socket.send('Hello server');
        };

        socket.onmessage = (message: MessageEvent) => {
            console.log('Received message:', message.data);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    async function connectSetWebSocket(token: string) {
        const socket = new WebSocket(`wss://192.168.0.249:8443/thermocontrol/set?token=${token}`);
        setSocketRef.current = socket;  // Save the WebSocket instance to the ref

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            socket.send(JSON.stringify({target_humidity: 77}));
            socket.close();
        };

        socket.onmessage = (message: MessageEvent) => {
            console.log('Received message:', message.data);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    useEffect(() => {
        // Cleanup function to close the WebSocket when the component unmounts
        return () => {
            if (updateSocketRef.current) {
                updateSocketRef.current.close();
            }
        };
    }, []);

    async function onClickLogin() {
        try {
            const newToken = await login(user, password);
            setToken(newToken);
            connectUpdateWebSocket(newToken);
        } catch (error) {
            console.error(error);
        }
    };

    async function onCLickSetHumidity() {
        try {
            const newToken = await login(user, password);
            setToken(newToken);
            connectSetWebSocket(newToken);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Box className="settings-box">
            <VStack className="settings-box-stack" align={"start"}>
                <Text className="settings-box-heading shacktopus-heading">Test</Text>
                <Text>User</Text>
                <Input
                    value={user}
                    onChange={(event) => setUser(event.target.value)} />
                <Divider></Divider>
                <Text>Password</Text>
                <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)} />
                <Divider></Divider>
                <Button onClick={onClickLogin}>Login</Button>
                <Text>{"Token: " + token}</Text>
                <Text>{error}</Text>
                <Button onClick={onCLickSetHumidity}>Set Humidity</Button>
            </VStack>
        </Box>
    );
}

export default TestSettings;
