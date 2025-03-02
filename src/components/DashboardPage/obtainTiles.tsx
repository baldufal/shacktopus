import { MdLightbulb } from "react-icons/md";
import { RoomName } from "../FloorPlanPage/components/Rooms";
import { AUX_BOXES } from "../HeatingPage/Thermocontrol_aux/AuxBox";
import { UserResponse } from "../Router/AuthContext";
import { GiSunRadiations } from "react-icons/gi";
import { IoIosFlame } from "react-icons/io";
import { TbGauge } from "react-icons/tb";
import { PiFanFill } from "react-icons/pi";
import { FaQuestion } from "react-icons/fa";

export type FloorplanPosition = {
    top: string,
    left: string,
}

export type FixtureName = {
    type: "fixture" | "circulation" | "thermocontrol" | "radiant_heaters_lock" | "aux_box" | "unknown",
    original: string,
    display: string,
    background_active?: string,
    background_inactive?: string,
    floorplan_position?: FloorplanPosition[],
    rooms?: RoomName[]
}

export const getIcon = (fixture: FixtureName): {icon: JSX.Element, color: string} => 
    {
    switch (fixture.type) {
        case "fixture": return {icon: <MdLightbulb
         color="black"/>, color: "yellow"};
        case "circulation": return {icon: <PiFanFill 
        color="black"/>, color: "lightblue"};      
        case "thermocontrol": return {icon: <IoIosFlame
        color="black" />, color: "red"};
        case "radiant_heaters_lock": return {icon: <GiSunRadiations
        color="black" />, color: "red"};
        case "aux_box": return {icon: <TbGauge
        color="black"
       />, color: "green"};
        default: return {icon: <FaQuestion color="black" />, color: "black"};
    }
}

export const obtainTiles = (fixtureNames: FixtureName[] | undefined, userData: UserResponse | undefined): { allTiles: FixtureName[], initialSelectedTiles: FixtureName[] } => {
    // These are the tiles that we currently receive from the APIs
    const currentAvailableTiles : FixtureName[] = [
        { type: "thermocontrol", display: "Thermocontrol", original: "tc" },
        { type: "radiant_heaters_lock", display: "Radiant Heaters Lock", original: "rh" },
        ...AUX_BOXES,
        ...(fixtureNames ? fixtureNames : [])
    ]

    // These are the favorites that we loaded from the backend server
    // We identify them based on the original name
    const savedFavoriteTiles : FixtureName[] = userData ? userData.userConfig.dashboard.map((dashboardItem) =>
        currentAvailableTiles.find(
            (tile) => tile.original === dashboardItem)
        || { type: "unknown", original: dashboardItem, display: dashboardItem }
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