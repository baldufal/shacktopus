import { FixtureName } from "../DashboardPage/obtainTiles";
import fairy_lights_off from './../../assets/fairy_lights/off.png';
import fairy_lights_on from './../../assets/fairy_lights/on.png';

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
        background_active: "url('" + fairy_lights_on + "')",
        background_inactive: "url('" + fairy_lights_off + "')"
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
