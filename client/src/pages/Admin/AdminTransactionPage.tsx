import React, {useEffect, useState, useReducer} from "react";
import {
    Table,
    Input,
    Container,
    Loader, Dimmer
} from "semantic-ui-react";
import {getAllTransactions} from "../../api/admin";
import Transaction from "../../entities/transaction";
import AdminBasePage from "./AdminBasePage";

interface localState {
    sortBy: string;
    sortDirection: 'ascending' | 'descending' | undefined;
    filterActivated: boolean | null;
    filterRole: "admin" | "user" | "instructor" | null;
    filterText: string;
}

const AdminTransactionPage: React.FC = (props): JSX.Element | null => {
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const initlocalState: localState = {
        sortBy: '',
        sortDirection: undefined,
        filterActivated: null,
        filterRole: null,
        filterText: '',
    };
    const [state, dispatch] = useReducer(sortingReducer, initlocalState);
    const filteredTransactions = transactionData.filter(transaction => {
        if (state.filterText !== '' && 
            !transaction.user.email.toLowerCase().includes(state.filterText.toLowerCase()) && 
            !transaction.user.firstName.toLowerCase().includes(state.filterText.toLowerCase()) &&
            !transaction.user.lastName.toLowerCase().includes(state.filterText.toLowerCase())) {
            return false;
        }
        return true;
    });

    let sortedTransactions = filteredTransactions;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
        switch (state.sortBy) {
            case 'txid':
                sortedTransactions = sortedTransactions.sort((a, b) => {
                    if (a['txId'] < b['txId']) return -1;
                    if (a['txId'] > b['txId']) return 1;
                    return 0;
                });
                break;
            case 'email':
                sortedTransactions = sortedTransactions.sort((a, b) => a.user['email'].localeCompare(b.user['email']));
                break;
            case 'name':
                sortedTransactions = sortedTransactions.sort((a, b) => a.user['firstName'].localeCompare(b.user['firstName']));
                break;
            case 'totalAmount':
                sortedTransactions = sortedTransactions.sort((a, b) => {
                    if (a['total'] < b['total']) return -1;
                    if (a['total'] > b['total']) return 1;
                    return 0;
                });
                break;
            case 'purchaseDate':
                sortedTransactions = sortedTransactions.sort((a, b) => {
                    const dateA = new Date(a['createdAt']);
                    const dateB = new Date(b['createdAt']);
                    return dateA.getTime() - dateB.getTime();
                });
                break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
            case 'txid':
                sortedTransactions = sortedTransactions.sort((b, a) => {
                    if (a['txId'] < b['txId']) return -1;
                    if (a['txId'] > b['txId']) return 1;
                    return 0;
                });
                break;
            case 'email':
                sortedTransactions = sortedTransactions.sort((b, a) => a.user['email'].localeCompare(b.user['email']));
                break;
            case 'name':
                sortedTransactions = sortedTransactions.sort((b, a) => a.user['firstName'].localeCompare(b.user['firstName']));
                break;
            case 'totalAmount':
                sortedTransactions = sortedTransactions.sort((b, a) => {
                    if (a['total'] < b['total']) return -1;
                    if (a['total'] > b['total']) return 1;
                    return 0;
                });
                break;
            case 'purchaseDate':
                sortedTransactions = sortedTransactions.sort((b, a) => {
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

    const refreshAllTransactionData = async () => {
        setLoading(true);
        getAllTransactions()
        .then(res => {
            console.log(res.data)
            setTransactionData(res.data)
            setLoading(false)
        })
        .catch(error => {
            console.error(error)
            setLoading(false)
        });
    }

    useEffect(() => {
        refreshAllTransactionData()
    }, []);

    return (
        <AdminBasePage>
            <div style={{height:'80vh',overflowY:'auto'}}>
                {loading === true ? <Dimmer active inverted>
                    <Loader inverted>Loading Transactions</Loader>
                </Dimmer> : <></>
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
                                sorted={state.sortBy === 'txid' ? state.sortDirection : undefined} 
                                onClick={() => handleSortChange('txid')}
                            >TxID</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'firstName' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('firstName')}
                            >User First Name</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'lastName' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('lastName')}
                            >User Last Name</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'email' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('email')}
                            >User Email</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'totalAmount' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('totalAmount')}
                            >Total Amount</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'purchaseDate' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('purchaseDate')}
                            >Purchase Date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedTransactions.map(tx => (
                            <Table.Row key={tx.txId}>
                                <Table.Cell>{tx.txId}</Table.Cell>
                                <Table.Cell>{tx.user.firstName}</Table.Cell>
                                <Table.Cell>{tx.user.lastName}</Table.Cell>
                                <Table.Cell>{tx.user.email}</Table.Cell>
                                <Table.Cell>${tx.total.toFixed(2)}</Table.Cell>
                                <Table.Cell>{new Date(tx.createdAt).toLocaleDateString()}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </AdminBasePage>
    );
};

export default AdminTransactionPage;
