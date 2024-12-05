import { VStack } from "@chakra-ui/react";
import "./settingsPage.scss";
import DebugInfo from "./DebugInfo/DebugInfo";
import { Permission, useAuth } from "../Router/AuthContext";
import UserManagement from "./UserManagement/UserManagement";

function SettingsPage() {
    const auth = useAuth();

    return (
        <VStack className="settings-stack" align={"start"} spacing={"2em"} width={"100%"}>
            {auth.userData?.permissions.includes(Permission.USER_MANAGEMENT) && <UserManagement/>}
            <DebugInfo/>
        </VStack>
    );
}

export default SettingsPage;
