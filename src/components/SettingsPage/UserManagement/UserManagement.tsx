import { Box, Divider, HStack, IconButton, Spacer, Text, VStack } from "@chakra-ui/react";
import "./../settingsPage.scss";
import { Permission, useAuth } from "../../Router/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import UserBox from "./UserBox";
import { MdAdd } from "react-icons/md";
import EditUserDialog from "./EditUserDialog";

type UserResponse = [{ username: string, permissions: Permission[] }];

function UserManagement() {

    const auth = useAuth();

    const [users, setUsers] = useState<UserResponse>();
    const [error, setError] = useState<string | null>(null);

    const [addIsOpen, setAddIsOpen] = useState(false);

    const getUsers = async () => {
        try {
            const response = await axios.get(`http://${window.location.host}/api/users?token=${auth.userData?.token}`);

            const responseData = response.data as UserResponse;

            setUsers(responseData);
        } catch (error) {
            console.error('Error getting uses:', error);
            setError('Error getting users: ' + error);
        }
    }
    useEffect(() => { getUsers() }, []);

    return (
        <>
            <Box className="settings-box">
                <VStack className="settings-box-stack" align={"start"} spacing={1}>
                    <Text className="settings-box-heading shacktopus-heading">User Management</Text>
                    <Divider />
                    <VStack className="settings-stack" align={"start"} spacing={"2em"} width={"100%"}>

                        {error ? <Text>{error}</Text> :

                            <VStack width={"100%"}>
                                <HStack
                                    width={"100%"}>
                                    <Spacer />
                                    <IconButton
                                        aria-label={"add user"}
                                        icon={<MdAdd />}
                                        onClick={() => setAddIsOpen(true)} />
                                </HStack>
                                {users && users.map(user =>
                                    <UserBox
                                        key={user.username}
                                        username={user.username}
                                        permissions={user.permissions}
                                        reloadUsers={getUsers} />)}
                            </VStack>
                        }
                    </VStack>
                </VStack>
            </Box>
            {addIsOpen && (
                <EditUserDialog
                    reloadUsers={getUsers}
                    addUser={true}
                    isOpen={addIsOpen}
                    onClose={() => setAddIsOpen(false)}
                    user={null} />
            )}</>

    );
}

export default UserManagement;
