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
import { getUserSubscriptions, getOwnerSubscriptions } from "../api/user";
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
    const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
    const [ownedSubscriptions, setOwnedSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUserSubscriptions()
            .then(res => {
                console.log("user res = ", res)
                // conversion from string to date must be done manually
                setUserSubscriptions(res.data.map((sub: Subscription) => {
                    sub.expirationDate = new Date(sub.expirationDate); 
                    console.log("\t sub = ", sub)
                    return sub
                }));
            })
            .catch(error => {
                console.error(error)
            });
        getOwnerSubscriptions()
            .then(res => {
                console.log("owner res = ", res)
                // conversion from string to date must be done manually
                setOwnedSubscriptions(res.data.map((sub: Subscription) => {
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

    const download = () => {
        const pdfUrl = "Example.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        console.log(link.href);
        link.download = "Finance with Maple.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                            <h1>Owned Subscriptions</h1>
                            <h3>Subscriptions that you own and can change who has the ability to use it</h3>
                            <Table id="owned-subs">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Item Name</Table.HeaderCell>
                                        <Table.HeaderCell>Expiration Date</Table.HeaderCell>
                                        <Table.HeaderCell>Accessor Email</Table.HeaderCell>
                                        <Table.HeaderCell>Accessor First Name</Table.HeaderCell>
                                        <Table.HeaderCell>Accessor Last Name</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {ownedSubscriptions.map(sub => (
                                        <Table.Row key={"owned_"+sub.subscriptionId}>
                                            <Table.Cell>{sub.item.name}</Table.Cell>
                                            <Table.Cell>{sub.expirationDate.toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>{sub.user.email}</Table.Cell>
                                            <Table.Cell>{sub.user.firstName}</Table.Cell>
                                            <Table.Cell>{sub.user.lastName}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            <h1>Accessible Subscriptions</h1>
                            <h3>Subscriptions that you may or may not own, but have access to (i.e., can use them to access the book)</h3>
                            <Table id="usable-subs">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Item Name</Table.HeaderCell>
                                        <Table.HeaderCell>Expiration Date</Table.HeaderCell>
                                        <Table.HeaderCell>Owner Email</Table.HeaderCell>
                                        <Table.HeaderCell>Owner First Name</Table.HeaderCell>
                                        <Table.HeaderCell>Owner Last Name</Table.HeaderCell>
                                        <Table.HeaderCell colSpan = "2" textAlign="center">Operation</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {userSubscriptions.map(sub => (
                                        <Table.Row key={"user_"+sub.subscriptionId}>
                                            <Table.Cell>{sub.item.name}</Table.Cell>
                                            <Table.Cell>{sub.expirationDate.toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>{sub.user.email}</Table.Cell>
                                            <Table.Cell>{sub.user.firstName}</Table.Cell>
                                            <Table.Cell>{sub.user.lastName}</Table.Cell>
                                            {
                                                sub.item.name != "Finance with Maple" ?
                                                <Table.Cell colSpan = "2" textAlign="center">
                                                    <Button id="read-button" onClick={readBook} animated='fade'>
                                                    <Button.Content visible>Read</Button.Content>
                                                    <Button.Content hidden>
                                                        <Icon name='book' />
                                                    </Button.Content>
                                                </Button>
                                                </Table.Cell> :
                                                <Table.Cell textAlign="right">
                                                    <Button id="read-button" onClick={readBook} animated='fade'>
                                                    <Button.Content visible>Read</Button.Content>
                                                    <Button.Content hidden>
                                                        <Icon name='book' />
                                                    </Button.Content>
                                                    </Button>
                                                </Table.Cell>
                                            }
                                            {
                                                sub.item.name != "Finance with Maple" ? 
                                                null:
                                                <Table.Cell textAlign="center">
                                                    <Button id="download-button" onClick={download} animated='fade'>
                                                        <Button.Content visible>Download</Button.Content>
                                                        <Button.Content hidden>
                                                            <Icon name='download' />
                                                        </Button.Content>
                                                    </Button>
                                                </Table.Cell>
                                            }
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
