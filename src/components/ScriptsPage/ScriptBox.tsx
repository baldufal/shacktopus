import { Box, Button, Divider, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { useThemeColors } from "../../contexts/ThemeContext";
import "./../fixturebox.scss"
import { ScriptParameter } from "./scripting/Script";
import { validateScript } from "./scripting/validateScript";
import ParameterNumber from "./ParameterNumber";
import ParameterBoolean from "./ParameterBoolean";
import ParameterColorRGB from "./ParameterColorRGB";
import { useState } from "react";
import { executeScript } from "./scripting/executeScript";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import { useAuth } from "../Router/AuthContext";
import AddScriptDialog from "./AddScriptDialog";
import { MdEdit } from "react-icons/md";

function ScriptBox(props: { id: string }) {

    const { indicator } = useThemeColors();

    const { userData } = useAuth();
    const scripts =
        userData?.userConfig.scripts || [];

    const { setProgram, setDiscrete, setContinuous } = useKaleidoscope();

    const container = scripts.find(s => s.id === props.id);
    if (!container) {
        return <Box>Script not found</Box>;
    }

    const script = validateScript(container.content);

    const [parameters, setParameters] = useState(() =>
        Object.fromEntries(
            script.valid ? script.script.parameters
                .filter(param => param.type != "COMMENT")
                .map(param => [param.name, getInitialValue(param)])
                : []
        )
    );

    function getInitialValue(param: ScriptParameter) {
        switch (param.type) {
            case "BOOLEAN":
                return param.value;
            case "NUMBER":
                return param.value;
            case "COLOR_RGB":
                return { red: param.red, green: param.green, blue: param.blue };
        }
    }

    function updateParameter(name: string, newValue: any) {
        setParameters(prev => ({ ...prev, [name]: newValue }));
    }


    const [editIsOpen, setEditIsOpen] = useState(false);

    return (
        <>
            <Box
                width={"fit-content"}
                maxWidth={"350px"}
                className="fixturebox"
                p={2}
                borderColor=
                {script.valid ?
                    indicator.ok : indicator.error}>
                <VStack
                    align={"start"}
                >
                    <Flex >
                        <Text
                            className="fixturebox_heading"
                            bg={"var(--chakra-colors-chakra-body-bg)"}
                            borderRadius={"0.375rem"}
                            padding={"0.2rem"}
                            margin={"-0.2rem"}>
                            {container.name}
                        </Text>
                        <IconButton
                            marginStart={"20px"}
                            onClick={() => setEditIsOpen(true)}
                            aria-label={"edit script"}
                            icon={<MdEdit />}
                        />
                    </Flex>

                    <Divider></Divider>
                    {script.valid ?
                        <>
                            <VStack align="start">
                                {script.script.parameters.map((parameter, index) => {
                                    switch (parameter.type) {
                                        case "COMMENT":
                                            return <Text
                                                key={parameter.name}>{parameter.value}
                                            </Text>
                                        case "BOOLEAN":
                                            return <ParameterBoolean
                                                key={parameter.name}
                                                name={parameter.name}
                                                value={parameters[parameter.name] as boolean}
                                                setValue={function (newValue: boolean): void {
                                                    //console.log(newValue);
                                                    updateParameter(parameter.name, newValue);
                                                }} />
                                        case "NUMBER":
                                            return <ParameterNumber
                                                key={parameter.name}
                                                name={parameter.name}
                                                value={parameters[parameter.name] as number}
                                                min={parameter.min}
                                                max={parameter.max}
                                                setValue={function (newValue: number): void {
                                                    // console.log(newValue);
                                                    updateParameter(parameter.name, newValue);
                                                }} />
                                        case "COLOR_RGB":
                                            return <ParameterColorRGB
                                                key={parameter.name}
                                                name={parameter.name}
                                                red={(parameters[parameter.name] as { red: number, green: number, blue: number }).red}
                                                green={(parameters[parameter.name] as { red: number, green: number, blue: number }).green}
                                                blue={(parameters[parameter.name] as { red: number, green: number, blue: number }).blue}
                                                setValue={function (newValue: { red: number, green: number, blue: number }): void {
                                                    //console.log(newValue);
                                                    updateParameter(parameter.name, newValue);
                                                }} />
                                        default:
                                            return <Text key={index}>Unknown Parameter</Text>;
                                    }
                                })}
                            </VStack>
                            <Divider />
                            <Button
                                onClick={() => {
                                    executeScript(script.script, parameters, setProgram, setDiscrete, setContinuous);
                                }}
                            >
                                Execute
                            </Button>
                        </>
                        :
                        <Text>Script contains error: {script.error}</Text>}

                </VStack>
            </Box>

            <AddScriptDialog
                isOpen={editIsOpen}
                onClose={() => setEditIsOpen(false)}
                editId={props.id} />
        </>


    )
}

export default ScriptBox;