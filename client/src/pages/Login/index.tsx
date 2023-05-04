import React from "react";
import ThirdPartyAuthenticators from "../../components/ThirdPartyAuthenticators";
import Page from "../../components/Page";
import LocalLoginForm from "./LocalLoginForm";
import { Icon, Label, Segment,Header } from 'semantic-ui-react'
import LoginHeader from "./LoginHeader";

const Login: React.FC = (): JSX.Element => {
	return (
		<Page>

			<LocalLoginForm />
			{/*<ThirdPartyAuthenticators action="login" />*/}
			{/*<LoginHeader />*/}
		</Page>


	);
};

export default Login;
