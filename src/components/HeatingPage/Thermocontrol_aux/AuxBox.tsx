import { useCallback, useEffect, useState } from "react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./../../fixturebox.scss"
import { TCUpdates, ThermocontrolAuxData } from "../Thermocontrol/ThermocontrolDetails";
import AuxDetails from "./AuxDetails";
import ClimateDetails from "./ClimateDetails";
import HeatingEnergy from "./HeatingEnergy";
import { FixtureName } from "../../DashboardPage/obtainTiles";

export type AuxBoxProps = {
    title: string,
    loading: boolean,
    error: string | undefined,
    dataFromAPI: ThermocontrolAuxData | undefined,
    borderColor: string
}

export type AuxBoxType = "details" | "climate_details" | "energy";

// THIS MUST BE KEPT UP TO DATE WITH RENDER CODE BELOW
export const AUX_BOXES: FixtureName[] = [
    {
        original: "details",
        display: "ThermoControl AUX Details"
    },
    {
        original: "climate_details",
        display: "Climate Details"
    },
    {
        original: "energy",
        display: "Heating Energy Consumption"
    }
]

function AuxBox(props: { type: AuxBoxType }) {

    const { indicator } = useThemeColors();

    const [dataFromAPI, setDataFromAPI] = useState<ThermocontrolAuxData | undefined>(undefined);

    // Last API request returned an error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [, setStale] = useState<boolean>(false);

    const { lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/thermocontrol`, {share: true, retryOnError: true});

    const handleMessage = useCallback(
        (message: MessageEvent) => {
            try {
                const json = JSON.parse(message.data) as TCUpdates
                if (json.type != "tc_aux")
                    return;
                setStale(json.stale);

                const data = json.data_aux!;
                setDataFromAPI(data);

                setError(undefined);
                setLoading(false);
            } catch (error) {
                setError("An error occured during parsing data");
                console.log(error)
            }
        },
        []
    );

    useEffect(() => {
        if (lastMessage !== null) {
            handleMessage(lastMessage);
        }
    }, [lastMessage]);

    useEffect(() => {
        if (readyState === ReadyState.OPEN || readyState === ReadyState.CONNECTING) {
            setError(undefined);
        } else {
            setError("WebSocket for TC: state != OPEN or CONNECTING");
        }
    }, [readyState]);

    const borderColor =
        (error || !dataFromAPI) ?
            indicator.error :
            indicator.ok;

    // THIS MUST BE KEPT UP TO DATE WITH AuxBoxes DEFINITION AT THE TOP
    switch (props.type) {
        case AUX_BOXES.at(0)!.original:
            return (<AuxDetails title={AUX_BOXES.at(0)!.display} loading={loading} error={error}  dataFromAPI={dataFromAPI} borderColor={borderColor} />)
        case AUX_BOXES.at(1)!.original:
            return (<ClimateDetails title={AUX_BOXES.at(1)!.display} loading={loading} error={error} dataFromAPI={dataFromAPI} borderColor={borderColor} />)
        case AUX_BOXES.at(2)!.original:
            return (<HeatingEnergy title={AUX_BOXES.at(2)!.display} loading={loading} error={error} dataFromAPI={dataFromAPI} borderColor={borderColor} />)

    }
}

export default AuxBox;