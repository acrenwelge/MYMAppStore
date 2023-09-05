import React, {useEffect, useState} from "react";
import {
    Form,
    Table,
    Icon,
    Button,
    Modal, Dimmer, Loader, Message, Dropdown
} from "semantic-ui-react";
import {addCodeApi, deleteCodeApi, getAllPurchaseCodeData, updateCodeApi} from "../../api/admin";
import AdminBasePage from "./AdminBasePage";

interface PurchaseCode {
    readonly codeId: number;
    name: string;
    priceOff: number;
    item: {
        readonly itemId: number;
        itemName: string;
    }
}

export type PurchaseCodeFormValues = {
    code_id: number | null,
    name: string | null;
    priceOff: number | null;
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

    const [formValues, setFormValues] = useState<PurchaseCodeFormValues>({
        code_id: null,
        name: null,
        priceOff: null
    });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [purchaseData, setPurchaseCodeData] = useState<PurchaseCode[]>([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [products, setProducts] = useState<ProductSelection[]>([{
            key: 1,
            value: 1,
            text: 'Calc 1',
        }, {
            key: 2,
            value: 2,
            text: 'Calc 2',
        }
    ]);
    const [selectedProduct, setSelectedProduct] = useState<number>(1);

    const [message, setMessage] = useState<MessageValues>({
        type:'none',
        message:''
    });

    const getPurchaseCode = () => {
        setLoading(true)
        getAllPurchaseCodeData()
            .then(res => {
                setPurchaseCodeData(res.data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }
    useEffect(() => {
        getPurchaseCode()
    }, []);

    const handleAdd = () => {
        setButtonLoading(true)
        const itemId = products.find((product) => product.value === selectedProduct)?.value
        addCodeApi({
            name: formValues.name,
            item: {
                itemId
            },
            priceOff: Number(formValues.priceOff)
        }).then(async (res) => {
            const purchaseCode = res.data.purchaseCode
            localStorage.setItem('purchaseCode', JSON.stringify(purchaseCode));
            setButtonLoading(false)
            setAddModalOpen(false)
            setMessage({type:'success',message:`Purchase code ${formValues.name} has been added successfully.`})
            getPurchaseCode()
        }).catch((err) => {
            console.log(err)
            setButtonLoading(false)
            setAddModalOpen(false)
            setMessage({type:'fail',message:`Error: Purchase code ${formValues.name} not added`})
        });
    };

    const handleCancel = () => {
        setAddModalOpen(false)
        setUpdateModalOpen(false)
        setFormValues({code_id: null, name: null, priceOff: null})
    }

    const handleDelete = (code: PurchaseCode) => {
        console.log(code)
        setButtonLoading(true)
        deleteCodeApi(code.codeId)
            .then(res => {
                setButtonLoading(false)
                getPurchaseCode()
                setMessage({type:'success',message:`Purchase code ${code.name} has been deleted successfully.`})
            })
            .catch(error => {
                setButtonLoading(false)
                console.error(error)
                setMessage({type:'fail',message:`Fail to delete purchase code ${code.name}. Please try again.`})
            });
    };

    const handleEditOpen = (code: PurchaseCode) => {
        console.log(code)
        setFormValues({
            ...formValues,
            code_id: code.codeId,
            name: code.name,
            priceOff: code.priceOff
        })
        setUpdateModalOpen(true)
    };

    const handleEdit = () => {
        setButtonLoading(true)
        updateCodeApi({
            code_id: formValues.code_id,
            name: formValues.name,
            priceOff: Number(formValues.priceOff)
        }).then(async (res) => {
            const purchaseCode = res.data.name
            localStorage.setItem('purchaseCode', JSON.stringify(purchaseCode));
            setButtonLoading(false)
            setUpdateModalOpen(false)
            setMessage({type:'success',message:`Purchase code ${formValues.name} has been updated successfully.`})
            getPurchaseCode()
        }).catch((err) => {
            console.log(err)
            setButtonLoading(false)
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
                        {purchaseData.map(purchaseCode => (
                            <Table.Row key={purchaseCode.codeId}>
                                <Table.Cell>{purchaseCode.name}</Table.Cell>
                                <Table.Cell>{purchaseCode.item.itemName}</Table.Cell>
                                <Table.Cell>{purchaseCode.priceOff}</Table.Cell>
                                <Table.Cell>
                                    <Button primary basic
                                        onClick={() => handleEditOpen(purchaseCode)}>
                                        EDIT
                                    </Button>
                                    <Button negative basic loading={buttonLoading}
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
                            onChange={(event, data) => setSelectedProduct(Number(data.value))}
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
                        loading={buttonLoading}
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
                        loading={buttonLoading}
                    />
                </Modal.Actions>
            </Modal>
        </AdminBasePage>
    );
};

export default AdminPurchaseCodePage;
