import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './../Router/AuthContext';
import axios from 'axios';
import { Button, Input, Text, VStack } from '@chakra-ui/react';

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
            auth.login(response.data.token, response.data.username, response.data.privileged);
            const from = (location.state as { from?: Location })?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (

        <VStack align={"start"}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Text>User</Text>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Text>Password</Text>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleSubmit}>Login</Button>

        </VStack>
    );
};

export default LoginPage;
