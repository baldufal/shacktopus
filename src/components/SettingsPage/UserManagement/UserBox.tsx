import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, IconButton, Spacer, Text, useDisclosure, Wrap } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Permission, useAuth } from "../../Router/AuthContext";
import { DeleteIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { useThemeColors } from "../../../contexts/ThemeContext";
import EditUserDialog from "./EditUserDialog";
import "./userManagement.scss";
import axios from "axios";



function UserBox(props: { username: string, permissions: Permission[], reloadUsers: () => void }) {

    const auth = useAuth();
    const theme = useThemeColors();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ username: string, permissions: Permission[] } | null>(null);

    async function handleDelete(): Promise<void> {
        try {
            const response = await axios.post(`http://${window.location.host}/api/delete-user?token=${auth.userData?.token}`,
                { username: props.username }
            );

            console.log(response.data.message);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        onClose();
        props.reloadUsers();
    }

    function handleEdit(user: { username: string, permissions: Permission[] }): void {
        setSelectedUser({ username: user.username, permissions: user.permissions });
        setIsEditOpen(true);
    }

    return (
        <>
            <Box
                width={"100%"}
                padding={"0.2rem"}
                borderColor={theme.primary}
                borderWidth={"0.1rem"}
                borderRadius={"0.375rem"}>
                <Wrap width={"100%"}>
                    <Text
                        margin={"5px"}
                        minWidth={"200px"}
                        fontWeight={700}
                    >{props.username}</Text>

                    {props.permissions.map(permission =>
                        <Box
                            key={permission}
                            bg={theme.secondary}
                            className="permission">
                            <Text key={permission}>{permission}</Text>
                        </Box>)}
                    <Spacer />
                    <IconButton
                        isDisabled={props.username === "admin"}
                        marginTop={"2px"}
                        aria-label="edit"
                        icon={<MdEdit />}
                        onClick={() => handleEdit(props)} />
                    <IconButton
                        isDisabled={props.username === "admin" ||
                            props.username === "guest"}
                        marginTop={"2px"}
                        aria-label="delete"
                        icon={<DeleteIcon />}
                        onClick={onOpen} />
                </Wrap>
            </Box>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {selectedUser && isEditOpen && (
                <EditUserDialog
                    addUser={false}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    user={selectedUser} 
                    reloadUsers={props.reloadUsers}/>
            )}
        </>
    )
}

export default UserBox;