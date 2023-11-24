import React, {useEffect, useState, useReducer} from "react";
import {
    Table,
    Icon,
    Input,
    Container,
    Confirm,
    Loader, Dimmer, Button, Dropdown, Checkbox
} from "semantic-ui-react";
import {getAllSubscriptions} from "../../api/admin";
import Subscription from "../../entities/subscription";
import AdminBasePage from "./AdminBasePage";

interface localState {
    sortBy: string;
    sortDirection: 'ascending' | 'descending' | undefined;
    filterActive: boolean;
    filterText: string;
}

const AdminPaidSubscriptionPage: React.FC = (props): JSX.Element => {
    const [subscriptionData, setSubscriptionData] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
    const initlocalState: localState = {
        sortBy: '',
        sortDirection: undefined,
        filterActive: true,
        filterText: '',
    };
    const [state, dispatch] = useReducer(sortingReducer, initlocalState);
    const filteredSubscriptions = subscriptionData.filter(subscription => {
        if (state.filterActive == true && new Date(subscription.expirationDate) < new Date()) {
            return false;
        }
        if (state.filterText !== '' && 
            !subscription.user.email.toLowerCase().includes(state.filterText.toLowerCase()) && 
            !subscription.user.firstName.toLowerCase().includes(state.filterText.toLowerCase()) &&
            !subscription.user.lastName.toLowerCase().includes(state.filterText.toLowerCase())) {
            return false;
        }
        return true;
    });

    let sortedSubscriptions = filteredSubscriptions;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
        switch (state.sortBy) {
            case 'email':
                sortedSubscriptions = sortedSubscriptions.sort((a, b) => a.user['email'].localeCompare(b.user['email']));
                break;
            case 'name':
                sortedSubscriptions = sortedSubscriptions.sort((a, b) => (
                    a.user['firstName'] + a.user['lastName'] + a.owner['firstName'] + a.owner['lastName']).localeCompare(
                        b.user['firstName'] + b.user['lastName'] + b.owner['firstName'] + b.owner['lastName']));
                break;
            case 'product':
                sortedSubscriptions = sortedSubscriptions.sort((a, b) => a.item['name'].localeCompare(b.item['name']));
                break;
            case 'endDate':
                sortedSubscriptions = sortedSubscriptions.sort((a, b) => {
                    const dateA = new Date(a['expirationDate']);
                    const dateB = new Date(b['expirationDate']);
                    return dateA.getTime() - dateB.getTime();
                });
                break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
            case 'email':
                sortedSubscriptions = sortedSubscriptions.sort((b, a) => a.user['email'].localeCompare(b.user['email']));
                break;
            case 'name':
                sortedSubscriptions = sortedSubscriptions.sort((b, a) => (
                    a.user['firstName'] + a.user['lastName'] + a.owner['firstName'] + a.owner['lastName']).localeCompare(
                        b.user['firstName'] + b.user['lastName'] + b.owner['firstName'] + b.owner['lastName']));
                break;
            case 'product':
                sortedSubscriptions = sortedSubscriptions.sort((b, a) => a.item['name'].localeCompare(b.item['name']));
                break;
            case 'endDate':
                sortedSubscriptions = sortedSubscriptions.sort((b, a) => {
                    const dateA = new Date(a['expirationDate']);
                    const dateB = new Date(b['expirationDate']);
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
                    case 'active':
                        return {
                            ...state,
                            filterActive: state.filterActive === true ? false : true,
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

    const getAllActiveSubscriptions = () => {
        setLoading(true);
        getAllSubscriptions()
            .then(res => {
                console.log(res.data)
                setSubscriptionData(res.data)
                setLoading(false);
            })
            .catch(error => {
                console.error(error)
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllActiveSubscriptions()
    }, []);

    return (
        <AdminBasePage>
            <h1>Active Subscriptions for All Users</h1>
            <div style={{ position: 'absolute', marginTop: '20px', right: 10, overflowY: 'auto' }}>
                <Checkbox toggle label="Filter by active subscriptions only" checked={state.filterActive} onChange={() => handleFilterChange('active')}/>
            </div>
            <div style={{height:'80vh',overflowY:'auto'}}>
                {loading==true?<Dimmer active inverted>
                    <Loader inverted>Loading User</Loader>
                </Dimmer>:<div></div>
                }
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
                                sorted={state.sortBy === 'name' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('name')}
                            >User (Owner)</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'product' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('product')}
                            >Product</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'endDate' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('endDate')}
                            >End Date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body id="subscriptionTable">
                        {sortedSubscriptions.map(sub => (
                            <Table.Row key={sub.subscriptionId} id="subscriptionTable">
                                <Table.Cell>{sub.user.email}</Table.Cell>
                                <Table.Cell>
                                    {sub.user.firstName} {sub.user.lastName}
                                    {sub.owner.firstName !== sub.user.firstName || sub.owner.lastName !== sub.user.lastName ? 
                                        ` (${sub.owner.firstName} ${sub.owner.lastName})` : ''}
                                </Table.Cell>
                                <Table.Cell>{sub.item.name}</Table.Cell>
                                <Table.Cell>{new Date(sub.expirationDate).toLocaleDateString()}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </AdminBasePage>
    );
};

export default AdminPaidSubscriptionPage;
