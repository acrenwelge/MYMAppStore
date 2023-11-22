import React, {useEffect, useState, useReducer} from "react";
import {
    Table,
    Icon,
    Input,
    Container,
    Button,
    Loader, Dimmer, Message, Modal, Form, Dropdown
} from "semantic-ui-react";
import {addProductApi, deleteProductApi, updateProductApi, getAllProductData } from "../../api/admin";
import Product from "../../entities/product";
import AdminBasePage from "./AdminBasePage";

export type ProductFormValues = {
  name: string;
  price: number;
  subscriptionLengthMonths: number;
};

type MessageValues = {
  type: string,
  message: string
}

interface localState {
  sortBy: string;
  sortDirection: 'ascending' | 'descending' | undefined;
  filterActivated: boolean | null;
  filterRole: "admin" | "user" | "instructor" | null;
  filterText: string;
}

const AdminEditProductInfo: React.FC = (props): JSX.Element => {
    const [productData, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);


    const initFormState: ProductFormValues = {
      name: '',
      price: 0,
      subscriptionLengthMonths: 0
    }
    const [formValues, setFormValues] = useState<ProductFormValues>(initFormState);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [productEditID, setProductEditID] = useState<number>(0);
    const [message, setMessage] = useState<MessageValues>({
      type:'none',
      message:''
    });

    const refreshAllProducts = () => {
      setLoading(true);
      getAllProductData()
      .then(res => {
          console.log(res.data)
          setAllProducts(res.data)
          setLoading(false)
      })
      .catch(error => {
          console.error(error)
          setLoading(false)
      });
    }

    useEffect(() => {
      refreshAllProducts()
    }, []);

    const handleAdd = () => {
      addProductApi(formValues)
      .then((product) => {
          setAddModalOpen(false)
          setMessage({type:'success',message:`Product ${product.data.name} has been added successfully.`})
          refreshAllProducts()
      }).catch((err) => {
          console.log(err)
          setAddModalOpen(false)
          setMessage({type:'fail',message:`Error: Product ${formValues.name} not added`})
      });
    };

    const handleCancel = () => {
        setAddModalOpen(false)
        setUpdateModalOpen(false)
        setFormValues(initFormState)
        setProductEditID(0)
    }
    
    const handleDelete = (prodcut: Product) => {
        console.log(prodcut)
        deleteProductApi(prodcut.itemId)
            .then(() => {
                setMessage({type:'success',message:`Product ${prodcut.name} has been deleted successfully.`})
                refreshAllProducts();
            })
            .catch(error => {
                console.error(error)
                setMessage({type:'fail',message:`Fail to delete product ${prodcut.name}. Please try again.`})
            });
    };

    const handleEditOpen = (prodcut: Product) => {
        console.log(prodcut)
        setProductEditID(prodcut.itemId)
        setFormValues({
            ...formValues,
            name: prodcut.name,
            price: prodcut.price,
            subscriptionLengthMonths: prodcut.subscriptionLengthMonths
        })
        setUpdateModalOpen(true)
    };
    

    const handleEdit = () => {
        updateProductApi(productEditID, formValues)
        .then((res) => {
            setUpdateModalOpen(false)
            setMessage({type:'success',message:`Product ${res.data.name} has been updated successfully.`})
            refreshAllProducts()
        }).catch((err) => {
            console.log(err)
            setUpdateModalOpen(false)
            setMessage({type:'fail',message:`Failed to update product ${formValues.name}. Please try again.`})
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
    const filteredProducts = productData.filter(product => {
        if (state.filterText !== '' && !product.name.toLowerCase().includes(state.filterText.toLowerCase())) {
            return false;
        }
        return true;
    });

    let sortedProducts = filteredProducts;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
      switch (state.sortBy) {
        case 'productName':
          sortedProducts = sortedProducts.sort((a, b) => a['name'].localeCompare(b['name']));
          break;
        case 'price':
          sortedProducts = sortedProducts.sort((a, b) => {
              if (a['price'] < b['price']) return -1;
              if (a['price'] > b['price']) return 1;
              return 0;
          });
          break;
        case 'subLength':
          sortedProducts = sortedProducts.sort((a, b) => {
            if (a['subscriptionLengthMonths'] < b['subscriptionLengthMonths']) return -1;
            if (a['subscriptionLengthMonths'] > b['subscriptionLengthMonths']) return 1;
            return 0;
          });
          break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
          case 'productName':
            sortedProducts = sortedProducts.sort((b, a) => a['name'].localeCompare(b['name']));
            break;
          case 'price':
            sortedProducts = sortedProducts.sort((b, a) => {
                if (a['price'] < b['price']) return -1;
                if (a['price'] > b['price']) return 1;
                return 0;
            });
            break;
          case 'subLength':
            sortedProducts = sortedProducts.sort((b, a) => {
              if (a['subscriptionLengthMonths'] < b['subscriptionLengthMonths']) return -1;
              if (a['subscriptionLengthMonths'] > b['subscriptionLengthMonths']) return 1;
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
        <h1>Manage Products</h1>
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
                <Icon name="add circle"/>Add New Product
            </Button>
        </div>

        <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
          {loading === true ? <Dimmer active inverted>
              <Loader inverted>Loading Products</Loader>
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

          <Input label="Search by Product Name:" icon='search' placeholder='product'
              onChange={(e) => handleFilterTextChange(e)}/>
          <Table sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={state.sortBy === 'productName' ? state.sortDirection : undefined} 
                  onClick={() => handleSortChange('productName')}
                >Product Name</Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.sortBy === 'price' ? state.sortDirection : undefined} 
                  onClick={() => handleSortChange('price')}
                >Price</Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.sortBy === 'subLength' ? state.sortDirection : undefined} 
                  onClick={() => handleSortChange('subLength')}
                >Subscription Length</Table.HeaderCell>
                <Table.HeaderCell>Operation</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body id="productTable">
                {sortedProducts.map(product => (
                    <Table.Row key={product.itemId} id="productRow">
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>${product.price.toFixed(2)}</Table.Cell>
                        <Table.Cell>{product.subscriptionLengthMonths} months</Table.Cell>
                        <Table.Cell>
                            <Button primary basic id="editButton"
                                onClick={() => handleEditOpen(product)}>
                                EDIT
                            </Button>
                            <Button negative basic id="deleteButton"
                                onClick={() => handleDelete(product)}>
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
            <Modal.Header>Add New Product</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        id="name"
                        label="Name"
                        onChange={(event, data) => setFormValues({...formValues, name: data.value})}
                        required
                    />
                    <Form.Input
                        type="number"
                        id="price"
                        label="Price"
                        onChange={(event, data) => setFormValues({...formValues, price: Number(data.value)})}
                        required
                    />
                    <Form.Input
                        type="number"
                        id="subscriptionLengthMonths"
                        label="Subscription Length in Months"
                        onChange={(event, data) => setFormValues({...formValues, subscriptionLengthMonths: Number(data.value)})}
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
                    id="addButton"
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
                    label="Name"
                    value={formValues.name}
                    onChange={(event, data) => setFormValues({...formValues, name: data.value})}
                    required
                />
                <Form.Input
                    type="number"
                    id="price"
                    label="Price"
                    value={formValues.price}
                    onChange={(event, data) => setFormValues({...formValues, price: Number(data.value)})}
                    required
                />
                <Form.Input
                    type="number"
                    id="subscriptionLengthMonths"
                    label="Subscription Length in Months"
                    value={formValues.subscriptionLengthMonths}
                    onChange={(event, data) => setFormValues({...formValues, subscriptionLengthMonths: Number(data.value)})}
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
                    id="saveButton"
                    onClick={handleEdit}
                    positive
                />
            </Modal.Actions>
        </Modal>
      </AdminBasePage>
    );
};

export default AdminEditProductInfo;