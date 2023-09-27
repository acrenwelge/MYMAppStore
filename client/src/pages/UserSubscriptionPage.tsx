import React, { useEffect, useState } from "react";
import {
    Table,
    Icon,
    Grid,
    GridColumn,
    Container,
    Loader, Dimmer, Button
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { getUserSubscriptions } from "../api/user";
import { Subscription } from "../entities";

interface localUser {
    role: number;
    name: string;
}

const UserSubscriptionPage: React.FC = (props): JSX.Element | null => {
    const history = useHistory()
    const user: localUser | null = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        // Redirect to main page
        history.push('/');
        return null;
    }
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUserSubscriptions()
            .then(res => {
                // conversion from string to date must be done manually
                setSubscriptions(res.data.map((sub: Subscription) => {
                    sub.expirationDate = new Date(sub.expirationDate); 
                    return sub
                }));
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }, []);

    const readBook = () => {
        history.push('/read')
    }

    return (
        <Container style={{ marginTop: 10, marginBottom: 30 }}>
            <Grid columns={2}>
                <Grid.Row>
                    <GridColumn width={15}>
                        <div style={{ height: '80vh', overflowY: 'auto' }}>
                            {loading == true ? <Dimmer active inverted>
                                <Loader inverted>Loading Subscriptions of {user.name}</Loader>
                            </Dimmer> : <div></div>
                            }
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Item Name</Table.HeaderCell>
                                        <Table.HeaderCell>Expiration Date</Table.HeaderCell>
                                        <Table.HeaderCell>Operation</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {subscriptions.map(sub => (
                                        <Table.Row key={sub.id}>
                                            <Table.Cell>{sub.item.name}</Table.Cell>
                                            <Table.Cell>{sub.expirationDate.toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>
                                                <Button onClick={readBook} animated='fade'>
                                                    <Button.Content visible>Read</Button.Content>
                                                    <Button.Content hidden>
                                                        <Icon name='book' />
                                                    </Button.Content>
                                                </Button>
                                            </Table.Cell>
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

export default UserSubscriptionPage;