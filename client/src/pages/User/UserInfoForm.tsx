import React, { useEffect, useState, useCallback, useContext, useReducer, Reducer } from "react";
import {Form, FormProps, Button, Message, Loader, Container} from "semantic-ui-react";
import {getProfileApi, updateInformation} from "../../api/user";
import { User } from "../../entities";
import ApplicationContext from "../../context/application.context";

type FormValues = {
	firstName: string;
	lastName: string;
	email: string;
	confirmedEmail: string;
	password: string;
	confirmedPassword: string;
};

type FormAction = {
	type: "LOADING" | "SUCCESS" | "CONFIRM_EMAIL_ERROR" | "PASSWORD_ERROR" | "CONFIRM_PASSWORD_ERROR" | "REQUEST_ERROR";
	payload?: boolean | string;
};

type FormActionState = {
	loading: boolean;
	confirmEmailError: boolean;
	passwordError: boolean;
	confirmPasswordError: boolean;
	requestError?: string;
	success: boolean;
	error?:string;
};

const formStateReducer = (state: FormActionState, action: FormAction): FormActionState => {
	switch (action.type) {
		case "CONFIRM_EMAIL_ERROR":
			return { ...state, confirmEmailError: action.payload as boolean };
		case "PASSWORD_ERROR":
			return { ...state, passwordError: action.payload as boolean };
		case "CONFIRM_PASSWORD_ERROR":
			return { ...state, confirmPasswordError: action.payload as boolean };
		case "LOADING":
			return {
				loading: (action.payload as boolean) ?? true,
				success: false,
				confirmEmailError: false,
				passwordError: false,
				confirmPasswordError: false,
				requestError: undefined
			};
		case "SUCCESS":
			return {
				loading: false,
				success: (action.payload as boolean) ?? true,
				confirmEmailError: false,
				passwordError: false,
				confirmPasswordError: false,
				requestError: undefined
			};
		case "REQUEST_ERROR":
			return {
				loading: false,
				success: false,
				confirmEmailError: false,
				passwordError: false,
				confirmPasswordError: false,
				requestError: (action.payload as string)
			}
		default:
			throw new Error(`Unknown action: ${action.type}`);
	}
};

const UserInfoForm: React.FC = (props): JSX.Element => {
	const emptyVals: FormValues = {
		firstName: "",
		lastName: "",
		email: "",
		confirmedEmail: "",
		password: "",
		confirmedPassword: ""
	};
	const [formValues, setFormValues] = useState<FormValues>(emptyVals);
	const [formState, formStateDispatch] = useReducer<Reducer<FormActionState, FormAction>>(
		formStateReducer,
		{ loading: false, success: false, confirmEmailError: false, passwordError: false, confirmPasswordError: false }
	);

	useEffect(() => {
        getProfileApi().then( return_data => {
		
			setFormValues({...formValues, email: return_data.data.email})
			// TODO: I want to get more user info and set the old values so we can display some information.
		})
    }, []);
	
	const onSubmit = useCallback(
		(data: FormProps) => {
			formStateDispatch({ type: "LOADING" });
			updateInformation({
				firstName: formValues.firstName,
				lastName: formValues.lastName,
				email: formValues.email,
				password: formValues.password
			}).then((res) => {
					
					setFormValues(emptyVals);
					formStateDispatch({ type: "SUCCESS" });
			}).catch((err) => {
					let text = ""
					if (err.response.status == 409) {
						text = "Unable to Signup. The account has already been created."
					} else if (err.response.status >= 500) {
						text = "Unable to Signup due to server error. Please try again later."
					}
					formStateDispatch({
						type: "REQUEST_ERROR",
						payload: text
					})
			});
		},
		[formStateDispatch, formValues]
	);

	return (
		<Container>
			<h1>User Information</h1>
			<h3>Email: {formValues.email}</h3>
			<Form
				hidden={formState.success}
				error={formState.requestError !== undefined}
				loading={formState.loading}
				onSubmit={(event, data) => onSubmit(data)}
				success={formState.success}
			>
				<Form.Input
					id="name"
					label="First Name"
					value={formValues.firstName }
					onChange={(event, data) => setFormValues({ ...formValues, firstName: data.value })}
				/>
				<Form.Input
					id="name"
					label="Last Name"
					value={formValues.lastName }
					onChange={(event, data) => setFormValues({ ...formValues, lastName: data.value })}
				/>
				<Form.Input
					error={
						formState.confirmPasswordError ? { content: "Password must be at least 8 characters", pointing: "below" } : false
					}
					id="password"
					label="Password"
					value={formValues.password}
					onChange={(event, data) => {
						console.log(data.value);
						formStateDispatch({
							type: "PASSWORD_ERROR",
							payload: data.value.length < 8
						});
						setFormValues({ ...formValues, password: data.value });
					}}
					type="password"	
				/>
				<Form.Input
					error={
						formState.confirmPasswordError ? { content: "Passwords do not match", pointing: "below" } : false
					}
					id="confirmPassword"
					label="Confirm Password"
					value={formValues.confirmedPassword}
					onChange={(event, data) => {
						formStateDispatch({
							type: "CONFIRM_PASSWORD_ERROR",
							payload: data.value !== formValues.password
						});
						setFormValues({ ...formValues, confirmedPassword: data.value });
					}}
					type="password"
				/>
				<Message content={formState.requestError} error header="Error" />
				<Button
					active={
						!formState.success && !formState.confirmEmailError && !formState.confirmPasswordError
					}
					color="green"
					fluid
					type="submit"
				>
					{formState.loading ? <Loader active inline="centered" /> : "Change Information"}
				</Button>
			</Form>
			<Message
					hidden={!formState.success}
					content="Your account has been successfully created. To login, first confirm your email using the link that was sent to the email address you provided."
					header="SUCCESS"
					success
				/>
		</Container>
	);
};

export default UserInfoForm;
