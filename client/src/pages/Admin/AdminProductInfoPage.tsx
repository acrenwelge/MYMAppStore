import React, {useEffect, useState, useReducer} from "react";
import {
    Table,
    Input,
    Container,
    Loader, Dimmer
} from "semantic-ui-react";
import { getAllProductData } from "../../api/admin";
import Product from "../../entities/product";
import AdminBasePage from "./AdminBasePage";

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

    return (
      <AdminBasePage>
        <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
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

          <Input label="Search by Product Name:" icon='search' placeholder='email@domain.com'
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
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedProducts.map(product => (
                    <Table.Row key={product.itemId}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.price}</Table.Cell>
                        <Table.Cell>{product.subscriptionLengthMonths} months</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </AdminBasePage>
    );
};

export default AdminEditProductInfo;