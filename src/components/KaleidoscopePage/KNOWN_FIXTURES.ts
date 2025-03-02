import { FixtureName } from "../DashboardPage/obtainTiles";
import fairy_lights_off from './../../assets/fairy_lights/off.png';
import fairy_lights_on from './../../assets/fairy_lights/on.png';
import spoider_off from './../../assets/spoider/off.png';
import spoider_on from './../../assets/spoider/on.png';

export const KNOWN_FIXTURES: { [key: string]: FixtureName } = {
    'kitchen_rgbw': {
        type: "fixture",
        original: 'kitchen_rgbw',
        display: 'Kitchen Light',
        floorplan_position: [{
            top: "17%",
            left: "38%",
        }],
        rooms: ["kitchen"]
    },
    'kitchen_spots': {
        type: "fixture",
        original: 'kitchen_spots',
        display: 'Kitchen Spots',
        floorplan_position: [{
            top: "17%",
            left: "51%"
        }],
        rooms: ["kitchen"]
    },
    'klo_rgbw': {
        type: "fixture",
        original: 'klo_rgbw',
        display: 'Toilet Light',
        floorplan_position: [{
            top: "14%",
            left: "62%"
        }],
        rooms: ["toilet"]
    },
    'lichterketten': {
        type: "fixture",
        original: 'lichterketten',
        display: 'Fairy Lights',
        background_active: "url('" + fairy_lights_on + "')",
        background_inactive: "url('" + fairy_lights_off + "')",
        floorplan_position: [{
            top: "50%",
            left: "55%"
        }],
        rooms: ["main room"]
    },
    'putzlicht': {
        type: "fixture",
        original: 'putzlicht',
        display: 'Outside Work Lights',
        floorplan_position: [{
            top: "40%",
            left: "85%",
        },
        {
            top: "80%",
            left: "45%"
        }],
        rooms: ["annex", "awning"]
    },
    'red_green_party_light': {
        type: "fixture",
        original: 'red_green_party_light',
        display: 'Party Spots red+green',
        floorplan_position: [{
            top: "30%",
            left: "35%"
        }],
        rooms: ["main room"]
    },
    'spoider': {
        type: "fixture",
        original: 'spoider',
        display: 'Spoider',
        background_active: "url('" + spoider_on + "')",
        background_inactive: "url('" + spoider_off + "')",
        floorplan_position: [{
            top: "49%",
            left: "22%"
        }],
        rooms: ["main room"]
    },
    'umluft': {
        type: "circulation",
        original: 'umluft',
        display: 'Air Circulation'
    },
    'bedroom_light': {
        type: "fixture",
        original: 'bedroom_light',
        display: 'Bedroom Light',
        floorplan_position: [{
            top: "21%",
            left: "15%"
        }],
        rooms: ["bedroom"]
    },
    'blacklight': {
        type: "fixture",
        original: 'blacklight',
        display: 'Black Light',
        floorplan_position: [{
            top: "40%",
            left: "40%"
        }],
        rooms: ["main room"]
    },
    'front_door': {
        type: "fixture",
        original: 'front_door',
        display: 'Front Door Light',
        floorplan_position: [{
            top: "34%",
            left: "74%"
        }],
        rooms: ["awning"]
    }
};
