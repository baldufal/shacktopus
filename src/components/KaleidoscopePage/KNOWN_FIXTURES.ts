import { FixtureName } from "../DashboardPage/obtainTiles";

export const KNOWN_FIXTURES: { [key: string]: FixtureName } = {
    'kitchen_rgbw': {
        original: 'kitchen_rgbw',
        display: 'Kitchen Light',
    },
    'kitchen_spots': {
        original: 'kitchen_spots',
        display: 'Kitchen Spots',
    },
    'klo_rgbw': {
        original: 'klo_rgbw',
        display: 'Toilet Light'
    },
    'lichterketten': {
        original: 'lichterketten',
        display: 'Fairy Lights',
        background_active: "url('/src/assets/fairy_lights/on.png')",
        background_inactive: "url('/src/assets/fairy_lights/off.png')"
    },
    'putzlicht': {
        original: 'putzlicht',
        display: 'Outside Work Lights'
    },
    'red_green_party_light': {
        original: 'red_green_party_light',
        display: 'Party Spots red+green'
    },
    'spoider': {
        original: 'spoider',
        display: 'Spoider'
    },
    'umluft': {
        original: 'umluft',
        display: 'Air Circulation'
    },
    'bedroom_light': {
        original: 'bedroom_light',
        display: 'Bedroom Light'
    },
    'blacklight': {
        original: 'blacklight',
        display: 'Black Light'
    },
    'front_door': {
        original: 'front_door',
        display: 'Front Door Light'
    }
};
