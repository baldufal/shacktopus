import { VStack, Text, Box, Input, Button, Link } from "@chakra-ui/react";
import "./settingsPage.scss";
import { useState } from "react";
import useLocalStorage from "use-local-storage";

function LoginSettings() {

    const [password, setPassword] = useState("");
    const [user, setUser] = useState("guest");
    const [status, setStatus] = useState<undefined | string>(undefined);
    const [token, setToken] = useLocalStorage('jwt', "");
    const [apiUrl] = useLocalStorage('api-url', "http://192.168.88.30:4048");

    async function login(username: string, password: string): Promise<string> {
        setStatus("logging in")
        try {
            const response = await fetch(apiUrl + "/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setStatus("logged in")
                return data.token;
            } else {
                const errorText = await response.text();
                setStatus(`error during login: ${errorText}`);
                throw new Error(`Login failed: ${errorText}`);
            }
        } catch (error) {
            setStatus(`error during login`);
            throw error;
        }
    }


    async function onClickLogin() {
        try {
            const newToken = await login(user, password);
            setToken(newToken);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Box className="settings-box">
            <VStack className="settings-box-stack" align={"start"}>
                <Text className="settings-box-heading shacktopus-heading">Login</Text>
                <Text>User</Text>
                <Input
                    value={user}
                    onChange={(event) => setUser(event.target.value)} />
                <Text>Password</Text>
                <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)} />
                <Button onClick={onClickLogin}>Login</Button>
                <Link href={apiUrl + "/login"}>Click here and trust certificate to resolve login issues</Link>
                {status ? <Text>{status}</Text> : null}
                {token ? <Text>{"Token: " + token}</Text> : null}
            </VStack>
        </Box>
    );
}

export default LoginSettings;
