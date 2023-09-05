import React, { useState } from "react";
import ThirdPartyAuthenticators from "../../components/ThirdPartyAuthenticators";
import Page from "../../components/Page";
import IndividualSignUpForm from "./IndividualSignUpForm";
import { Button, Container } from "semantic-ui-react";
import InstructorClassSignUpForm from "./InstructorClassSignUpForm";

const SignUp: React.FC = (): JSX.Element => {
	// use a state variable to determine if the user is an individual or instructor
	const [isIndividual, setIsIndividual] = useState<boolean>(true);
	const componentToRender = isIndividual ? <IndividualSignUpForm  /> : <InstructorClassSignUpForm />;
		
	return (
		<Page>
			<Button.Group style={{marginBottom: "20px"}}>
				<Button color="blue" onClick={()=>setIsIndividual(true)}>Individual Sign-Up</Button>
				<Button.Or />
				<Button color="green" onClick={()=>setIsIndividual(false)}>Instructor Sign-Up</Button>
			</Button.Group>
			<Container>
				{componentToRender}
				{/* TODO: Third party authenticators? */}
				{/*<ThirdPartyAuthenticators action="sign-up" />*/}
			</Container>
		</Page>
	);
};

export default SignUp;
