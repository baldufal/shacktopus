import { Box, Divider, Flex, Icon, Skeleton, Spacer, Switch, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useThemeColors } from "../../../contexts/ThemeContext";
import { Permission, useAuth } from "../../Router/AuthContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./../../fixturebox.scss"
import "./radiantheaters.scss"
import { MdHourglassTop, MdLock } from "react-icons/md";
import { TcUpdates, TcMessage } from "./ThermocontrolMessage";

function RadiantHeaters() {

    const auth = useAuth();

    const { indicator } = useThemeColors();


    const [data, setData] = useState<boolean>(false);

    // No data received yet
    const [loading, setLoading] = useState<boolean>(true);
    // API request was sent and not yet answered
    const [dirty, setDirty] = useState<boolean>(true);
    // Last API request returned an error
    const [error, setError] = useState<string | undefined>(undefined);

    const writePermission = auth.userData && auth.userData.permissions.find((val) => val === Permission.HEATING) != undefined

    const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${window.location.host}/api/thermocontrol`, { share: true, retryOnError: true });


    // Debounced function to handle UI data changes
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
                        if (update.type != "tc")
                            return;
                        if (!update.stale) {
                            const data = update.data!;
                            setData(data.heizstrahler_is_active!);
                            setError(undefined);
                            setDirty(false);
                            setLoading(false);
                        } else {
                            setError("TC update health != good");
                        }
                }
            } catch (error) {
                setError("An error occured during parsing thermocontrol message");
                console.log("An error occured during parsing thermocontrol message: " + error)
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

    const sendData = useCallback(
        (heizstrahler_is_active: boolean) => {
            setDirty(true);
            sendMessage(JSON.stringify({
                token: auth.userData!.token,
                data: { heizstrahler_is_active: heizstrahler_is_active }
            }));
        },
        [auth.userData!.token]
    );

    if (!error && loading)
        return <Skeleton
            width={"150px"}
            height={"100px"} />

    const borderColor = error ? indicator.error : dirty ? indicator.dirty : indicator.ok;
    return (
        <div className="containerdiv">
            <div
                    className={"fixturebox_background_color"} />
            <Box
                className={data ? "fixturebox radiantheatersactive" : "fixturebox"}
                width={"fit-content"}
                borderColor={borderColor}
                p={2}>
                {error ? <Text color={indicator.error}>{error}</Text> :
                    <VStack align={"start"}>
                        <Flex width={"100%"}>
                            <Text className="fixturebox_heading">Radiant Heaters Lock</Text>
                            <Spacer />
                            {writePermission ?
                                (dirty ?
                                    <Icon as={MdHourglassTop} color={indicator.dirty} />
                                    : null)
                                :
                                <Icon as={MdLock} margin={"4px"}/>}
                        </Flex>
                        <Divider></Divider>
                        <Switch
                            isDisabled={!writePermission}
                            isChecked={data}
                            onChange={(event) => {
                                sendData(event.target.checked);
                            }}>Unlock</Switch>
                    </VStack>
                }
            </Box>
        </div>
    )
}

export default RadiantHeaters;