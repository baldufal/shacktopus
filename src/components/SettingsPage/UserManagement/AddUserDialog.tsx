import { Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button, Box, Wrap, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Permission, useAuth } from "../../Router/AuthContext";
import { useThemeColors } from "../../../contexts/ThemeContext";
import axios from "axios";

// Data needed to create a user
export type UserCreationRequest = {
    username: string,
    password: string,
    permissions?: Permission[]
};

interface AddUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reloadUsers: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose, reloadUsers }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const theme = useThemeColors();
    const auth = useAuth();

    const handleSave = async () => {
        const userCreationRequest = { username, password, permissions }
        try {
            const response = await axios.post(`http://${window.location.host}/api/create-user?token=${auth.userData?.token}`,
                userCreationRequest as UserCreationRequest
            );

            console.log(response.data.message);
        } catch (error) {
            console.error('Error saving user:', error);
        }

        reloadUsers();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{"Add User"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align={"start"}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <Text>Selected Permissions</Text>
                        <Box
                            borderRadius={"0.375rem"}
                            borderWidth={"2px"}
                            minHeight={"50px"}
                            minWidth={"100%"}
                        >
                            <Wrap>
                                {permissions.length > 0 ? permissions.map(permission =>
                                    <Button
                                        key={permission}
                                        bg={theme.secondary}
                                        className="permission"
                                        onClick={() => setPermissions(permissions.filter(p => p !== permission))}
                                    >
                                        {permission}
                                    </Button>)
                                    :
                                    <Text opacity={0.5} className="permission">Click on permissions below to select them!</Text>}
                            </Wrap>

                        </Box>

                        <Text>Available Permissions</Text>
                        <Box
                            borderRadius={"0.375rem"}
                            borderWidth={"2px"}
                            minHeight={"50px"}
                            minWidth={"100%"}
                        >
                            <Wrap>
                                {Object.values(Permission).filter(avail => !permissions.includes(avail)).map(permission =>
                                    <Button
                                        key={permission}
                                        bg={theme.secondary}
                                        className="permission"
                                        onClick={() => setPermissions([...permissions, permission])}
                                    >
                                        {permission}
                                    </Button>)}
                            </Wrap>

                        </Box>
                    </VStack>

                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} mr={3}>Cancel</Button>
                    <Button
                        isDisabled={username.length < 3}
                        onClick={handleSave}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddUserDialog;