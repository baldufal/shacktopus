import { Text, VStack } from "@chakra-ui/react";
import "./settingsPage.scss";
import { useAuth } from "../Router/AuthContext";

function SettingsPage() {
    const auth = useAuth();

    const formattedExpiration = auth.userData?.tokenExpiration
        ? new Date(auth.userData!.tokenExpiration * 1000).toLocaleString()
        : "N/A";  // Falls kein Token vorhanden ist

    return (
        <VStack className="settings-stack" align={"start"} spacing={"2em"}>
            <Text>{"MODE: " + process.env.NODE_ENV}</Text>
            <Text>{"Token : " + auth.userData?.token}</Text>
            <Text>{"Token expiration at: " + formattedExpiration}</Text>
        </VStack>
    );
}

export default SettingsPage;
