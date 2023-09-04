import React, {useEffect, useState} from "react";
import {
    Form,
    Table,
    Icon,
    Grid,
    GridColumn,
    Container,
    Button,
    Modal, Dimmer, Loader, Message
} from "semantic-ui-react";
import AdminMenu from "../../../components/AdminMenu";
import {
    addFreeSub,
    deleteFreeSub,
    getAllFreeSubs,
    updateFreeSub
} from "../../../api/admin";
import FreeSubscription from "../../../entities/freeSubscription";

type MessageValues = {
    type: string,
    message: string
}

const AdminEmailSubscriptionPage: React.FC = (props): JSX.Element => {
    const [newSuffix, setNewSuffix] = useState("");
    const [updateSuffixData, setUpdateSuffix] = useState<FreeSubscription>({email_sub_id: NaN, suffix: ''});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [freeSubscriptionData, setfreeSubscriptionData] = useState<FreeSubscription[]>([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const [message, setMessage] = useState<MessageValues>({
        type:'none',
        message:''
    });

    const getEmailSubscription = () => {
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
        getEmailSubscription()
    }, []);

    const handleAdd = () => {
        setButtonLoading(true)
        addFreeSub({
            suffix: newSuffix,
        }).then(async (res) => {
            setButtonLoading(false)
            setAddModalOpen(false)
            setMessage({type:'success',message:`Free subscription with suffix "${newSuffix}" has been added successfully. All users with emails that match this suffix will be able to access all textbooks for free.`})
            getEmailSubscription()
        }).catch((err) => {
            console.log(err)
            setButtonLoading(false)
            setAddModalOpen(false)
            setMessage({type:'fail',message:`Unable to add free subscriptions for users with email suffix ${newSuffix}`})
        });
    };

    const handleCancel = () => {
        setAddModalOpen(false)
        setUpdateModalOpen(false)
        setNewSuffix('')
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
                getEmailSubscription()
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
            getEmailSubscription()
        }).catch((err) => {
            console.log(err)
            setButtonLoading(false)
            setUpdateModalOpen(false)
            setMessage({type:'fail',message:`Unable to update email subscription with suffix ${updateSuffixData.suffix}. Please try again.`})
        });
    }

    return (
        <Container className="container-fluid" fluid style={{padding: "2"}}>
            <Grid columns={2}>
                <Grid.Row>
                    <GridColumn width={3}>
                        <AdminMenu/>
                    </GridColumn>
                    <GridColumn width={12}>
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

                            <Button icon="add" labelPosition='left' primary onClick={() => setAddModalOpen(true)}>
                                <Icon name="add circle"/>Add New Free Email Subscription
                            </Button>
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <h2>Free Subscriptions by Email Suffix</h2>
                            <p>
                                User accounts with emails that match the suffixes in the table below will have free access to all textbooks.
                                The <strong>end of the user&apos;s email must match exactly with the suffix provided</strong>. 
                                For example, if the suffix &quot;<strong>tamu.edu</strong>&quot; is listed, the following users will have free access:
                            </p>
                            <ul>
                                <li>student@tamu.edu</li>
                                <li>student@email.tamu.edu</li>
                                <li>student@tamu.edu</li>
                            </ul>
                            <p>
                                The following users would <strong>NOT</strong> have free access:
                            </p>
                            <ul>
                                <li>student@tamu.email.edu</li>
                                <li>tamu.edu@gmail.com</li>
                            </ul>
                        </div>
                        <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
                            {loading == true ? <Dimmer active inverted>
                                <Loader inverted>Loading Email Subscription</Loader>
                            </Dimmer> : <div></div>
                            }
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Email Suffix</Table.HeaderCell>
                                        {/*<Table.HeaderCell>Begin Date</Table.HeaderCell>*/}
                                        {/*<Table.HeaderCell>End Date</Table.HeaderCell>*/}
                                        <Table.HeaderCell>Operation</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {freeSubscriptionData.map(sub => (
                                        <Table.Row key={sub.email_sub_id}>
                                            <Table.Cell>{sub.suffix}</Table.Cell>
                                            {/*<Table.Cell></Table.Cell>*/}
                                            {/*<Table.Cell></Table.Cell>*/}
                                            <Table.Cell>
                                                <Button ui primary basic
                                                        onClick={() => handleEditOpen(sub)}
                                                >
                                                    EDIT
                                                </Button>
                                                <Button ui negative basic loading={buttonLoading}
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
                                        onChange={(event, data) => setNewSuffix(data.value)}
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
                                    content="Save"
                                    onClick={handleEdit}
                                    positive
                                    loading={buttonLoading}
                                />
                            </Modal.Actions></Modal>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default AdminEmailSubscriptionPage;
