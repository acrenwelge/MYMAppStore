import React, {useEffect, useState} from "react";
import {
    Form,
    Table,
    Icon,
    Button,
    Modal, Dimmer, Loader, Message, Dropdown
} from "semantic-ui-react";
import {addPurchaseCodeApi, deleteCodeApi, getAllProductData, getAllPurchaseCodeData, updateCodeApi} from "../../api/admin";
import AdminBasePage from "./AdminBasePage";
import PurchaseCode from "../../entities/purchaseCode";
import { Product } from "../../entities";

export type PurchaseCodeFormValues = {
    name: string;
    priceOff: number;
    itemId: number;
};

type MessageValues = {
    type: string,
    message: string
}

interface ProductSelection {
    key: number;
    text: string;
    value: number;
}

const AdminPurchaseCodePage: React.FC = (props): JSX.Element => {

    const initFormState: PurchaseCodeFormValues = {
        name: '',
        priceOff: 0,
        itemId: 0
    }

    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<PurchaseCodeFormValues>(initFormState);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [purchaseCodeList, setPurchaseCodeList] = useState<PurchaseCode[]>([]);
    const [purchaseCodeEditName, setPurchaseCodeEditName] = useState<string>('');
    const [products, setProducts] = useState<ProductSelection[]>([]);

    const [message, setMessage] = useState<MessageValues>({
        type:'none',
        message:''
    });

    const loadPurchaseCodes = () => {
        setLoading(true)
        getAllPurchaseCodeData()
            .then(res => {
                console.log(res.data)
                setPurchaseCodeList(res.data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }

    const loadProducts = () => {
        setLoading(true)
        getAllProductData()
            .then(axiosResponse => {
                setProducts(axiosResponse.data.map((product: Product) => {
                    return {
                        key: product.itemId,
                        value: product.itemId,
                        text: `${product.name} - ${product.subscriptionLengthMonths} months`,
                    }
                }))
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }

    useEffect(() => {
        loadPurchaseCodes()
        loadProducts()
    }, []);

    const handleAdd = () => {
        addPurchaseCodeApi(formValues)
        .then((purchaseCode) => {
            setAddModalOpen(false)
            setMessage({type:'success',message:`Purchase code ${purchaseCode.data.name} has been added successfully.`})
            loadPurchaseCodes()
        }).catch((err) => {
            console.log(err)
            setAddModalOpen(false)
            setMessage({type:'fail',message:`Error: Purchase code ${formValues.name} not added`})
        });
    };

    const handleCancel = () => {
        setAddModalOpen(false)
        setUpdateModalOpen(false)
        setFormValues(initFormState)
        setPurchaseCodeEditName('')
    }

    const handleDelete = (code: PurchaseCode) => {
        console.log(code)
        deleteCodeApi(code.name)
            .then(() => {
                loadPurchaseCodes()
                setMessage({type:'success',message:`Purchase code ${code.name} has been deleted successfully.`})
            })
            .catch(error => {
                console.error(error)
                setMessage({type:'fail',message:`Fail to delete purchase code ${code.name}. Please try again.`})
            });
    };

    const handleEditOpen = (code: PurchaseCode) => {
        console.log(code)
        setPurchaseCodeEditName(code.name)
        setFormValues({
            ...formValues,
            name: code.name,
            priceOff: code.priceOff,
            itemId: code.item.itemId
        })
        setUpdateModalOpen(true)
    };

    const handleEdit = () => {
        updateCodeApi(purchaseCodeEditName,formValues)
        .then((res) => {
            setUpdateModalOpen(false)
            setMessage({type:'success',message:`Purchase code ${res.data.name} has been updated successfully.`})
            loadPurchaseCodes()
        }).catch((err) => {
            console.log(err)
            setUpdateModalOpen(false)
            setMessage({type:'fail',message:`Failed to update purchase code ${formValues.name}. Please try again.`})
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

                <Button icon labelPosition='left' primary onClick={() => setAddModalOpen(true)}>
                    <Icon name="add circle"/>Add New Purchase Code
                </Button>
            </div>

            <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
                {loading == true ? <Dimmer active inverted>
                    <Loader inverted>Loading Purchase Code</Loader>
                </Dimmer> : <div></div>
                }
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Code</Table.HeaderCell>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Percent Off</Table.HeaderCell>
                            <Table.HeaderCell>Operation</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {purchaseCodeList.map(purchaseCode => (
                            <Table.Row key={purchaseCode.name}>
                                <Table.Cell>{purchaseCode.name}</Table.Cell>
                                <Table.Cell>{`${purchaseCode.item.itemName} - ${purchaseCode.item.itemSubscriptionLength} months`}</Table.Cell>
                                <Table.Cell>{purchaseCode.priceOff}</Table.Cell>
                                <Table.Cell>
                                    <Button primary basic
                                        onClick={() => handleEditOpen(purchaseCode)}>
                                        EDIT
                                    </Button>
                                    <Button negative basic
                                        onClick={() => handleDelete(purchaseCode)}>
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
                <Modal.Header>Add New Purchase Code</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Dropdown
                            placeholder='Select Item'
                            fluid
                            selection
                            onChange={(event, data) => setFormValues({...formValues, itemId: Number(data.value)})}
                            options={products}
                        />
                        <Form.Input
                            id="name"
                            label="Code"
                            onChange={(event, data) => setFormValues({...formValues, name: data.value})}
                            required
                        />
                        <Form.Input
                            type="number"
                            id="priceOff"
                            label="Percent Off (0-100)"
                            onChange={(event, data) => setFormValues({...formValues, priceOff: Number(data.value)})}
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
                    />
                </Modal.Actions>
            </Modal>

            <Modal
                onClose={() => setUpdateModalOpen(false)}
                onOpen={() => setUpdateModalOpen(true)}
                open={updateModalOpen}
            >
                <Modal.Header>Edit Purchase Code</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            id="name"
                            label="Code"
                            value={formValues.name}
                            onChange={(event, data) => setFormValues({...formValues, name: data.value})}
                            required
                        />
                        <Form.Input
                            type="number"
                            id="priceOff"
                            label="Percent Off (0-100)"
                            value={formValues.priceOff}
                            onChange={(event, data) => setFormValues({...formValues, priceOff: Number(data.value)})}
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
                    />
                </Modal.Actions>
            </Modal>
        </AdminBasePage>
    );
};

export default AdminPurchaseCodePage;
