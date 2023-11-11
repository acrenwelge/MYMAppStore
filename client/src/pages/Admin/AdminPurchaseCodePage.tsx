import React, {useEffect, useState, useReducer} from "react";
import {
    Table,
    Icon,
    Input,
    Container,
    Button,
    Loader, Dimmer, Message, Modal, Form, Dropdown
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

interface localState {
    sortBy: string;
    sortDirection: 'ascending' | 'descending' | undefined;
    filterActivated: boolean | null;
    filterRole: "admin" | "user" | "instructor" | null;
    filterText: string;
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

    const initlocalState: localState = {
        sortBy: '',
        sortDirection: undefined,
        filterActivated: null,
        filterRole: null,
        filterText: '',
    };
    const [state, dispatch] = useReducer(sortingReducer, initlocalState);
    const filteredCodes = purchaseCodeList.filter(code => {
        if (state.filterText !== '' && !code.name.toLowerCase().includes(state.filterText.toLowerCase())) {
            return false;
        }
        return true;
    });

    let sortedCodes = filteredCodes;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
        switch (state.sortBy) {
            case 'name':
                sortedCodes = sortedCodes.sort((a, b) => a['name'].localeCompare(b['name']));
                break;
            case 'productName':
                sortedCodes = sortedCodes.sort((a, b) => a.item['itemName'].localeCompare(b.item['itemName']));
                break;
            case 'priceOff':
                sortedCodes = sortedCodes.sort((a, b) => {
                    if (a['priceOff'] < b['priceOff']) return -1;
                    if (a['priceOff'] > b['priceOff']) return 1;
                    return 0;
                });
            break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
            case 'name':
                sortedCodes = sortedCodes.sort((b, a) => a['name'].localeCompare(b['name']));
                break;
            case 'productName':
                sortedCodes = sortedCodes.sort((b, a) => a.item['itemName'].localeCompare(b.item['itemName']));
                break;
            case 'priceOff':
                sortedCodes = sortedCodes.sort((b, a) => {
                    if (a['priceOff'] < b['priceOff']) return -1;
                    if (a['priceOff'] > b['priceOff']) return 1;
                    return 0;
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

            <div style={{ position: 'absolute', marginTop: '10px', right: 10, overflowY: 'auto' }}>
                <Button id='addNewButton' icon labelPosition='left' primary onClick={() => setAddModalOpen(true)}>
                    <Icon name="add circle"/>Add New Purchase Code
                </Button>
            </div>

            <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
                {loading == true ? <Dimmer active inverted>
                    <Loader inverted>Loading Purchase Code</Loader>
                </Dimmer> : <div></div>
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

                <Input label="Search by Code:" icon='search' placeholder='code'
                    onChange={(e) => handleFilterTextChange(e)}/> 
                <Table sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'name' ? state.sortDirection : undefined} 
                                onClick={() => handleSortChange('name')}
                            >Code</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'productName' ? state.sortDirection : undefined} 
                                onClick={() => handleSortChange('productName')}
                            >Product</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={state.sortBy === 'priceOff' ? state.sortDirection : undefined} 
                                onClick={() => handleSortChange('priceOff')}
                            >Percent Off</Table.HeaderCell>
                            <Table.HeaderCell>Operation</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body id="codeTable">
                        {sortedCodes.map(purchaseCode => (
                            <Table.Row key={purchaseCode.name} id="codeRow">
                                <Table.Cell>{purchaseCode.name}</Table.Cell>
                                <Table.Cell>{`${purchaseCode.item.itemName} - ${purchaseCode.item.itemSubscriptionLength} months`}</Table.Cell>
                                <Table.Cell>{purchaseCode.priceOff}%</Table.Cell>
                                <Table.Cell>
                                    <Button primary basic
                                        id="editButton"
                                        onClick={() => handleEditOpen(purchaseCode)}>
                                        EDIT
                                    </Button>
                                    <Button negative basic
                                        id="deleteButton"
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
                            id="product"
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
                        id = "addButton"
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
                        id="saveButton"
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
