import React, {useEffect, useState, useReducer} from "react";
import {
    Table,
    Icon,
    Input,
    Container,
    Confirm,
    Loader, Dimmer, Button, Dropdown
} from "semantic-ui-react";
import {getAllUserData, updateUser, deleteUser, sendAccountActivationEmail} from "../../api/admin";
import {useHistory} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import User from "../../entities/user";
import AdminBasePage from "./AdminBasePage";
import { formatDate } from "../../utils";
import { Roles } from "../../entities/roles";

interface localUser {
    role: string;
}
interface localState {
    sortBy: string; // 'email', 'name', 'createdAt'
    sortDirection: 'ascending' | 'descending' | undefined;
    filterActivated: boolean | null;
    filterRole: "admin" | "user" | "instructor" | null;
    filterText: string;
}

const AdminUserInfoPage: React.FC = (props): JSX.Element | null => {    
    const [userData, setUserData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const initlocalState: localState = {
        sortBy: '',
        sortDirection: undefined,
        filterActivated: null,
        filterRole: null,
        filterText: '',
    };
    const [state, dispatch] = useReducer(sortingReducer, initlocalState);
    const filteredUsers = userData.filter(user => {
        if (state.filterActivated !== null && user.activatedAccount !== state.filterActivated) {
            return false;
        }
        if (state.filterRole !== null && user.role !== state.filterRole) {
            return false;
        }
        if (state.filterText !== '' && 
            !user.email.toLowerCase().includes(state.filterText.toLowerCase()) && 
            !user.firstName.toLowerCase().includes(state.filterText.toLowerCase()) &&
            !user.lastName.toLowerCase().includes(state.filterText.toLowerCase())) {
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
            case 'firstName':
                sortedUsers = sortedUsers.sort((a, b) => a['firstName'].localeCompare(b['firstName']));
                break;
            case 'lastName':
                sortedUsers = sortedUsers.sort((a, b) => a['lastName'].localeCompare(b['lastName']));
                break;
            case 'createdAt':
                sortedUsers = sortedUsers.sort((a, b) => {
                    const dateA = new Date(a['createdAt']);
                    const dateB = new Date(b['createdAt']);
                    return dateA.getTime() - dateB.getTime();
                });
                break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
            case 'email':
                sortedUsers = sortedUsers.sort((b, a) => a['email'].localeCompare(b['email']));
                break;
            case 'firstName':
                sortedUsers = sortedUsers.sort((b, a) => a['firstName'].localeCompare(b['firstName']));
                break;
            case 'lastName':
                sortedUsers = sortedUsers.sort((b, a) => a['lastName'].localeCompare(b['lastName']));
                break;
            case 'createdAt':
                sortedUsers = sortedUsers.sort((b, a) => {
                    const dateA = new Date(a['createdAt']);
                    const dateB = new Date(b['createdAt']);
                    return dateA.getTime() - dateB.getTime();
                });
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

    const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'FILTER_TEXT', payload: e.target.value });
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
                            filterRole: state.filterRole === null ? "admin" : state.filterRole === "admin" ? "user" : null,
                        }
                    default: throw new Error("invalid filter field")
                }
            case 'FILTER_TEXT':
                return {
                    ...state,
                    filterText: action.payload,
                }
          default:
            throw new Error("invalid action type")
        }
      }

    const refreshAllUserData = async () => {
        setLoading(true);
        getAllUserData()
        .then(res => {
            setUserData(res.data)
            setLoading(false)
        })
        .catch(error => {
            console.error(error)
            toast.error("Failed to load user data")
            setLoading(false)
        });
    }

    useEffect(() => {
        refreshAllUserData()
    }, []);
    
    const sendVerificationEmail = (id: number) => {
        const user = userData.find(user => user.userId === id);
        if (!user) {
            console.error("Attempted to send verification email but no user found in local data");
            toast.error("Verification email failed - are you logged in?");
        } else {
            sendAccountActivationEmail(user)
            .then(res => {
                toast.success("Verification email sent successfully");
            })
            .catch(error => {
                console.error(error);
                toast.error("Verification email failed");
            });
        }
    }

    const toggleUserActive = (id: number) => {
        console.log("ID:",id);
        console.log("USERDATA:",userData);
        const user = userData.find(user => user.userId === id);
        if (!user) {
            console.error("Attempted to activate user but no user found in local data");
            toast.error("User activation failed");
        } else {
            user.activatedAccount = !user.activatedAccount;
            console.log("TEST:",user);
            updateUser(user)
            .then(res => {
                if (user.activatedAccount) {
                    toast.success("User activated successfully");
                } else {
                    toast.warn("User deactivated successfully");
                }
                refreshAllUserData();
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
                refreshAllUserData();
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

    const changeUserRole = (id: number, newRole: Roles) => {
        const user = userData.find(user => user.userId === id);
        if (!user) {
            console.error("Attempted to change user role but no user found in local data");
            toast.error("User role change failed");
        } else {
            user.role = newRole;
            updateUser(user)
            .then(res => {
                toast.success("User role changed successfully");
                refreshAllUserData();
            }).catch(error => {
                console.error(error);
                toast.error("User role change failed");
            });
        }
    }

    return (
      <AdminBasePage>
        <div style={{height:'80vh',overflowY:'auto'}}>
          {loading==true?<Dimmer active inverted>
            <Loader inverted>Loading User</Loader>
          </Dimmer>:<div></div>
          }
          <Container>
              {state.sortBy === '' ? null : <div>Sorting by: {state.sortBy}</div>}
              {state.filterActivated === null ? null : 
                  <div>Filtering by: {state.filterActivated ? 'Activated' : 'Deactivated'}
                  </div>
              }
              {state.filterRole === null ? null : 
                  <div>Filtering by: {state.filterRole}
                  </div>
              }
          </Container>

            <Input label="Search by Email or Name:" icon='search' placeholder='email@domain.com'
              onChange={(e) => handleFilterTextChange(e)}/>
            <Table sortable>
              <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell 
                          sorted={state.sortBy === 'email' ? state.sortDirection : undefined}
                          onClick={() => handleSortChange('email')}
                      >Email</Table.HeaderCell>
                      <Table.HeaderCell 
                          sorted={state.sortBy === 'firstName' ? state.sortDirection : undefined}
                          onClick={() => handleSortChange('firstName')}
                      >First Name</Table.HeaderCell>
                      <Table.HeaderCell 
                          sorted={state.sortBy === 'lastName' ? state.sortDirection : undefined}
                          onClick={() => handleSortChange('lastName')}
                      >Last Name</Table.HeaderCell>
                      <Table.HeaderCell 
                          sorted={state.sortBy === 'createdAt' ? state.sortDirection : undefined}
                          onClick={() => handleSortChange('createdAt')}
                      >Register Time</Table.HeaderCell>
                      <Table.HeaderCell onClick={() => handleFilterChange('role')}>Admin</Table.HeaderCell>
                      <Table.HeaderCell onClick={() => handleFilterChange('activated')}>Activated</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedUsers.map(user => (
                  <Table.Row key={user.userId}>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.firstName}</Table.Cell>
                    <Table.Cell>{user.lastName}</Table.Cell>
                    <Table.Cell>{formatDate(user.createdAt).split(' ')[0]}</Table.Cell>
                    <Table.Cell>
                        {user.role === "admin" ?
                            <Icon color='blue' name='checkmark' size='large' />:
                            <div></div>}
                    </Table.Cell>
                    <Table.Cell>
                        {user.activatedAccount ?
                            <Icon color='green' name='checkmark' size='large' />:
                            <div></div>}
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown text='User Actions'>
                        <Dropdown.Menu>
                          <Dropdown.Item color="green" icon='paper plane' 
                              onClick={() => sendVerificationEmail(user.userId)} text='Resend verification email' />
                          {user.activatedAccount ? 
                            <Dropdown.Item text='Deactivate user' onClick={() => toggleUserActive(user.userId)}/> : 
                            <Dropdown.Item text='Activate user' onClick={() => toggleUserActive(user.userId)}/>}
                          {user.role !== Roles.Admin ? 
                            <Dropdown.Item text='Change role to Admin' onClick={() => changeUserRole(user.userId,Roles.Admin)}/> : null }
                          {user.role !== Roles.User ? 
                            <Dropdown.Item text='Change role to User' onClick={() => changeUserRole(user.userId,Roles.User)}/> : null }
                          {user.role !== Roles.Instructor ?
                            <Dropdown.Item text='Change role to Instructor' onClick={() => changeUserRole(user.userId,Roles.Instructor)}/> : null }
                          <Dropdown.Divider />
                          <Dropdown.Item text='Delete user' onClick={() => confirmUserDelete(user.userId)}/>
                          </Dropdown.Menu>
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        </div>
        <ToastContainer position="bottom-right" />
        <Confirm
          open={confirmBoxOpen}
          content="Are you sure you want to delete this user?"
          confirmButton="Delete User"
          onCancel={resetSelectedUser}
          onConfirm={attemptUserDelete}
        />
      </AdminBasePage>
    );
};

export default AdminUserInfoPage;
