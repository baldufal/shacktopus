import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./../../fixturebox.scss"
import AuxDetails from "./AuxDetails";
import ClimateDetails from "./ClimateDetails";
import HeatingEnergy from "./HeatingEnergy";
import { FixtureName } from "../../DashboardPage/obtainTiles";
import { useAuth } from "../../Router/AuthContext";
import { TcAuxData, TcMessage, TcUpdates } from "../Thermocontrol/ThermocontrolMessage";

export type AuxBoxProps = {
    title: string,
    loading: boolean,
    error: string | undefined,
    dataFromAPI: TcAuxData | undefined,
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

    const auth = useAuth();

    const [dataFromAPI, setDataFromAPI] = useState<TcAuxData | undefined>(undefined);

    // Last API request returned an error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [, setStale] = useState<boolean>(false);

    const { lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/thermocontrol`, { share: true, retryOnError: true });

    const handleMessage = useCallback(
        (message: MessageEvent) => {
            try {
                const parsedMessage = JSON.parse(message.data) as TcMessage;
                switch (parsedMessage.messageType) {
                    case "error":
                        console.log("Received thermocontrol error: " + parsedMessage.error);
                        break;
                    case "tokenError":
                        console.log("Received thermocontrol token error: " + parsedMessage.error);
                        // Investigate token health
                        auth.refreshToken();
                        break;
                    case "update":
                        const update = parsedMessage.data as TcUpdates
                        if (update.type != "tc_aux")
                            return;
                        setStale(update.stale);

                        const data = update.data_aux!;
                        setDataFromAPI(data);

                        setError(undefined);
                        setLoading(false);
                }
            } catch (error) {
                setError("An error occured during parsing thermocontrol message");
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
            "indicator.error" :
            "indicator.ok";

    // THIS MUST BE KEPT UP TO DATE WITH AuxBoxes DEFINITION AT THE TOP
    switch (props.type) {
        case AUX_BOXES.at(0)!.original:
            return (<AuxDetails title={AUX_BOXES.at(0)!.display} loading={loading} error={error} dataFromAPI={dataFromAPI} borderColor={borderColor} />)
        case AUX_BOXES.at(1)!.original:
            return (<ClimateDetails title={AUX_BOXES.at(1)!.display} loading={loading} error={error} dataFromAPI={dataFromAPI} borderColor={borderColor} />)
        case AUX_BOXES.at(2)!.original:
            return (<HeatingEnergy title={AUX_BOXES.at(2)!.display} loading={loading} error={error} dataFromAPI={dataFromAPI} borderColor={borderColor} />)

    }
}

export default AuxBox;