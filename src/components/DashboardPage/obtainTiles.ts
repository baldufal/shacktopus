import { AUX_BOXES } from "../HeatingPage/Thermocontrol_aux/AuxBox";
import { UserResponse } from "../Router/AuthContext";

export type FloorplanPosition = {
    top: string,
    left: string
}

export type FixtureName =  {
    original: string,
    display: string,
    background_active?: string,
    background_inactive?: string,
    floorplan_position?: FloorplanPosition,
  }

export const obtainTiles = (fixtureNames: FixtureName[] | undefined, userData: UserResponse | undefined):
 { allTiles: FixtureName[], initialSelectedTiles: FixtureName[] } => {
    // These are the tiles that we currently receive from the APIs
    const currentAvailableTiles = [
        { display: "Thermocontrol", original: "tc" },
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
        .sort((a, b) => a.display.localeCompare(b.display));

    const initialSelectedTiles = userData ?
        userData.userConfig.dashboard.map((dashboardItem) =>
            allTiles.find((tile) => tile.original === dashboardItem))
            .filter((tile): tile is FixtureName => tile !== undefined) :
        [];

    return { allTiles, initialSelectedTiles }
}