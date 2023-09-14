import React, { useState,useEffect, useContext } from "react";
import {
    Container,
    Button,
    Table,
    Icon,
    Dimmer, Loader
} from "semantic-ui-react";
import { getAllProductData } from "../../api/admin";
import { Product } from "../../entities";
import ApplicationContext from "../../context/application.context";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CartItem } from "../../entities/product";

const TextbookHeader = (): JSX.Element => {
    const [productData, setproductData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const ctx = useContext(ApplicationContext);

    useEffect(() => {
        setLoading(true);
            getAllProductData()
            .then(res => {
                setproductData(res.data);
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }, []);

    const addItemToCart = (product: Product) => {
        if (ctx.cart.find(item => item.itemId === product.itemId)) {
            toast.error("Item already in cart");
            return;
        }
        // default to the product's price, no purchase code
        const cartItem: CartItem = { ...product, finalPrice: product.price, purchaseCode: undefined };
        ctx.setCart([
            ...ctx.cart,
            { ...cartItem }
        ]);
        toast.success("Item added to cart");
    }

	return (
		<Container style={{ marginTop: 10,marginBottom: 30 }}>
        <div style = {{display:'flex'}}>
            <h1>Products</h1>
            <a href="https://mymathapps.com/mymacalc-sample" style={{ marginBottom: 10, marginLeft: 'auto' }}>
            <Button color="blue">{`Sample Chapter`}</Button>
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
                        <Table.HeaderCell>Product Name</Table.HeaderCell>
                        <Table.HeaderCell>Subscription Length</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {productData.map(item => (
                        <Table.Row key={item.itemId}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.subscriptionLengthMonths} Months</Table.Cell>
                            <Table.Cell>${item.price.toFixed(2)}</Table.Cell>
                            <Table.Cell>
                                <Button color='green' animated='fade' onClick={e => addItemToCart(item)}>
                                    <Button.Content visible>Add to Cart</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='shopping bag' />
                                    </Button.Content>
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Link to="/checkout">
                <Button color="blue">
                    Checkout
                </Button>
            </Link>
        </div>
        <ToastContainer position="bottom-right" />
		</Container>
	);
};

export default TextbookHeader;