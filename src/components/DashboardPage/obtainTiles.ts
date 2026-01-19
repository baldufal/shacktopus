import { RoomName } from "../FloorPlanPage/components/Rooms";
import { AUX_BOXES } from "../HeatingPage/Thermocontrol_aux/AuxBox";
import { KNOWN_FIXTURES } from "../KaleidoscopePage/KNOWN_FIXTURES";
import { UserResponse } from "../Router/AuthContext";

export type FloorplanPosition = {
    top: string,
    left: string,
}

export type FixtureName = {
    original: string,
    display: string,
    background_active?: string,
    background_inactive?: string,
    floorplan_position?: FloorplanPosition[],
    rooms?: RoomName[]
}

const firstTiles = ["tc", ...AUX_BOXES.map(box => box.original), "rh"];

export const obtainTiles = (fixtureNames: FixtureName[] | undefined, userData: UserResponse | undefined): { allTiles: FixtureName[], initialSelectedTiles: FixtureName[] } => {
    // These are the tiles that we currently receive from the APIs
    const currentAvailableTiles = [
        { display: "Thermocontrol", original: "tc" },
        { display: "Radiant Heaters Lock", original: "rh" },
        ...AUX_BOXES,
        ...(fixtureNames ? fixtureNames : [])
    ]

    // These are the favorites that we loaded from the backend server
    // We identify them based on the original name
    const savedFavoriteTiles = userData ? userData.userConfig.dashboard.map((dashboardItem) =>
        currentAvailableTiles.find((tile) => tile.original === dashboardItem) || { original: dashboardItem, display: dashboardItem }
    ) : [];

    // To get all possible tiles we combine all currentAvailableTiles
    // with those savedFavoriteTiles, that have no pendant in currentAvailableTiles
    const allTiles: FixtureName[] = [
        ...currentAvailableTiles,
        ...savedFavoriteTiles
    ]
        // Filter out duplicates
        .filter((tile, index, self) =>
            index === self.findIndex((t) => t.original === tile.original)
        )
        // Sort based on display name
        .sort((a, b) => {
            // Put firstTiles at the beginning
            const aInFirst = firstTiles.includes(a.original);
            const bInFirst = firstTiles.includes(b.original);
            if (aInFirst !== bInFirst)
                return aInFirst ? -1 : 1;
            if (aInFirst && bInFirst)
                return firstTiles.indexOf(a.original) - firstTiles.indexOf(b.original);
            // Put unknown fixtures at the end, then sort alphabetically
            const aKnown = a.original in KNOWN_FIXTURES;
            const bKnown = b.original in KNOWN_FIXTURES;
            if (aKnown !== bKnown)
                return bKnown ? 1 : -1;
            return a.display.localeCompare(b.display);
        });

    const initialSelectedTiles = userData ?
        userData.userConfig.dashboard.map((dashboardItem) =>
            allTiles.find((tile) => tile.original === dashboardItem))
            .filter((tile): tile is FixtureName => tile !== undefined) :
        [];

    return { allTiles, initialSelectedTiles }
}