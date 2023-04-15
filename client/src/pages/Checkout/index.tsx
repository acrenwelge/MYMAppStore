import React, {useContext,useRef, useEffect, useState, useCallback, useReducer,Reducer} from "react";
import { Table, Container, Header, Button,Input, Icon, Item, Message , Form} from "semantic-ui-react";
import { formatter } from "../../utils";
import { ApplicationContext } from "../../context";
import { title } from "process";
import {getCurrentItem, checkPurchaseCode} from "../../api/checkout"
import PayPalButtons from "./PayPalButtons"

import {
	BrowserRouter as Router,
	Switch,
	Route,
	useLocation,
	useParams
  } from "react-router-dom"

interface Item {
    readonly item_id: number;
    name: string;
	length: number;
	price: number;
}

interface RouteParams {
	id: string
}

function updatePurchaseBtn(currentCode: string, item_id: string, totalPrice: number) {
	console.log('call update', totalPrice);
	if (totalPrice == 0) {
		return (
			<div style={{textAlign: 'left'}}>
				<button className="positive ui button" >Complete</button>
			</div>
		);
	} else {
		return (
			<div style={{textAlign: 'center'}}>
				<PayPalButtons purchaseCode={currentCode} sku={String(item_id)} amount={totalPrice} />
			</div>
		);
	}
}

const Checkout: React.FC = (props): JSX.Element => {
	const ctx = useContext(ApplicationContext);

//Then inside your component
	// const queryParams = new URLSearchParams(window.location.search)
	// //const item_id = queryParams.get("id");
	const { id } = useParams<{ id: string }>();
	console.log("get id from url");
	console.log(id);

	const item_id = id;
    const [ItemData, setItemData] = useState<Item[]>([]);

    useEffect(() => {

            getCurrentItem(item_id)
            .then(res => {
                setItemData([res.data]);
				settotalPrice(res.data.price)
            })
            .catch(error => console.error(error));
    }, []);



	//for purchase code
	const [currentCode, setcurrentCode] = useState('');
	const [totalPrice, settotalPrice] = useState(0);

	let purchaseBtn = updatePurchaseBtn(currentCode, item_id, totalPrice);

	const updateCode = (event: React.FormEvent<HTMLInputElement>) =>{
		setcurrentCode((event.target as HTMLInputElement).value)
	}
	const handleApply = () => {
		formStateDispatch({ type: "LOADING" });
		console.log("current input");
		console.log(currentCode);
		checkPurchaseCode(currentCode).then(
			async (res) => {
				const discounted = (1 - res.data.priceOff * 0.01) * ItemData[0].price;
				settotalPrice(discounted);
				purchaseBtn = updatePurchaseBtn(currentCode, item_id, totalPrice);
				formStateDispatch({ type: "SUCCESS" });
				})
		.catch((err)=>{
			//console.log("err")
			//console.log(err);
			formStateDispatch({
				type: "REQUEST_ERROR",
				payload:"Unable to apply. The account has already been created."
			})
		})
	};

	//form
	const formStateReducer = (state: FormActionState, action: FormAction): FormActionState => {
		switch (action.type) {
			case "LOADING":
				return {
					loading: (action.payload as boolean) ?? true,
					success: false,
					requestError: undefined
				};
			case "SUCCESS":
				return {
					loading: false,
					success: (action.payload as boolean) ?? true,
					requestError: undefined
				};
			case "REQUEST_ERROR":
				return {
					loading: false,
					success: false,
					requestError: (action.payload as string)
				}
			default:
				throw new Error(`Unknown action: ${action.type}`);
		}
	};

	type FormAction = {
		type: "LOADING" | "SUCCESS" | "REQUEST_ERROR";
		payload?: boolean | string;
	};

	type FormActionState = {
		loading: boolean;
		requestError?: string;
		success: boolean;
		error?:string;
	};
	const [formState, formStateDispatch] = useReducer<Reducer<FormActionState, FormAction>>(
		formStateReducer,
		{ loading: false, success: false }
	);

	//const ItemData1 = [{item_id: 1, name: 'Calculus 1(5 months)', length: 0, price: 20}]

	return (
		<Container>
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={4}>Product</Table.HeaderCell>
						<Table.HeaderCell collapsing width={2}>Length (days)</Table.HeaderCell>
						<Table.HeaderCell collapsing width={2}>Original Price (USD)</Table.HeaderCell>
						<Table.HeaderCell collapsing width={2}>Purchase Code</Table.HeaderCell>
						<Table.HeaderCell collapsing width={2}></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{ItemData.map(item => (
                                    <Table.Row key={item.item_id}>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{item.length}</Table.Cell>
                                        <Table.Cell>{item.price}</Table.Cell>
										<Table.Cell>
						<Input type="text" name = "purchasecode" onChange={updateCode} value = {currentCode}></Input>
						</Table.Cell>
						<Table.Cell>
						<button className="positive ui button" onClick={handleApply} >Apply</button>
						</Table.Cell>
                                    </Table.Row>
                                ))}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.HeaderCell colSpan={2}>
							<b>Total</b>
						</Table.HeaderCell>
						<Table.HeaderCell colSpan={2} collapsing>
							<b>{totalPrice}</b>
						</Table.HeaderCell>
						<Table.HeaderCell>

						</Table.HeaderCell>

					</Table.Row>
				</Table.Footer>
			</Table>

			<Form
				error={formState.requestError !== undefined}
				loading={formState.loading}
				success={formState.success}
			>

			<Message
					content="You have successfully applied current purchase code"
					header="SUCCESS"
					success
			/>

			<Message
					content="Current purchase code is invalid"
					header="ERROR"
					error
			/>

			</Form>

			{ctx.user === undefined ? (
				<Header as="h3">You must be signed in to complete your purchase.</Header>
			) : (
				purchaseBtn
			)}
		</Container>
	);
};

export default Checkout;
