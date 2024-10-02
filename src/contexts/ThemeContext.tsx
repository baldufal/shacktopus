import React, { createContext, useContext, ReactNode } from 'react';
import { useColorMode, useTheme } from '@chakra-ui/react';

export interface IndicatorColors {
    ok: string;
    read_only: string;
    dirty: string;
    error: string;
}

interface ThemeColors {
    // Brand color
    brand: string;
    // Standard "background color"
    primary: string;
    // Standard "highlight background color"
    secondary: string;
    // Black or white with good contrast on primary
    bwForeground: string;
    // Opposite of bwForeground
    bwBackground: string;
    // Colors for indicating connection status
    indicator: IndicatorColors
}

const ThemeContext = createContext<ThemeColors | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { colorMode } = useColorMode();
    const theme = useTheme();

    const primary = colorMode === 'dark' ? theme.colors.primary[200] : theme.colors.primary[500];
    const secondary = colorMode === 'dark' ? theme.colors.secondary[400] : theme.colors.secondary[700];
    const bwForeground = colorMode === 'dark' ? "black" : "white";
    const bwBackground = colorMode === 'dark' ? "white" : "black";

    return (
        <ThemeContext.Provider value={{
            brand: theme.colors.primary[700],
            primary,
            secondary,
            bwForeground,
            bwBackground,
            indicator: {
                ok: "",
                read_only: "lightblue",
                dirty: "orange",
                error: "red"
            }
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeColors = (): ThemeColors => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeColors must be used within a ThemeProvider');
    }
    return context;
};
