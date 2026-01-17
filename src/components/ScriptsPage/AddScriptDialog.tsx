import { Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button, VStack, Textarea, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "../Router/AuthContext";
import { validateScript } from "./scripting/validateScript";
import { MdDelete } from "react-icons/md";

interface AddScriptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string; // Optional prop to edit an existing script
}

const AddScriptDialog: React.FC<AddScriptDialogProps> = ({ isOpen, onClose, editId }) => {
    const auth = useAuth();

    let container = editId ? auth.userData?.userConfig.scripts?.find(s => s.id === editId) : undefined;

    const [name, setName] = useState(container?.name || "");
    const [content, setContent] = useState(container?.content || "");
    const [validation, setValidation] = useState(validateScript(content));

    const [confirmationNeeded, setConfirmationNeeded] = useState(true);

    useEffect(() => {
        container = editId ? auth.userData?.userConfig.scripts?.find(s => s.id === editId) : undefined;
        setName(container?.name || "");
        setContent(container?.content || "");
        setValidation(validateScript(container?.content || ""));
        setConfirmationNeeded(true);
    }, [isOpen]);



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

    const handleDelete = async () => {
        if (container) {
            auth.updateUserConfig({
                ...auth.userData!.userConfig,
                scripts: auth.userData!.userConfig.scripts!.filter(s =>
                    s.id !== editId
                )
            });
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
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
                                fontSize={"14px"}
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
                <ModalFooter
                    position={"relative"}>
                    {!editId ? null : confirmationNeeded ?
                        <IconButton
                            isDisabled={name.length === 0 && content.length === 0}
                            onClick={() => setConfirmationNeeded(false)}
                            mr={3}
                            aria-label="delete script"
                            icon={<MdDelete />}
                        />
                        : <Button
                            mr={3}
                            onClick={() => {
                                handleDelete();
                                onClose();
                            }}>
                            Confirm Delete
                        </Button>
                    }

                    <Button onClick={onClose} mr={3}>
                        Cancel
                    </Button>
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