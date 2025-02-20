import { Box, Separator, Text, VStack } from "@chakra-ui/react";
import "./../settingsPage.scss";
import { useAuth } from "../../Router/AuthContext";


function DebugInfo() {

    const auth = useAuth();

    const formattedExpiration = auth.userData?.tokenExpiration
        ? new Date(auth.userData!.tokenExpiration * 1000).toLocaleString()
        : "N/A";  // Falls kein Token vorhanden ist

    return (
        <Box className="settings-box">
            <VStack className="settings-box-stack" align={"start"} gap={1}>
                <Text className="settings-box-heading shacktopus-heading">Debug Info</Text>
                <Separator />
                <VStack className="settings-stack" align={"start"} gap={"2em"}>
                    <Text>{"MODE: " + process.env.NODE_ENV}</Text>
                    <Text wordBreak={"break-all"}>{"Token : " + auth.userData?.token}</Text>
                    <Text>{"Token expiration at: " + formattedExpiration}</Text>
                </VStack>
            </VStack>
        </Box>
    );
}

export default DebugInfo;
