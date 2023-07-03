import React, { useState,useEffect } from "react";
import {
    Container,
    Button,
    Table,
    Item,
    Icon,
    Dimmer, Loader
} from "semantic-ui-react";
import { getAllItemData } from "../api/admin";
import {Link} from 'react-router-dom';

interface Item {
    readonly id: number;
    name: string;
	length: number;
	price: number;
}

const TextbookHeader = (): JSX.Element => {
    const [ItemData, setItemData] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
            getAllItemData()
            .then(res => {
                setItemData(res.data);
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }, []);

	return (
		<Container style={{ marginTop: 10,marginBottom: 30 }}>
        <div style = {{display:'flex'}}>
            <h1>Products</h1>
            <a href = "https://mymathapps.com/mymacalc-sample" style={{ marginBottom: 10, marginLeft: 'auto' }}>
            <Button color="blue"  >{`Sample Chapter`}</Button>
            </a>
        </div>
           <div>
               <Table fixed>
                   <Table.Header>
                       {loading==true?<Dimmer active inverted>
                           <Loader inverted>Loading Products</Loader>
                       </Dimmer>:<></>
                       }
                       <Table.Row>
                           <Table.HeaderCell>Book Name</Table.HeaderCell>
                           <Table.HeaderCell>Length</Table.HeaderCell>
                           <Table.HeaderCell>Price</Table.HeaderCell>
                           <Table.HeaderCell></Table.HeaderCell>
                       </Table.Row>
                   </Table.Header>
                   <Table.Body>
                       {ItemData.map(Item => (
                           <Table.Row key={Item.id}>
                               <Table.Cell>{Item.name}</Table.Cell>
                               <Table.Cell>{Item.length} Months</Table.Cell>
                               <Table.Cell>${Item.price.toFixed(2)}</Table.Cell>
                               <Table.Cell>
                                   <Link to={{
                                       pathname: `/checkout/${Item.id}`,
                                   }}>   <Button  color='green' animated='fade'>
                                       <Button.Content visible>Purchase</Button.Content>
                                       <Button.Content hidden>
                                           <Icon name='shopping bag' />
                                       </Button.Content>
                                   </Button>
                                   </Link>
                               </Table.Cell>
                           </Table.Row>
                       ))}
                   </Table.Body>
               </Table>
           </div>
		</Container>
	);
};

export default TextbookHeader;