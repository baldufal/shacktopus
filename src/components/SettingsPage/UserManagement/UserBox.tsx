import { Box, Button, IconButton, Spacer, Text, Wrap } from "@chakra-ui/react";
import { useState } from "react";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle
} from "../../ui/dialog"
import { Permission, useAuth } from "../../Router/AuthContext";
import { DeleteIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import EditUserDialog from "./EditUserDialog";
import "./userManagement.scss";
import axios from "axios";



function UserBox(props: { username: string, permissions: Permission[], reloadUsers: () => void }) {

    const auth = useAuth();
    const [open, setOpen] = useState(false);
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
        setOpen(false);
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
                borderColor={"brand.solid"}
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
                            bg={"brand.secondary.solid"}
                            className="permission">
                            <Text key={permission}>{permission}</Text>
                        </Box>)}
                    <Spacer />
                    <IconButton
                        disabled={props.username === "admin"}
                        marginTop={"2px"}
                        aria-label="edit"
                        onClick={() => handleEdit(props)}>
                        <MdEdit />
                    </IconButton>
                    <IconButton
                        disabled={props.username === "admin" ||
                            props.username === "guest"}
                        marginTop={"2px"}
                        aria-label="delete"
                        onClick={() => setOpen(true)}>
                        <DeleteIcon />
                    </IconButton>
                </Wrap>
            </Box>

            <DialogRoot
                lazyMount
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
                role="alertdialog"
            >

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                    Are you sure you want to delete this user? This action cannot be undone.
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>

            {selectedUser && isEditOpen && (
                <EditUserDialog
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    user={selectedUser}
                    reloadUsers={props.reloadUsers} />
            )}
        </>
    )
}

export default UserBox;