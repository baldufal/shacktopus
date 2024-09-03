import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
    token: string | null;
    user: string | null;
    privileged: boolean;
    login: (token: string, user: string, privileged: boolean, tokenExpiration: number) => void;
    logout: () => void;
    isAuthenticated: boolean;
    tokenExpiration: number | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [privileged, setPrivileged] = useState<boolean>(false);
    const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && tokenExpiration) {
            const timeLeft = tokenExpiration * 1000 - Date.now();
            if (timeLeft <= 0) {
                console.log("Logging out because token expired.");
                logout();
            }
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedPrivileged = localStorage.getItem('privileged');
        const storedTokenExpiration = localStorage.getItem('tokenExpiration');

        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (storedToken && storedUser && storedTokenExpiration) {
            setToken(storedToken);
            setUser(storedUser);
            setPrivileged(storedPrivileged === "true");
            setTokenExpiration(parseInt(storedTokenExpiration, 10));
        }

        setIsLoading(false);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, []);

    useEffect(() => {
        // Wenn ein Token-Ablaufzeit gesetzt ist, stelle sicher, dass ein Timer gesetzt wird
        if (tokenExpiration) {
            const currentTime = Date.now();
            const timeLeft = tokenExpiration * 1000 - currentTime;
            const bufferTime = 60000; // 1 Minute Pufferzeit (in Millisekunden)

            if (timeLeft > bufferTime) {
                const timer = setTimeout(() => {
                    handleTokenExpiration();
                }, timeLeft - bufferTime);

                return () => clearTimeout(timer); // Bereinige den Timer bei Änderungen
            } else {
                // Falls das Token bereits abgelaufen ist, sofort ausloggen
                handleTokenExpiration();
            }
        }
    }, [tokenExpiration]);

    const handleTokenExpiration = async () => {
        try {
            const response = await fetch(`http://${window.location.host}/api/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Aktualisiere das Token und die Ablaufzeit
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setTokenExpiration(data.tokenExpiration);
                localStorage.setItem('tokenExpiration', data.tokenExpiration.toString());
            } else {
                // Falls die Erneuerung fehlschlägt, ausloggen
                logout();
            }
        } catch (error) {
            console.error('Token refresh failed', error);
            logout();
        }
    };

    const login = (token: string, user: string, privileged: boolean, tokenExpiration: number) => {
        setToken(token);
        setUser(user);
        setPrivileged(privileged);
        setTokenExpiration(tokenExpiration);

        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        localStorage.setItem('privileged', privileged.toString());
        localStorage.setItem('tokenExpiration', tokenExpiration.toString());
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        setPrivileged(false);
        setTokenExpiration(null);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('privileged');
        localStorage.removeItem('tokenExpiration');
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider value={{ token, user, privileged, login, logout, isAuthenticated, tokenExpiration, isLoading }}>
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
