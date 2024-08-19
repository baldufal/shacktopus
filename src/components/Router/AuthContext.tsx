import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
    user: string | null;
    privileged: boolean;
    login: (user: string, privileged: boolean, tokenExpiration: number) => void;
    logout: () => void;
    isAuthenticated: boolean;
    tokenExpiration: number | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [privileged, setPrivileged] = useState<boolean>(false);
    const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedPrivileged = localStorage.getItem('privileged');
        const storedTokenExpiration = localStorage.getItem('tokenExpiration');

        if (storedUser && storedTokenExpiration) {
            setUser(storedUser);
            setPrivileged(storedPrivileged === "true");
            setTokenExpiration(parseInt(storedTokenExpiration, 10));
        }
        
        setIsLoading(false);
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
                }, timeLeft- bufferTime);

                return () => clearTimeout(timer); // Bereinige den Timer bei Änderungen
            } else {
                // Falls das Token bereits abgelaufen ist, sofort ausloggen
                handleTokenExpiration();
            }
        }
    }, [tokenExpiration]);

    const handleTokenExpiration = async () => {
        try {
            const response = await fetch(`https://${window.location.host}/api/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Aktualisiere das Token und die Ablaufzeit
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

    const login = (user: string, privileged: boolean, tokenExpiration: number) => {
        setUser(user);
        setPrivileged(privileged);
        setTokenExpiration(tokenExpiration);

        localStorage.setItem('user', user);
        localStorage.setItem('privileged', privileged.toString());
        localStorage.setItem('tokenExpiration', tokenExpiration.toString());
    };

    const logout = async () => {
        try {
            const response = await fetch(`https://${window.location.host}/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                clearAuthState();
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    const clearAuthState = () => {
        setUser(null);
        setPrivileged(false);
        setTokenExpiration(null);

        localStorage.removeItem('user');
        localStorage.removeItem('privileged');
        localStorage.removeItem('tokenExpiration');
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, privileged, login, logout, isAuthenticated, tokenExpiration, isLoading }}>
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
