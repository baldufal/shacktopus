import { Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button, VStack, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../Router/AuthContext";
import { validateScript } from "./scripting/validateScript";

interface AddScriptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string; // Optional prop to edit an existing script
}

const AddScriptDialog: React.FC<AddScriptDialogProps> = ({ isOpen, onClose, editId }) => {
    const auth = useAuth();

    const container = editId ? auth.userData?.userConfig.scripts?.find(s => s.id === editId) : undefined;

    const [name, setName] = useState(container?.name || "");
    const [content, setContent] = useState(container?.content || "");

    const handleSave = async () => {
        if (container) {
            auth.updateUserConfig({
                ...auth.userData!.userConfig,
                scripts: auth.userData!.userConfig.scripts!.map(s =>
                    s.id === editId ? { ...s, name: name, content: content } : s
                )
            });
        } else {
            auth.updateUserConfig({
                ...auth.userData!.userConfig,
                scripts: [
                    ...auth.userData!.userConfig.scripts || [],
                    { id: Date.now().toString(), name: name, content: content }
                ]
            });
        }

        onClose();
    };

    const [validation, setValidation] = useState(validateScript(content));



    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{container ? "Edit Script" : "Add Script"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align={"start"}>
                        <FormControl>
                            <FormLabel>Script Name</FormLabel>
                            <Input
                                borderWidth={"2px"}
                                borderColor={name.length < 3 ? "red" : "green"}
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Script Content</FormLabel>
                            <Textarea
                                borderWidth={"2px"}
                                borderColor={validation.valid ? "green" : "red"}
                                minHeight={"50vh"}
                                value={content}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setContent(v);
                                    setValidation(validateScript(v));
                                }
                                } />
                        </FormControl>
                        <FormControl>
                            <Text
                                color={"red"}>
                                {name.length < 3 ? "Name too short (min 3 characters)" : ""}
                            </Text>
                        </FormControl>
                        <FormControl>
                            <Text

                                color={validation.valid ? "green" : "red"}>
                                {validation.valid ? "Script is valid!" : `Error: ${validation.error}`}
                            </Text>
                        </FormControl>

                    </VStack>

                </ModalBody>
                <ModalFooter>
                    <Button
                        isDisabled={name.length === 0 && content.length === 0}
                        onClick={() => {
                            setName("");
                            setContent("");
                        }
                        } mr={3}>
                        Clear
                    </Button>
                    <Button onClick={onClose} mr={3}>Cancel</Button>
                    <Button
                        isDisabled={name.length < 3 || !validation.valid}
                        onClick={handleSave}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddScriptDialog;