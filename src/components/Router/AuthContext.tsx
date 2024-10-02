import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export enum Permission {
    LIGHT = 'LIGHT',
    HEATING = 'HEATING',
}

type UserConfig = {
    dashboard: string[];
}

export type UserResponse = {
    token: string;
    username: string;
    tokenExpiration: number;
    permissions: Permission[];
    userConfig: UserConfig;
}

interface AuthContextType {
    userData: UserResponse | undefined;
    login: (username: string, password: string) => Promise<{ error: string | undefined }>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    updateUserConfig: (config: UserConfig) => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && userData) {
            const timeLeft = userData.tokenExpiration * 1000 - Date.now();
            if (timeLeft <= 0) {
                console.log("Logging out because token expired.");
                logout();
            }
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedPermissions = localStorage.getItem('permissions');
        const storedTokenExpiration = localStorage.getItem('tokenExpiration');
        const storedUserConfig = localStorage.getItem('userConfig');

        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (storedToken && storedUser && storedTokenExpiration && storedPermissions && storedUserConfig)
            setUserData({
                token: storedToken,
                permissions: JSON.parse(storedPermissions) as Permission[],
                username: storedUser,
                userConfig: JSON.parse(storedUserConfig) as UserConfig,
                tokenExpiration: parseInt(storedTokenExpiration, 10)
            })

        setIsLoading(false);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            const currentTime = Date.now();
            const timeLeft = userData.tokenExpiration * 1000 - currentTime;
            const bufferTime = 60000; // 1 Minute Pufferzeit (in Millisekunden)

            if (timeLeft > bufferTime) {
                const timer = setTimeout(() => {
                    refreshToken();
                }, timeLeft - bufferTime);

                return () => clearTimeout(timer); // Bereinige den Timer bei Änderungen
            } else {
                refreshToken();
            }
        }
    }, [userData?.tokenExpiration]);

    const setLocalStorage = (newData: UserResponse) => {
        localStorage.setItem('token', newData.token);
        localStorage.setItem('user', newData.username);
        localStorage.setItem('permissions', JSON.stringify(newData.permissions));
        localStorage.setItem('tokenExpiration', newData.tokenExpiration.toString());
        localStorage.setItem('userConfig', JSON.stringify(newData.userConfig));
    }

    const refreshToken = async () => {
        try {
            const response = await fetch(`http://${window.location.host}/api/refresh-token?token=${userData!.token}`, {
                method: 'POST',
            });

            if (userData && response.ok) {
                const data = await response.json() as UserResponse;
                setUserData(data);
                setLocalStorage(data);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Token refresh failed', error);
            logout();
        }
    };

    const login = async (username: string, password: string): Promise<{ error: string | undefined }> => {
        try {
            const response = await axios.post(`http://${window.location.host}/api/login`, {
                username,
                password
            });

            const responseData = response.data as UserResponse;

            setUserData({
                token: responseData.token,
                username: responseData.username,
                permissions: responseData.permissions,
                tokenExpiration: responseData.tokenExpiration,
                userConfig: responseData.userConfig
            })

            setLocalStorage(responseData);

            return { error: undefined }; // Success
        } catch (error) {
            console.error('Error during login:', error);
            return { error: 'Error during login: ' + error }; // Error handling
        }
    };


    const logout = async () => {
        setUserData(undefined);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userConfig');
    };

    const updateUserConfig = async (config: UserConfig): Promise<string | undefined> => {
        try {
            await axios.post(`http://${window.location.host}/api/userconfig?token=${userData!.token}`, config);
            await refreshToken();
            return undefined;
        } catch (error) {
            await refreshToken();
            console.error('Error updating user config:', error);
            return 'Error updating user config: ' + error
        };
    }


    const timeUntilExpiration = userData ? userData.tokenExpiration * 1000 - Date.now() : -1;
    const isAuthenticated = !!userData && timeUntilExpiration > 0;

    return (
        <AuthContext.Provider value={{ userData, login, logout, isAuthenticated, isLoading, updateUserConfig}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
