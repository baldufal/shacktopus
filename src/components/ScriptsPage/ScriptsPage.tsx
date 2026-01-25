import { Box, Wrap, Button } from "@chakra-ui/react";
import "../fixturebox.scss"
import { useState } from "react";
import ScriptBox from "./ScriptBox";
import { useAuth } from "../Router/AuthContext";
import AddScriptDialog from "./AddScriptDialog";

function ScriptsPage() {

    const { userData } = useAuth();
    const scripts =
        userData?.userConfig.scripts || [];

    const [addIsOpen, setAddIsOpen] = useState(false);

    return (
        <Box
            as="main"
            flex="1"
            p={4}
            paddingTop={0}
            width="100%">
            <Wrap>
                {scripts.map(({ id, name }) =>
                    <div key={id}>
                        <ScriptBox
                            key={name}
                            id={id} />
                    </div>

                )}
                <Button onClick={() => setAddIsOpen(true)}>Add Script</Button>
            </Wrap>

            <AddScriptDialog
                isOpen={addIsOpen}
                onClose={() => setAddIsOpen(false)} />
        </Box>
    )
}

export default ScriptsPage;