import { Text, Button, Box, Wrap, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Permission, useAuth } from "../../Router/AuthContext";
import axios from "axios";
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "../../ui/drawer";

// Data needed to update or create a user
type UserUpdate = {
    username: string,
    password?: string,
    permissions?: Permission[]
};

interface EditUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: { username: string; permissions: Permission[] };
    reloadUsers: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ isOpen, onClose, user, reloadUsers }) => {
    const [permissions, setPermissions] = useState(user?.permissions || []);
    const auth = useAuth();

    const handleSave = async () => {
        const userUpdate = { username: user.username, permissions };
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
        <DrawerRoot open={isOpen} onOpenChange={(e) => onClose()}>
            <DrawerBackdrop />

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{"Edit User " + user.username}</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                    <VStack align={"start"}>
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
                                        colorPalette={"secondary"}
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
                                        colorPalette={"secondary"}
                                        className="permission"
                                        onClick={() => setPermissions([...permissions, permission])}
                                    >
                                        {permission}
                                    </Button>)}
                            </Wrap>

                        </Box>
                    </VStack>
                </DrawerBody>
                <DrawerFooter>
                    <Button onClick={onClose} mr={3}>Cancel</Button>
                    <Button
                        onClick={handleSave}>
                        Save
                    </Button>
                </DrawerFooter>
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>

    );
};

export default EditUserDialog;