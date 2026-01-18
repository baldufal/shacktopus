import { extendTheme, ThemeConfig, withDefaultColorScheme} from '@chakra-ui/react';

// Theme configuration for color modes
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false,
};

// Custom color palette
const colors = {
  primary: {
    50: '#fae2e7',
    100: '#f3b7c4',
    200: '#ea8a9d',
    300: '#e05d78',
    400: '#d73f5d',
    500: '#cf2645',
    600: '#bf2244',
    700: '#ab1d41', // primary color "french wine"
    800: '#97183e',
    900: '#741037',
  },
  secondary: {
    50: '#dff3ee',
    100: '#b2e1d3',
    200: '#7fceb7',
    300: '#4bba9c',
    400: '#1dab88', // secondary (complementary) color
    500: '#009c75',
    600: '#008e69',
    700: '#007e5a',
    800: '#006e4c',
    900: '#005232',
  },

  grey: {
    50: '#f7f7f7',
    100: '#e1e1e1',
    200: '#cfcfcf',
    300: '#b1b1b1',
    400: '#9e9e9e',
    500: '#7e7e7e',
    600: '#626262',
    700: '#515151',
    800: '#3b3b3b',
    900: '#222222',
  },
};

/*
const styles = {
  global: (props: { colorMode: string; }) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'white' : 'gray.50',
      color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
    },
  }),
};
*/
// Extend the base theme
const theme = extendTheme(
  { config },
  {
    colors,
    //styles
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
);

export default theme;
