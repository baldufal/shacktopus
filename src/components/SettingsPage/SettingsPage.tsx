import { Divider, VStack } from "@chakra-ui/react";
import GeneralSettings from "./GeneralSettings";
import "./settingsPage.scss";
import LoginSettings from "./LoginSettings";

function SettingsPage() {


    return (
        <VStack className="settings-stack " align={"start"} spacing={"2em"}>
            <GeneralSettings/>
            <Divider/>
            <LoginSettings/>
        </VStack>
    );
}

export default SettingsPage;
