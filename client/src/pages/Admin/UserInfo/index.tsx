import React, {useEffect, useState, useReducer} from "react";
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
}

interface localState {
    sortBy: string; // 'email', 'name', 'createdAt'
    sortDirection: 'ascending' | 'descending' | undefined;
    filterActivated: boolean | null;
    filterRole: 1 | 2 | null;
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
    const initlocalState: localState = {
        sortBy: '',
        sortDirection: undefined,
        filterActivated: null,
        filterRole: null,
    };
    const [state, dispatch] = useReducer(sortingReducer, initlocalState);
    const filteredUsers = userData.filter(user => {
        if (state.filterActivated !== null && user.activatedAccount !== state.filterActivated) {
            return false;
        }
        if (state.filterRole !== null && user.role !== state.filterRole) {
            return false;
        }
        return true;
    });

    let sortedUsers = filteredUsers;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
        switch (state.sortBy) {
            case 'email':
                sortedUsers = sortedUsers.sort((a, b) => a['email'].localeCompare(b['email']));
                break;
            case 'name':
                sortedUsers = sortedUsers.sort((a, b) => a['name'].localeCompare(b['name']));
                break;
            case 'createdAt':
                sortedUsers = sortedUsers.sort((a, b) => a['createdAt'].localeCompare(b['createdAt']));
                break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
            case 'email':
                sortedUsers = sortedUsers.sort((a, b) => b['email'].localeCompare(a['email']));
                break;
            case 'name':
                sortedUsers = sortedUsers.sort((a, b) => b['name'].localeCompare(a['name']));
                break;
            case 'createdAt':
                sortedUsers = sortedUsers.sort((a, b) => b['createdAt'].localeCompare(a['createdAt']));
                break;
        }
    }

    const handleFilterChange = (field: string) => {
        dispatch({ type: 'FILTER', payload: field });
    };

    const handleSortChange = (field: string) => {
        if (state.sortBy === field) {
            dispatch({ type: 'CHANGE_SORT_DIRECTION', payload: field});
        } else {
            dispatch({ type: 'CHANGE_SORT_FIELD', payload: field });
        }
    };

    function sortingReducer(state: localState, action: {type: string, payload: string}): localState {
        switch (action.type) {
          case 'CHANGE_SORT_FIELD':
              return {
                ...state,
                sortBy: action.payload,
                sortDirection: 'ascending',
              }
          case 'CHANGE_SORT_DIRECTION':
            return {
                ...state,
                sortDirection: state.sortDirection === 'ascending' ? 'descending' : 'ascending',
            }
          case 'FILTER':
            switch (action.payload) {
                case 'activated':
                    return {
                        ...state,
                        filterActivated: state.filterActivated === null ? true : state.filterActivated === true ? false : null,
                    }
                case 'role':
                    return {
                        ...state,
                        filterRole: state.filterRole === null ? 1 : state.filterRole === 1 ? 2 : null,
                    }
                default:
                    throw new Error("invalid filter field")
            }
          default:
            throw new Error("invalid action type")
        }
      }
    
    useEffect(() => {
        setLoading(true);
        getAllUserData()
        .then(res => {
            setUserData(res.data)
            console.log('user data set')
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
                            
                            {state.sortBy === '' ? null : <div>Sorting by: {state.sortBy}</div>}
                            {state.filterActivated === null ? null : 
                                <div>Filtering by: {state.filterActivated ? 'Activated' : 'Deactivated'}
                                </div>
                            }
                            {state.filterRole === null ? null : 
                                <div>Filtering by: {state.filterRole === 1 ? 'Admin' : 'User'}
                                </div>
                            }

                            <Table sortable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell 
                                        sorted={state.sortBy === 'email' ? state.sortDirection : undefined}
                                        onClick={() => handleSortChange('email')}>Email</Table.HeaderCell>
                                        <Table.HeaderCell 
                                        sorted={state.sortBy === 'name' ? state.sortDirection : undefined}
                                        onClick={() => handleSortChange('name')}>Username</Table.HeaderCell>
                                        <Table.HeaderCell 
                                        sorted={state.sortBy === 'createdAt' ? state.sortDirection : undefined}
                                        onClick={() => handleSortChange('createdAt')}>Register Time</Table.HeaderCell>
                                        <Table.HeaderCell onClick={() => handleFilterChange('role')}>Admin</Table.HeaderCell>
                                        <Table.HeaderCell onClick={() => handleFilterChange('activated')}>Activated</Table.HeaderCell>
                                        <Table.HeaderCell>Verify Email</Table.HeaderCell>
                                        <Table.HeaderCell>Activate</Table.HeaderCell>
                                        <Table.HeaderCell>Delete User</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {sortedUsers.map(user => (
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
