import { Box, Text, Textarea, VStack, Wrap, Button } from "@chakra-ui/react";
import "../fixturebox.scss"
import { useState } from "react";
import { validateScript } from "./scripting/validateScript";
import ScriptBox from "./ScriptBox";

function ScriptsPage() {

    const [script, setScript] = useState(`{
    "parameters": [
        { "name": "light_intensity", "type": "NUMBER", "value": 50, "min": 0, "max": 100},
        { "name": "color", "type": "COLOR_RGB", "red": 0.2, "green": 0.3, "blue": 0.4},
        { "name": "bool", "type": "BOOLEAN", "value": true}
    ],
    "computations": [
        { "name": "scaled_intensity", "type": "LINEAR", "variable": "$light_intensity", "factor": "$color.blue", "offset": 10 }
    ],
    "actions": [
        { "type": "K_SET_CONTINUOUS", "fixture": "LivingRoom", "program": "Dim", "value": "$scaled_intensity" }
    ]
}`);

    const [result, setResult] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setScript(event.target.value);
        
        const validationResult = validateScript(event.target.value);
        if (validationResult.valid)
            setResult("Valid!")
        else
            setResult(validationResult.error)
    };

    const handleClick = () => {
        setResult("validating...");
        const validationResult = validateScript(script);
        if (validationResult.valid)
            setResult("Valid!")
        else
            setResult(validationResult.error)
    }

    return (
        <Box
            as="main"
            flex="1"
            p={4}
            paddingTop={0}
            width="100%">
            <Wrap>
                <ScriptBox 
                data={{
                    id: "asdf",
                    name: "Script",
                    script: script
                }} />
            </Wrap>
            <VStack>
                <Textarea
                    height={"60vh"}
                    value={script}
                    onChange={handleChange} />
                <Button
                    onClick={handleClick}
                >Check</Button>
                <Text>{result}</Text>
            </VStack>
        </Box>
    )
}

export default ScriptsPage;