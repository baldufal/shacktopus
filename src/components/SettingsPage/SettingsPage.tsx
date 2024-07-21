import { Divider, VStack } from "@chakra-ui/react";
import GeneralSettings from "./GeneralSettings";
import ThermocontrolSettings from "./ThermocontrolSettings";
import "./settingsPage.scss";

function SettingsPage() {


    return (
        <VStack className="settings-stack " align={"start"} spacing={"2em"}>
            <GeneralSettings/>
            <Divider/>
            <ThermocontrolSettings/>
        </VStack>
    );
}

export default SettingsPage;
