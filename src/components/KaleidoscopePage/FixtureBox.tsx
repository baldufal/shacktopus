import { Box, Button, Flex, Separator, Text, VStack, Wrap } from "@chakra-ui/react";
import { Fixture } from "./kaleidoscopeTypes";
import ParameterBox from "./ParameterBox";
import { useKaleidoscope } from "../../contexts/KaleidoscopeContext";
import { useEffect, useState } from "react";
import "./../fixturebox.scss"
import { FixtureName } from "../DashboardPage/obtainTiles";
import { useColorMode } from "../ui/color-mode";
import { DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger, } from "../ui/dialog";


function FixtureBox(props: { fixtureName: FixtureName, data: Fixture }) {

    const { colorMode } = useColorMode()

    const { setProgram, error: kaleidoscopeSetError } = useKaleidoscope();

    const programNames = Object.keys(props.data.programs).sort().filter((value) => value !== "EXTERNAL");
    const selectedProgram = props.data.programs[props.data.selected_program];
    const parameterNames = Object.keys(selectedProgram.parameters).sort();

    const [open, setOpen] = useState<boolean>(false);

    // API request was sent and not yet answered
    const [loading, setLoading] = useState<boolean>(true);
    //const toast = useToast()

    useEffect(() => {
        setLoading(false);
    }, [props.data.selected_program]);

    function changeProgram(programName: string) {
        setLoading(true);
        const error = setProgram(props.fixtureName.original, programName)
        /*
        if (error) 
        toast({
                title: "Error",
                description: error,
                status: "error",
                duration: 2000,
                isClosable: true
            })
                */
    }

    return (

        <div className="containerdiv">
            {props.data.selected_program !== "OFF" ?
                <div
                    className="fixturebox_background"
                    style={{
                        backgroundImage: props.fixtureName.background_active,
                        opacity: 1,
                        zIndex: -2,
                    }} />
                : null
            }

            <div
                className={"fixturebox_background " +
                    (colorMode === "light" ? "" : "inverted")}
                style={{ backgroundImage: props.fixtureName.background_inactive }} />
            <Box
                width={"fit-content"}
                className="fixturebox"
                p={2}
                borderColor=
                {kaleidoscopeSetError ? "indicator.read_only" :
                    loading ?
                        "indicator.dirty" : "indicator.ok"}>
                <VStack align={"start"}>
                    <Flex >
                        <Text
                            className="fixturebox_heading"
                            bg={"var(--chakra-colors-chakra-body-bg)"}
                            borderRadius={"0.375rem"}
                            padding={"0.2rem"}
                            margin={"-0.2rem"}>
                            {props.fixtureName.display}
                        </Text>
                        {/*
                        <DialogRoot lazyMount open={open} onOpenChange={() => setOpen(false)}>
                            <DialogTrigger asChild>
                                <Button
                                    marginTop={"1px"}
                                    marginStart={"10px"}
                                    rounded={"full"}
                                    //size={"20px"}
                                    //borderRadius={"20px"}
                                    height={"20px"}
                                    width={"20px"}
                                    onClick={() => setOpen(true)}>
                                    i
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{props.fixtureName.display}</DialogTitle>
                                </DialogHeader>
                                <DialogBody>
                                    <VStack align={"start"}>
                                        <Text>{"API name: " + props.fixtureName.original}</Text>
                                        <Text maxWidth={"300px"}>{"Output aliases: " + props.data.output_aliases.sort()}</Text>
                                    </VStack>
                                </DialogBody>
                                <DialogCloseTrigger />
                            </DialogContent>
                        </DialogRoot>
                         */}
                        
                    </Flex>

                    <Separator />
                    <Wrap maxWidth={"300"}>
                        {programNames.map((programName) =>
                            <Button
                                disabled={kaleidoscopeSetError ? true : false}
                                key={programName}
                                margin="2px"
                                padding={"10px"}
                                //colorScheme={"secondary"}
                                colorPalette={props.data.selected_program === programName ? "secondary" : "primary"}
                                onClick={() => changeProgram(programName)}
                            >
                                {programName}</Button>)}
                    </Wrap>
                    <VStack align={"start"}>
                        {parameterNames.map((parameterName) =>
                            <ParameterBox
                                key={parameterName}
                                fixture={props.fixtureName.original}
                                program={props.data.selected_program}
                                parameterName={parameterName}
                                data={selectedProgram.parameters[parameterName]} />)}
                    </VStack>
                </VStack>
            </Box>
        </div>



    )
}

export default FixtureBox;