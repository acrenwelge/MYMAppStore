import React, {useEffect, useState, useReducer} from "react";
import {
    Form,
    Table,
    Icon,
    Input,
    Grid,
    GridColumn,
    Container,
    Button,
    Modal, Dimmer, Loader, Message
} from "semantic-ui-react";
import AdminMenu from "../../components/AdminMenu";
import {
    addFreeSub,
    deleteFreeSub,
    getAllFreeSubs,
    updateFreeSub
} from "../../api/admin";
import FreeSubscription from "../../entities/freeSubscription";
import AdminBasePage from "./AdminBasePage";

type MessageValues = {
    type: string,
    message: string
}

interface localState {
    sortBy: string; // 'email', 'name', 'createdAt'
    sortDirection: 'ascending' | 'descending' | undefined;
    filterActivated: boolean | null;
    filterText: string;
}

const AdminFreeSubscriptionPage: React.FC = (props): JSX.Element => {
    const [suffixData, setSuffixData] = useState('');
    const [updateSuffixData, setUpdateSuffix] = useState<FreeSubscription>({email_sub_id: NaN, suffix: ''});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [freeSubscriptionData, setfreeSubscriptionData] = useState<FreeSubscription[]>([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const initlocalState: localState = {
        sortBy: '',
        sortDirection: undefined,
        filterActivated: null,
        filterText: '',
    };
    const [message, setMessage] = useState<MessageValues>({
        type:'none',
        message:''
    });

    const [state, dispatch] = useReducer(sortingReducer, initlocalState);
    const filteredUsers = freeSubscriptionData.filter(suffix => {
        if (state.filterActivated !== null) {
            return false;
        }
        if (state.filterText !== '' && 
            !suffix.suffix.toLowerCase().includes(state.filterText.toLowerCase())) {
            return false;
        }
        return true;
    });

    let sortedFreeSubs = filteredUsers;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
        switch (state.sortBy) {
            case 'suffix':
                sortedFreeSubs = sortedFreeSubs.sort((a, b) => a['suffix'].localeCompare(b['suffix']));
                break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
            case 'suffix':
                sortedFreeSubs = sortedFreeSubs.sort((b, a) => a['suffix'].localeCompare(b['suffix']));
                break;
        }
    }

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
            case 'FILTER_TEXT':
                return {
                    ...state,
                    filterText: action.payload,
                }
          default:
            throw new Error("invalid action type")
        }
      }

    const getFreeSubscriptions = () => {
        setLoading(true)
        getAllFreeSubs()
            .then(res => {
                setfreeSubscriptionData(res.data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }
    useEffect(() => {
        getFreeSubscriptions()
    }, []);

    const handleAdd = () => {
        setButtonLoading(true)
        addFreeSub({
            suffix: suffixData,
        }).then(async (res) => {
            setButtonLoading(false)
            setAddModalOpen(false)
            setMessage({type:'success',message:`Free subscription with suffix "${suffixData}" has been added successfully. All users with emails that match this suffix will be able to access all textbooks for free.`})
            getFreeSubscriptions()
        }).catch((err) => {
            console.log(err)
            setButtonLoading(false)
            setAddModalOpen(false)
            setMessage({type:'fail',message:`Unable to add free subscriptions for users with email suffix ${suffixData}`})
        });
    };

    const handleCancel = () => {
        setAddModalOpen(false)
        setUpdateModalOpen(false)
        setSuffixData('')
        setUpdateSuffix({
            email_sub_id: NaN,
            suffix: ''
        })
    }

    const handleDelete = (sub: FreeSubscription) => {
        setButtonLoading(true)
        deleteFreeSub(sub.email_sub_id)
            .then(res => {
                setButtonLoading(false)
                getFreeSubscriptions()
                setMessage({type:'success',message:`Free subscriptions for users with suffix ${sub.suffix} have been deleted successfully. These users will no longer have free access.`})
            })
            .catch(error => {
                setButtonLoading(false)
                console.error(error)
                setMessage({type:'fail',message:`Unable to delete free subscriptions for with suffix ${sub.suffix}. Please try again.`})
            });
    };

    const handleEditOpen = (sub: FreeSubscription) => {
        setUpdateSuffix({
            ...updateSuffixData,
            email_sub_id: sub.email_sub_id,
            suffix: sub.suffix
        })
        setUpdateModalOpen(true)
    };

    const handleEdit = () => {
        setButtonLoading(true)
        updateFreeSub({
            email_sub_id: updateSuffixData.email_sub_id,
            suffix: updateSuffixData.suffix
        }).then(async (res) => {
            setButtonLoading(false)
            setUpdateModalOpen(false)
            setMessage({type:'success',message:`Free subscription with suffix ${updateSuffixData.suffix} has been updated successfully.`})
            getFreeSubscriptions()
        }).catch((err) => {
            console.log(err)
            setButtonLoading(false)
            setUpdateModalOpen(false)
            setMessage({type:'fail',message:`Unable to update email subscription with suffix ${updateSuffixData.suffix}. Please try again.`})
        });
    }

    return (
        <AdminBasePage>
            <div>
                {message.type === 'none' && (
                    <></>
                )}

                {message.type === 'success' && (
                    <Message positive>
                        <Message.Header>Success</Message.Header>
                        <p>{message.message}</p>
                    </Message>
                )}

                {message.type === 'fail' && (
                    <Message negative>
                        <Message.Header>Oops</Message.Header>
                        <p>{message.message}</p>
                    </Message>
                )}
            </div>

            <div style={{marginTop: '10px'}}>
                <h1>Free Subscriptions by Email Suffix</h1>
            </div>

            <div style={{ position: 'absolute', marginTop: '10px', right: 10, overflowY: 'auto' }}>
            <Button id='addNewButton' icon labelPosition='left' primary onClick={() => setAddModalOpen(true)}>
                <Icon name="add circle"/>Add New Free Email Subscription
            </Button>
            </div>

            <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
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
                </Container>

                <Input label="Search by Suffix:" icon='search' placeholder='domain.com'
                    onChange={(e) => handleFilterTextChange(e)}/>
                <Table sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'suffix' ? state.sortDirection : undefined}
                                onClick={() => handleSortChange('suffix')}
                            >Email Suffix</Table.HeaderCell>
                            <Table.HeaderCell>Operation</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body id="suffixTable">
                        {sortedFreeSubs.map(sub => (
                            <Table.Row key={sub.email_sub_id} id="suffixRow">
                                <Table.Cell>{sub.suffix}</Table.Cell>
                                <Table.Cell>
                                    <Button primary basic
                                            id="editButton"
                                            onClick={() => handleEditOpen(sub)}
                                    >
                                        EDIT
                                    </Button>
                                    <Button negative basic loading={buttonLoading}
                                            id="deleteButton"
                                            onClick={() => handleDelete(sub)}
                                    >
                                        DELETE
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal
                onClose={() => setAddModalOpen(false)}
                onOpen={() => setAddModalOpen(true)}
                open={addModalOpen}
            >
                <Modal.Header>Add New Free Subscription</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            id="name"
                            label="Email Suffix (eg: tamu.edu)"
                            onChange={(event, data) => setSuffixData(data.value)}
                            required
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='black'
                        onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        id="addButton"
                        content="Add"
                        onClick={handleAdd}
                        positive
                        loading={buttonLoading}
                    />
                </Modal.Actions>
            </Modal>

            <Modal
                onClose={() => setUpdateModalOpen(false)}
                onOpen={() => setUpdateModalOpen(true)}
                open={updateModalOpen}
            >
                <Modal.Header>Edit Email Subscription</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            id="name"
                            label="Email Suffix (eg:tamu.edu)"
                            value={updateSuffixData.suffix}
                            onChange={(event, data) => setUpdateSuffix({...updateSuffixData, suffix: data.value})}
                            required
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='black'
                        onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        id="saveButton"
                        content="Save"
                        onClick={handleEdit}
                        positive
                        loading={buttonLoading}
                    />
                </Modal.Actions></Modal>
        </AdminBasePage>
    );
};

export default AdminFreeSubscriptionPage;
