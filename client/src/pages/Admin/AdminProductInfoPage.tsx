import React, {useEffect, useState} from "react";
import {
    Table,
} from "semantic-ui-react";
import { getAllItemData } from "../../api/admin";
import AdminBasePage from "./AdminBasePage";

const AdminEditProductInfo: React.FC = (props): JSX.Element => {
    const [allProducts, setAllProducts] = useState<any[]>([]);

    const getAllProducts = () => {
        getAllItemData()
            .then(res => {
                setAllProducts(res.data)
            })
            .catch(error => {
                console.error(error)
            });
    }

    useEffect(() => {
        getAllProducts()
    }, []);

    return (
      <AdminBasePage>
        <div style={{marginTop: '10px', height: '80vh', overflowY: 'auto'}}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Product Name</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Subscription Length</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {allProducts.map(product => (
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