import { Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button, Box, Wrap, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Permission, useAuth } from "../../Router/AuthContext";
import { useThemeColors } from "../../../contexts/ThemeContext";
import axios from "axios";

// Data needed to update or create a user
type UserUpdate = {
    username: string,
    password?: string,
    permissions?: Permission[]
};

interface EditUserDialogProps {
    addUser: boolean;
    isOpen: boolean;
    onClose: () => void;
    user: { username: string; permissions: Permission[] } | null;
    reloadUsers: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ addUser, isOpen, onClose, user, reloadUsers }) => {
    const [username, setUsername] = useState(user?.username || "");
    const [password, setPassword] = useState("");
    const [permissions, setPermissions] = useState(user?.permissions || []);
    const theme = useThemeColors();
    const auth = useAuth();

    const handleSave = async () => {
        const userUpdate = addUser ? { username, password, permissions } : { username, permissions };
        try {
            const response = await axios.post(`http://${window.location.host}/api/update-user?token=${auth.userData?.token}`,
                userUpdate as UserUpdate
            );

            console.log(response.data.message);
        } catch (error) {
            console.error('Error updating user:', error);
        }

        reloadUsers();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{addUser ? "Add User" : "Edit User " + username}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align={"start"}>
                        {addUser && <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                        </FormControl>}
                        {addUser && <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>}
                        <Text>Selected Permissions</Text>
                        <Box
                            borderRadius={"0.375rem"}
                            borderWidth={"2px"}
                            minHeight={"50px"}
                            minWidth={"100%"}
                            borderColor={theme.primary}
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
                        isDisabled={addUser && (username.length < 3)}
                        onClick={handleSave}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditUserDialog;