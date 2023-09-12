/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useEffect, useState, useReducer, Reducer } from "react";
import ReactDOM from "react-dom"
import { Table, Container, Header, Input, Item, Message, Form, Button } from "semantic-ui-react";
import { ApplicationContext } from "../context";
import { getCurrentItem, checkPurchaseCode, addSubscription, addTransaction } from "../api/checkout"

// @ts-ignore
const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import { capturePaypalOrder, createPaypalOrder, finishPurchasing } from "../api/payment";
import { Product } from "../entities";
import { CartDataDto, PayPalOrderDetails } from "../entities/orders";

interface localUser {
	role: number;
	id: number;
}

const Checkout: React.FC = (props): JSX.Element => {
	const ctx = useContext(ApplicationContext);
	//for purchase code
	const [currentCode, setCurrentCode] = useState('');
	const [totalPrice, setTotalPrice] = useState(-1);
	const [purchaseFinished, setPurchaseFinished] = useState(false)

	const user: localUser = JSON.parse(localStorage.getItem('user') || 'null');

	useEffect(() => {
		const total = ctx.cart.reduce((total, item) => total + item.price, 0);
		setTotalPrice(total);
	}, [ctx.cart]);

	const cartToData = (cart: Product[]) => {
		return {
			purchaserUserId: user.id,
			grandTotal: totalPrice,
			items: cart.map((product) => {
				return {
					itemId: product.itemId,
					quantity: 1,
					purchaseCode: null,
				}
			})
		}
	}

	// Sets up the transaction when a payment button is clicked
	const createOrder = async (data: {paymentSource: string}, actions: any): Promise<number | void> => {
		console.log("createOrder - data:", data);
		console.log("createOrder - actions:", actions);
		const cartData: CartDataDto = cartToData(ctx.cart)
		console.log("cartData:", cartData);
		return await createPaypalOrder(cartData)
			.then((res) => {
				console.log("success - res=", res.data);
				return res.data.id
			})
			.catch((err) => {
				console.error(err);
			});
	};

	// Finalize the transaction after payer approval
	const onApprove = async (data: {orderID: string, payerId: string, paymentId: string}) => {
		console.log("onApprove - payment being authorized", data);
		const orderObj: PayPalOrderDetails = {
			orderId: data.orderID,
			cart: cartToData(ctx.cart),
		}
		return capturePaypalOrder(orderObj)
			.then((res) => {
				ctx.setCart([]);
				setPurchaseFinished(true);
				console.log("Capture result:", res.data);
			}).catch((err) => {
				console.error(err);
				formStateDispatch({
					type: "REQUEST_ERROR",
					payload: "There was a problem processing your payment"
				})
			});
	};

	const updatePurchaseCode = (event: React.FormEvent<HTMLInputElement>) => {
		setCurrentCode((event.target as HTMLInputElement).value)
	}

	const applyPurchaseCode = () => {
		formStateDispatch({ type: "LOADING" });
		checkPurchaseCode(currentCode).then(
			async (res) => {
				const discounted = (1 - res.data.priceOff.priceOff * 0.01) * ctx.cart[0].price;
				setTotalPrice(discounted);
				formStateDispatch({ type: "SUCCESS" });
			})
			.catch((err) => {
				formStateDispatch({
					type: "REQUEST_ERROR",
					payload: "Unable to apply. The account has already been created."
				})
			})
	};

	const removeItemFromCart = (itemId: number) => {
		const newCart = ctx.cart.filter((item) => item.itemId !== itemId);
		ctx.setCart(newCart);
	};

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
		error?: string;
	};

	const [formState, formStateDispatch] = useReducer<Reducer<FormActionState, FormAction>>(
		formStateReducer,
		{ loading: false, success: false }
	);

	if (purchaseFinished) {
		return (
			<Container>
				<Message icon='smile outline' size='huge' success header='Congratulations' 
					content='You have successfully completed your purchase. Click the "Read Book" at the top to start reading.'>
				</Message>
			</Container>
		)
	} else {
		return (
			<Container>
				<h1>Cart</h1>
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell width={4}>Product</Table.HeaderCell>
							<Table.HeaderCell collapsing width={2}>Subscription Length</Table.HeaderCell>
							<Table.HeaderCell collapsing width={2}>Original Price (USD)</Table.HeaderCell>
							<Table.HeaderCell collapsing width={2}>Purchase Code</Table.HeaderCell>
							<Table.HeaderCell collapsing width={2}></Table.HeaderCell>
							<Table.HeaderCell collapsing width={2}></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{ctx.cart.map(item => (
							<Table.Row key={item.itemId}>
								<Table.Cell>{item.name}</Table.Cell>
								<Table.Cell>{item.subscriptionLengthMonths} months</Table.Cell>
								<Table.Cell>${item.price.toFixed(2)}</Table.Cell>
								<Table.Cell>
									<Input type="text" name="purchasecode" id="purchasecode" onChange={updatePurchaseCode} value={currentCode}></Input>
								</Table.Cell>
								<Table.Cell>
									<Button positive size="small"
										onClick={applyPurchaseCode}>Apply</Button>
								</Table.Cell>
								<Table.Cell>
									<Button negative size="small"
										onClick={(e) => removeItemFromCart(item.itemId)}>Remove Item</Button>
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
								<b>${totalPrice.toFixed(2)}</b>
							</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
				<Form
					error={formState.requestError !== undefined}
					loading={formState.loading}
					success={formState.success}
				>
					<Message
						content={formState.requestError}
						header="ERROR"
						error
					/>
				</Form>

				{ctx.user === undefined ? (
					<Header as="h3">You must be signed in to complete your purchase.</Header>
				) : null}

				{ctx.user != undefined && totalPrice != 0 ? (
					<div>
						<script defer src="https://www.paypal.com/sdk/js?client-id=AWuJ4TbTs8TF4PCyNsC3nZo-gJNpUTvebNbns0AvJWuAirsC3BRoTs4lW4_okNlpb0OQNtSZmada8Qtm&currency=USD"></script>
						<PayPalButton
							createOrder={(data: any, actions: any) => createOrder(data, actions)}
							onApprove={(data: any, actions: any) => onApprove(data)}
						/>
					</div>
				) : null}

			</Container>
		);
	}

};

export default Checkout;
