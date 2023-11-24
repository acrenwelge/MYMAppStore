/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useEffect, useState, useReducer, Reducer } from "react";
import ReactDOM from "react-dom"
import { Table, Container, Header, Input, Message, Form, Button } from "semantic-ui-react";
import ApplicationContext from "../context/application.context";
import { validatePurchaseCode } from "../api/checkout"
import { getUserInfoById } from "../api/user"


// @ts-ignore
const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import { capturePaypalOrder, createPaypalOrder } from "../api/payment";
import { CartDataDto, PayPalOrderDetails } from "../entities/orders";
import { CartItem } from "../entities/product";

interface localUser {
	role: number;
	userId: number;
}

interface Student {
    id: number,
    firstName: string;
    lastName: string;
    email: string;
  }

const Checkout: React.FC = (props): JSX.Element => {
	const ctx = useContext(ApplicationContext);
	const [currentCode, setCurrentCode] = useState({name: '', itemId: -1});
	const [totalPrice, setTotalPrice] = useState(-1);
	const [purchaseFinished, setPurchaseFinished] = useState(false)
	const [isInstructor, setIsInstructor] = React.useState<boolean>(true)
    const [purchaseForStudentArray, setPurchaseForStudentArray] = React.useState<Student[]>([]);

	const user: localUser = JSON.parse(localStorage.getItem('user') || 'null');

	useEffect(() => {
        checkIsInstructor();
		if (isInstructor) {
			getInstrStudentInfo()
		}
		const sum = (total: number, item: CartItem) => {
			return item.quantity ? total + (item.finalPrice * item.quantity) : total + item.finalPrice;
		}
		const total = ctx.cart.reduce(sum, 0);
		console.log("checkout, total = ", total)
		setTotalPrice(total);
		console.log("__FUNCTION__useEffect()")
		console.log("\tctx.students =", ctx.students)
	}, [ctx.cart]);

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

	const cartToData = (cart: CartItem[]): CartDataDto => {
		return {
			purchaserUserId: user.userId,
			grandTotal: totalPrice,
			items: cart,
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
	const onApprove = async (data: {orderID: string, payerId: string, paymentId: string}, actions: any) => {
		console.log("onApprove - payment being authorized", data);
		const user = JSON.parse(localStorage.getItem('user') ?? 'null')
		const isInstructor = (user.role.toLowerCase() === 'instructor')
		console.log(user)
		const recipIds = isInstructor && ctx.students.length > 0 ? ctx.students : [user.userId]

		const orderObj: PayPalOrderDetails = {
			orderId: data.orderID,
			cart: cartToData(ctx.cart),
			recipientIds: recipIds
		}
		return capturePaypalOrder(orderObj)
			.then((res) => {
				ctx.setCart([]);
				setPurchaseFinished(true);
				console.log("Capture result:", res.data);
				//@ts-ignore
				const checkboxes = localStorage.getItem("selected_students") == null ? {} : JSON.parse(localStorage.getItem("selected_students"))
				for (const key in checkboxes) {
					checkboxes[key] = false
				}
				localStorage.setItem("selected_students", JSON.stringify(checkboxes))
				ctx.setStudents([])
				localStorage.setItem("sel_student_array", JSON.stringify([]))
			}).catch((err) => {
				console.error(err);
				// Two cases to handle:
				// (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
				// (2) Other non-recoverable errors -> Show a failure message
				const errorDetail = err?.details?.[0];
				if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
					// recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
					return actions.restart();
				} else if (errorDetail) {
					throw new Error(`${errorDetail.description} (${err?.debug_id})`);
				} else if (!err?.purchase_units) {
					formStateDispatch({
						type: "REQUEST_ERROR",
						payload: "There was a problem processing your payment"
					})
				}
			});
	};

	const updatePurchaseCode = (name: string, itemId: number) => {
		setCurrentCode({name, itemId});
	}

	const applyPurchaseCode = () => {
		formStateDispatch({ type: "LOADING" });
		validatePurchaseCode(currentCode)
			.then((res) => {
				// set the purchase code and final price of the item in the cart
				ctx.setCart(ctx.cart.map((item) => {
					if (item.itemId === res.data.item.itemId) {
						item.finalPrice = res.data.priceOff;
						item.purchaseCode = currentCode.name;
					}
					return item;
				}));
				formStateDispatch({ type: "SUCCESS" });
			})
			.catch((err) => {
				formStateDispatch({
					type: "REQUEST_ERROR",
					payload: "Unable to apply. Please check the code and try again."
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
			<>
			{isInstructor && purchaseForStudentArray.length > 0 && (
				<Container style={{ marginTop: 10, marginBottom: 30 }}>
				<><div id='student-info' style={{ display: 'flex' }}>
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
										<Table.Row id={"studentId_"+user.id} key={"studentId_" + user.id}>
											<Table.Cell>{user.firstName}</Table.Cell>
											<Table.Cell>{user.lastName}</Table.Cell>
											<Table.Cell>{user.email}</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						</div>
					</>
					</Container>)}
			<Container>
					<h1>Cart</h1>
					<Table id="cart-table">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell width={4}>Product</Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}>Quantity</Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}>Subscription Length</Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}>Original Price (USD)</Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}>Final Price (USD)</Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}>Purchase Code</Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}></Table.HeaderCell>
								<Table.HeaderCell collapsing width={2}></Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{ctx.cart.map(item => (
								<Table.Row key={item.itemId}>
									<Table.Cell>{item.name}</Table.Cell>
									<Table.Cell id={item.itemId+"_quantity"}>{item.quantity}</Table.Cell>
									<Table.Cell>{item.subscriptionLengthMonths} months</Table.Cell>
									<Table.Cell style={item.finalPrice !== item.price ? { "text-decoration": "line-through" } : null}>
										${item.price.toFixed(2)}
									</Table.Cell>
									<Table.Cell>${item.finalPrice.toFixed(2)}</Table.Cell>
									<Table.Cell>
										<Input type="text" name="purchasecode" id="purchasecode"
											disabled={item.purchaseCode !== undefined}
											onChange={e => updatePurchaseCode(e.target.value, item.itemId)} value={currentCode.name}></Input>
									</Table.Cell>
									<Table.Cell>
										<Button positive size="small"
											disabled={item.purchaseCode !== undefined}
											onClick={applyPurchaseCode}>Apply</Button>
									</Table.Cell>
									<Table.Cell>
										<Button negative size="small"
											onClick={() => removeItemFromCart(item.itemId)}>Remove Item</Button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
						<Table.Footer>
							<Table.Row>
								<Table.HeaderCell colSpan={2}>
									<b>Total</b>
								</Table.HeaderCell>
								<Table.HeaderCell></Table.HeaderCell>
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
							error />
					</Form>

					{ctx.user === undefined ? (
						<Header as="h3">You must be signed in to complete your purchase.</Header>
					) : null}

					{ctx.user != undefined && totalPrice != 0 ? (
						<div>
							<script defer src="https://www.paypal.com/sdk/js?client-id=AWuJ4TbTs8TF4PCyNsC3nZo-gJNpUTvebNbns0AvJWuAirsC3BRoTs4lW4_okNlpb0OQNtSZmada8Qtm&currency=USD"></script>
							<PayPalButton id='paypal-button'
								createOrder={(data: any, actions: any) => createOrder(data, actions)}
								onApprove={(data: any, actions: any) => onApprove(data, actions)} />
						</div>
					) : null}

				</Container></>
		);
	}

};

export default Checkout;
