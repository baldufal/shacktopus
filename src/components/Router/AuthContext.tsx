// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
    token: string | null;
    user: string | null;
    privileged: boolean;
    login: (token: string, user: string, privileged: boolean) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [privileged, setPrivileged] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            setToken(storedToken);
            console.log("found stored token")
        }
        const storedUser = localStorage.getItem('user');
        if (storedUser) 
            setUser(storedUser);
        const storedPrivileged = localStorage.getItem('privileged');
        if (storedPrivileged) 
            setPrivileged(storedPrivileged === "true");

        setIsLoading(false);
    }, []);

    const login = (token: string, user: string, privileged: boolean) => {
        setToken(token);
        setUser(user);
        setPrivileged(privileged);
        localStorage.setItem('jwt', token);
        localStorage.setItem('user', user);
        localStorage.setItem('privileged', privileged.toString());
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setPrivileged(false);
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('privileged');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, user, privileged, login, logout, isAuthenticated, isLoading}}>
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
