/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState,useEffect, useContext } from "react";
import {
    Container,
    Button,
    Table,
    Icon,
    Dimmer, Loader
} from "semantic-ui-react";
import { getAllProductData } from "../../api/admin";
import { getUserInfoById } from "../../api/user"
import { Product } from "../../entities";
import { User } from "../../entities";

import ApplicationContext from "../../context/application.context";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CartItem } from "../../entities/product";

interface Student {
    id: number,
    firstName: string;
    lastName: string;
    email: string;
  }

const TextbookHeader = (): JSX.Element => {
    const [productData, setproductData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isInstructor, setIsInstructor] = React.useState<boolean>(true)
    const [purchaseForStudentArray, setPurchaseForStudentArray] = React.useState<Student[]>([]);
    const ctx = useContext(ApplicationContext);

    useEffect(() => {
        checkIsInstructor();
        setLoading(true);
            if (isInstructor) {
                getInstrStudentInfo()
            }
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

    const checkIsInstructor = () => {
        const user = JSON.parse(localStorage.getItem('user') ?? 'null')
        setIsInstructor(user.role.toLowerCase() === 'instructor')
      }

    const pruneStudentData = (user:any):Student => {
        console.log("\tuser = ", user)
        return {
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    }

    const getInstrStudentInfo = () => {
        (async function () {
            // @ts-ignore
            const stuArray = localStorage.getItem("sel_student_array") == null ? [] : JSON.parse(localStorage.getItem("sel_student_array"))
            ctx.setStudents(stuArray)
            
            return await Promise.all(stuArray.map((id:number) => getUserInfoById(id)))
        })()
        .then(res => {
            const stuInfo: Student[] = res.map(userPromise => pruneStudentData(userPromise.data))
            setPurchaseForStudentArray(stuInfo)
        })
        .catch(error => {
            console.log("Error in getting student info:", error)
        })
    }

    const addItemToCart = (product: Product) => {
        if (ctx.cart.find(item => item.itemId === product.itemId)) {
            toast.error("Item already in cart");
            return;
        }
        // default to the product's price, no purchase code
        let quantity = 1
        const user = JSON.parse(localStorage.getItem('user') ?? 'null')
        if (user.role.toLowerCase() === 'instructor' && ctx.students.length > 0) {
            quantity = ctx.students.length
        }
        const cartItem: CartItem = { 
            ...product, 
            finalPrice: product.price, 
            quantity: quantity,
            purchaseCode: undefined };
            
        ctx.setCart([
            ...ctx.cart,
            { ...cartItem }
        ]);
        toast.success("Item added to cart");
    }

	return (
		<Container style={{ marginTop: 10,marginBottom: 30 }}>
        {isInstructor && purchaseForStudentArray.length > 0 && (
            <><div style={{ display: 'flex' }}>
                <h1>Purchasing for Following Students</h1>
            </div>
            <div>
                <Table>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>First Name</Table.HeaderCell>
                        <Table.HeaderCell>Last Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {purchaseForStudentArray.map(user => (
                            <Table.Row key={"studentId_"+user.id}>
                                <Table.Cell>{user.firstName}</Table.Cell>
                                <Table.Cell>{user.lastName}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            </>
        )}
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
                                <Button id={"add-to-cart-"+item.itemId} color='green' animated='fade' onClick={e => addItemToCart(item)}>
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