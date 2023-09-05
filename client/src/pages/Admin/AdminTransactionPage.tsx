import React, {useEffect, useState} from "react";
import {
    Table,
    Loader, Dimmer
} from "semantic-ui-react";
import {getAllTransactions} from "../../api/admin";
import Transaction from "../../entities/transaction";
import AdminBasePage from "./AdminBasePage";
import { formatDate } from "../../utils";

const AdminTransactionPage: React.FC = (props): JSX.Element | null => {
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getAllTransactions()
            .then(res => {
                setTransactionData(res.data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }, []);

    return (
        <AdminBasePage>
            <div style={{height:'80vh',overflowY:'auto'}}>
                {loading === true ? <Dimmer active inverted>
                    <Loader inverted>Loading Transactions</Loader>
                </Dimmer> : <></>
                }
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>TxID</Table.HeaderCell>
                            <Table.HeaderCell>User First Name</Table.HeaderCell>
                            <Table.HeaderCell>User Last Name</Table.HeaderCell>
                            <Table.HeaderCell>User Email</Table.HeaderCell>
                            <Table.HeaderCell>Total Amount</Table.HeaderCell>
                            <Table.HeaderCell>Purchase Date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {transactionData.map(tx => (
                            <Table.Row key={tx.txId}>
                                <Table.Cell>{tx.txId}</Table.Cell>
                                <Table.Cell>{tx.user.firstName}</Table.Cell>
                                <Table.Cell>{tx.user.lastName}</Table.Cell>
                                <Table.Cell>{tx.user.email}</Table.Cell>
                                <Table.Cell>${tx.total.toFixed(2)}</Table.Cell>
                                <Table.Cell>{formatDate(tx.date)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </AdminBasePage>
    );
};

export default AdminTransactionPage;
