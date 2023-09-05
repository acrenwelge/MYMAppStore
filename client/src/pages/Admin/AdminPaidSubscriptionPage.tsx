import React, {useEffect, useState} from "react";
import {
    Table,
    Grid,
    GridColumn,
    Container,
    Checkbox
} from "semantic-ui-react";
import {getAllSubscriptions} from "../../api/admin";
import AdminBasePage from "./AdminBasePage";

const AdminPaidSubscriptionPage: React.FC = (props): JSX.Element => {
    const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);
    const [filterActive, setFilterActive] = useState<boolean>(true);

    const getAllActiveSubscriptions = () => {
        getAllSubscriptions()
            .then(res => {
                setAllSubscriptions(res.data)
            })
            .catch(error => {
                console.error(error)
            });
    };

    useEffect(() => {
        getAllActiveSubscriptions()
    }, []);

    return (
        <AdminBasePage>
            <div style={{marginTop: '10px'}}>
                <h2>Active Subscriptions for All Users</h2>
                <p>The table below lists all active subscriptions for all users.</p>
                <Checkbox toggle label="Filter by active subscriptions only" checked={filterActive} onChange={() => setFilterActive(!filterActive)}/>
            </div>
            <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Email Suffix</Table.HeaderCell>
                            <Table.HeaderCell>End Date</Table.HeaderCell>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {allSubscriptions.map(sub => 
                            filterActive && sub.expirationDate < new Date().toISOString().split('T')[0] ? null :
                        (
                            <Table.Row key={sub.subscriptionId}>
                                <Table.Cell>{sub.user.email}</Table.Cell>
                                <Table.Cell>{sub.expirationDate}</Table.Cell>
                                <Table.Cell>{sub.item.name}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </AdminBasePage>
    );
};

export default AdminPaidSubscriptionPage;
