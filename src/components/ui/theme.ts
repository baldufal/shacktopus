import { createSystem, defineConfig, defaultConfig, mergeConfigs } from "@chakra-ui/react";


const customConfig = defineConfig({
  globalCss: {
    html: {
      colorPalette: "brand", // Change this to any color palette you prefer
    },
  },
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#fae2e7' },
          100: { value: '#f3b7c4' },
          200: { value: '#ea8a9d' },
          300: { value: '#e05d78' },
          400: { value: '#d73f5d' },
          500: { value: '#cf2645' },
          600: { value: '#bf2244' },
          700: { value: '#ab1d41' }, // primary color "French Wine"
          800: { value: '#97183e' },
          900: { value: '#741037' },
        },
        secondary: {
          50: { value: '#dff3ee' },
          100: { value: '#b2e1d3' },
          200: { value: '#7fceb7' },
          300: { value: '#4bba9c' },
          400: { value: '#1dab88' }, // secondary color
          500: { value: '#009c75' },
          600: { value: '#008e69' },
          700: { value: '#007e5a' },
          800: { value: '#006e4c' },
          900: { value: '#005232' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          'solid': { value: { _light: '{colors.primary.700}', _dark: '{colors.primary.700}' } },
          'contrast': { value: { _light: 'white', _dark: 'white' } },
          'fg': { value: '{colors.primary.700}' },
          'muted': { value: '{colors.primary.100}' },
          'subtle': { value: '{colors.primary.200}' },
          'emphasized': { value: '{colors.primary.300}' },
          'focusRing': { value: '{colors.primary.500}' },
          'secondary.solid': { value: '{colors.secondary.500}' },
          'secondary.contrast': { value: '{colors.secondary.100}' },
          'secondary.fg': { value: '{colors.secondary.700}' },
          'secondary.muted': { value: '{colors.secondary.100}' },
          'secondary.subtle': { value: '{colors.secondary.200}' },
          'secondary.emphasized': { value: '{colors.secondary.300}' },
          'secondary.focusRing': { value: '{colors.secondary.500}' },
        },
        secondary: {
          'solid': { value: '{colors.secondary.500}' },
          'contrast': { value: '{colors.secondary.100}' },
          'fg': { value: '{colors.secondary.700}' },
          'muted': { value: '{colors.secondary.100}' },
          'subtle': { value: '{colors.secondary.200}' },
          'emphasized': { value: '{colors.secondary.300}' },
          'focusRing': { value: '{colors.secondary.500}' },
        },
        indicator: {
          "ok": { value: "" },
          "read_only": { value: "lightblue" },
          "dirty": { value: "orange" },
          "error": { value: "red" }
        },
      }
    },
  },
});


const config = mergeConfigs(defaultConfig, customConfig);
export const system = createSystem(config);
