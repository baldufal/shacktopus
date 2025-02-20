import { Box, Button, Flex, Separator, Text, VStack } from "@chakra-ui/react";
import "./../fixturebox.scss"
import { ScriptContainer } from "./scripting/Script";
import { validateScript } from "./scripting/validateScript";
import ParameterNumber from "./ParameterNumber";
import ParameterBoolean from "./ParameterBoolean";
import ParameterColorRGB, { RGBColor } from "./ParameterColorRGB";

function ScriptBox(props: { data: ScriptContainer }) {

    const script = validateScript(props.data.script)

    return (

        <Box
            width={"fit-content"}
            className="fixturebox"
            p={2}
            borderColor=
            {script.valid ?
                "indicator.ok" : "indicator.error"}>
            <VStack align={"start"}>
                <Flex >
                    <Text
                        className="fixturebox_heading"
                        bg={"var(--chakra-colors-chakra-body-bg)"}
                        borderRadius={"0.375rem"}
                        padding={"0.2rem"}
                        margin={"-0.2rem"}>
                        {props.data.name}
                    </Text>
                    <Button
                        marginTop={"1px"}
                        marginStart={"10px"}
                        borderRadius={"20px"}
                        height={"20px"}
                        width={"20px"}
                        onClick={() => { }}>i</Button>
                </Flex>

                <Separator></Separator>
                {script.valid ?
                    <VStack align="start">
                        {script.script.parameters.map((parameter, index) => {
                            switch (parameter.type) {
                                case "BOOLEAN":
                                    return <ParameterBoolean
                                        key={index}
                                        name={parameter.name}
                                        value={parameter.value}
                                        setValue={function (newValue: boolean): void {
                                            console.log(newValue)
                                        }} />
                                case "NUMBER":
                                    return <ParameterNumber
                                        key={index}
                                        name={parameter.name}
                                        value={parameter.value}
                                        min={parameter.min}
                                        max={parameter.max}
                                        setValue={function (newValue: number): void {
                                            console.log(newValue);
                                        }} />
                                case "COLOR_RGB":
                                    return <ParameterColorRGB
                                        key={index}
                                        name={parameter.name}
                                        value={{ red: parameter.red, green: parameter.green, blue: parameter.blue }}
                                        setValue={function (newValue: RGBColor): void {
                                            console.log(newValue);
                                        }} />
                                default:
                                    return <Text key={index}>Unknown Parameter</Text>;
                            }
                        })}
                    </VStack>

                    :
                    <Text>Script contains error: {script.error}</Text>}

            </VStack>
        </Box>

    )
}

export default ScriptBox;