import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './../Router/AuthContext';
import axios from 'axios';
import { Box, Button, Image, Input, Text, VStack } from '@chakra-ui/react';
import shacktopus from './../../assets/shacktopus.png';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('guest');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`https://${window.location.host}/api/login`, {
                username,
                password
            });
            auth.login(response.data.username, response.data.privileged, response.data.tokenExpiration);
            const from = (location.state as { from?: Location })?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (

        <VStack >
            <Image
                src={shacktopus}
                boxSize={"max(30vw, 200px)"}
                marginTop={"5vh"}
                alt='Shacktopus Logo' />
            <Box minWidth={"200px"} width={"20vw"}>
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
    );
};

export default LoginPage;
