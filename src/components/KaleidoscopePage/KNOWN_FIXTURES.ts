import { FixtureName } from "../DashboardPage/obtainTiles";
import fairy_lights_off from './../../assets/fairy_lights/off.png';
import fairy_lights_on from './../../assets/fairy_lights/on.png';

export const KNOWN_FIXTURES: { [key: string]: FixtureName } = {
    'kitchen_rgbw': {
        original: 'kitchen_rgbw',
        display: 'Kitchen Light',
        floorplan_position: {
            top: "17%",
            left: "38%"
        }
    },
    'kitchen_spots': {
        original: 'kitchen_spots',
        display: 'Kitchen Spots',
        floorplan_position: {
            top: "17%",
            left: "51%"
        }
    },
    'klo_rgbw': {
        original: 'klo_rgbw',
        display: 'Toilet Light',
        floorplan_position: {
            top: "14%",
            left: "62%"
        }
    },
    'lichterketten': {
        original: 'lichterketten',
        display: 'Fairy Lights',
        background_active: "url('" + fairy_lights_on + "')",
        background_inactive: "url('" + fairy_lights_off + "')",
        floorplan_position: {
            top: "50%",
            left: "55%"
        }
    },
    'putzlicht': {
        original: 'putzlicht',
        display: 'Outside Work Lights',
        floorplan_position: {
            top: "75%",
            left: "75%"
        }
    },
    'red_green_party_light': {
        original: 'red_green_party_light',
        display: 'Party Spots red+green',
        floorplan_position: {
            top: "30%",
            left: "35%"
        }
    },
    'spoider': {
        original: 'spoider',
        display: 'Spoider',
        floorplan_position: {
            top: "49%",
            left: "22%"
        }
    },
    'umluft': {
        original: 'umluft',
        display: 'Air Circulation'
    },
    'bedroom_light': {
        original: 'bedroom_light',
        display: 'Bedroom Light',
        floorplan_position: {
            top: "21%",
            left: "15%"
        }
    },
    'blacklight': {
        original: 'blacklight',
        display: 'Black Light',
        floorplan_position: {
            top: "40%",
            left: "40%"
        }
    },
    'front_door': {
        original: 'front_door',
        display: 'Front Door Light',
        floorplan_position: {
            top: "34%",
            left: "74%"
        }
    }
};
