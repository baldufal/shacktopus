import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './../Router/AuthContext';
import { Box, Button, Image, Input, Text, VStack } from '@chakra-ui/react';
import shacktopus from './../../assets/shacktopus.webp';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleGuestLogin = async () => {
            const loginResult = await auth.login("guest", "");
        if (loginResult.error) {
            console.log(loginResult.error);
            setError('Guest login failed. There seems to be a technical issue. Please try again later.');
        } else {
            const from = (location.state as { from?: Location })?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    };

    const handleSubmit = async () => {
        const loginResult = 
            await auth.login(username, password);
        if (loginResult.error) {
            console.log(loginResult.error);
            setError('Login failed. Please check your credentials and try again.');
        } else {
            const from = (location.state as { from?: Location })?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter')
            handleSubmit();
    };

    return (
        <VStack >
            <Image
                src={shacktopus}
                boxSize={"min(50vh, 100vw)"}
                marginTop={"0pxh"}
                alt='Shacktopus Logo' />

            <VStack
                marginTop={"0px"}>
                <Button
                onClick={handleGuestLogin}
                >Login as Guest</Button>
                <Text
                    marginTop={"2vh"}
                >
                    or</Text>
                <Box
                    width={"min(80vw, 250px)"}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Text>User</Text>
                    <Input
                        type="text"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown} />
                    <Text>Password</Text>
                    <Input
                        type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown} />
                </Box>
                <Button onClick={handleSubmit}>Login</Button>
            </VStack>

        </VStack>
    );
};

export default LoginPage;
