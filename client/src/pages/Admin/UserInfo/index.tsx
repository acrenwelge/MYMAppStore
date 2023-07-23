import React, {useEffect, useState} from "react";
import {
    Table,
    Icon,
    Grid,
    GridColumn,
    Container,
    Confirm,
    Loader, Dimmer, Button
} from "semantic-ui-react";
import AdminMenu from "../../../components/AdminMenu";
import {getAllUserData, updateUser, deleteUser} from "../../../api/admin";
import {useHistory} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

interface UserData {
    id: number;
    email: string;
    name: string;
    activatedAccount: boolean;
    createdAt: string;
    role: number;
}

interface localUser {
    role: number;
}
const formatDate = (dateTime:string):string =>{
    const date= new Date(new Date(dateTime).toLocaleString())
    return date.toISOString()     // format: 2020-04-20T20:08:18.966Z
        .replace(/T/, ' ')       // replace T with a space
        .replace(/\..+/, '')     // delete the dot and everything after
    // const year = date.getFullYear();
    // const month = (date.getMonth() + 1).toString().padStart(2, "0");
    // const day = date.getDate().toString().padStart(2, "0");
    // const formattedDate = `${year}-${month}-${day}`;
    // const hour = date.getHours().toString().padStart(2, "0");
    // const minute = date.getMinutes().toString().padStart(2, "0");
    // const second = date.getSeconds().toString().padStart(2, "0");
    // const formattedTime = `${hour}:${minute}:${second}`;
    // const formattedDateTime = `${formattedDate} ${formattedTime}`;
    // return formattedDateTime;
}

const AdminUserInfo: React.FC = (props): JSX.Element | null => {
    const history = useHistory()
    const user: localUser | null = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!user || user.role !== 1) {
        // Redirect to main page
        history.push('/');
        return null;
    }
    
    const [userData, setUserData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    
    useEffect(() => {
        setLoading(true);
        getAllUserData()
        .then(res => {
            setUserData(res.data)
            setLoading(false)
        })
        .catch(error => {
            console.error(error)
            setLoading(false)
        });
    }, []);
    
    const sendVerificationEmail = (id: number) => {
        console.log("send verification email - to be implemented");
    }
    const toggleUserActive = (id: number) => {
        const user = userData.find(user => user.id === id);
        if (!user) {
            console.error("Attempted to activate user but no user found in local data");
            toast.error("User activation failed");
        } else {
            user.activatedAccount = !user.activatedAccount;
            updateUser(user)
            .then(res => {
                if (user.activatedAccount) {
                    toast.success("User activated successfully");
                } else {
                    toast.warn("User deactivated successfully");
                }
                setUserData(userData.map(u => {
                    if (u.id === id) {
                        u.activatedAccount = user.activatedAccount;
                    }
                    return u;
                }));
            })
            .catch(error => {
                console.error(error);
                const msg  = user.activatedAccount ? 'activation' : 'deactivation';
                toast.error("User "+msg+" failed");
            });
        }
    }
    const confirmUserDelete = (id: number) => {
        setSelectedUserId(id);
        setConfirmBoxOpen(true);
    }
    const attemptUserDelete = () => {
        if (selectedUserId === null) {
            console.error("Attempted to delete but no user selected");
            toast.error("User delete failed");
            return;
        } else {
            deleteUser(selectedUserId).then(res => {
                toast.success("User deleted successfully");
                setConfirmBoxOpen(false);
                setUserData(userData.filter(user => user.id !== selectedUserId));
            }).catch(error => {
                console.error(error);
                setConfirmBoxOpen(false);
                toast.error("User delete failed");
            });
        }
    }
    const resetSelectedUser = () => {
        setSelectedUserId(null);
        setConfirmBoxOpen(false);
    }

    return (

        <Container className="container-fluid" fluid style={{padding: "2"}}>
            <Grid columns={2}>
                <Grid.Row>
                    <GridColumn width={3}>
                        <AdminMenu/>
                    </GridColumn>

                    <GridColumn width={12}>
                        <div style={{height:'80vh',overflowY:'auto'}}>
                            {loading==true?<Dimmer active inverted>
                                <Loader inverted>Loading User</Loader>
                            </Dimmer>:<div></div>
                            }

                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Email</Table.HeaderCell>
                                        <Table.HeaderCell>Username</Table.HeaderCell>
                                        <Table.HeaderCell>Register Time</Table.HeaderCell>
                                        <Table.HeaderCell>Admin</Table.HeaderCell>
                                        <Table.HeaderCell>Activated</Table.HeaderCell>
                                        <Table.HeaderCell>Verify Email</Table.HeaderCell>
                                        <Table.HeaderCell>Activate</Table.HeaderCell>
                                        <Table.HeaderCell>Delete User</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {userData.map(user => (
                                        <Table.Row key={user.id}>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>{user.name}</Table.Cell>
                                            <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                                            <Table.Cell>
                                                {user.role == 1 ?
                                                    <Icon color='blue' name='checkmark' size='large' />:
                                                   <div></div>}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.activatedAccount?
                                                    <Icon color='green' name='checkmark' size='large' />:
                                                   <div></div>}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button compact size='medium' color="green" onClick={() => sendVerificationEmail(user.id)}>Resend Verification Email</Button>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.activatedAccount ?
                                                <Button compact size='medium' color="orange" onClick={() => toggleUserActive(user.id)}>Deactivate User</Button>
                                                : <Button compact size='medium' color="blue" onClick={() => toggleUserActive(user.id)}>Activate User</Button>
                                                }
                                            </Table.Cell>
                                            <Table.Cell><Button compact color="red" onClick={() => confirmUserDelete(user.id)}>Delete User</Button></Table.Cell>
                                           </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </GridColumn>
                </Grid.Row>
            </Grid>
            <ToastContainer position="bottom-right" />
            <Confirm
            open={confirmBoxOpen}
            content="Are you sure you want to delete this user?"
            confirmButton="Delete User"
            onCancel={resetSelectedUser}
            onConfirm={attemptUserDelete}
            />
        </Container>
    );
};

export default AdminUserInfo;
