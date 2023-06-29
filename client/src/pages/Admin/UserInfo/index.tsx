import React, {useEffect, useState} from "react";
import {
    Table,
    Icon,
    Grid,
    GridColumn,
    Container,
     Loader, Dimmer, Button
} from "semantic-ui-react";
import AdminMenu from "../../../components/AdminMenu";
import {getAllUserData} from "../../../api/admin";
import {useHistory} from "react-router-dom";
import { deleteUser } from "../../../api/admin";

interface UserData {
    id: number;
    email: string;
    name: string;
    activatedAccount:boolean;
    createdAt:string;
}

interface localUser {
    role: number;
}
const formatDate = (dateTime:string):string =>{
    const date= new Date(new Date(dateTime).toLocaleString())
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hour}:${minute}:${second}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
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

    const sendVerificationEmail = (id: number) =>{
        console.log("send verification email - to be implemented");
    }
    const activateUser = (id: number) =>{
        console.log("activate user - to be implemented");
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
                                        <Table.HeaderCell>Activated</Table.HeaderCell>
                                        <Table.HeaderCell>Send Verification Email</Table.HeaderCell>
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
                                                {user.activatedAccount?
                                                    <Icon color='green' name='checkmark' size='large' />:
                                                   <div></div>}
                                            </Table.Cell>
                                            <Table.Cell><Button color="green" onClick={() => sendVerificationEmail(user.id)}>Send Verification Email</Button></Table.Cell>
                                            <Table.Cell><Button color="blue" onClick={() => activateUser(user.id)}>Activate User</Button></Table.Cell>
                                            <Table.Cell><Button color="red" onClick={() => deleteUser(user.id)}>Delete User</Button></Table.Cell>
                                           </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default AdminUserInfo;
