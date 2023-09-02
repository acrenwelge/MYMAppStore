import { Button } from "semantic-ui-react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import React, { useState, useEffect, useContext } from "react";
import { ApplicationContext } from "../context";
import { User } from "../entities";
import { useHistory } from "react-router-dom";

type ThirdPartyAuthenticatorsProps = {
	action: "login" | "sign-up";
};

const ThirdPartyAuthenticators: React.FC<ThirdPartyAuthenticatorsProps> = (props): JSX.Element => {
	const ctx = useContext(ApplicationContext);
	const onSuccess = (res: any) => {
		console.log("success:", res);
		const user: any = {
			id: res.profileObj.googleId,
			firstName: res.profileObj.firstName,
			lastName: res.profileObj.lastName,
			email: res.profileObj.email,
			role:res.profileObj.role
		};
		ctx.setUser!(user);
	};
	return (
		<Button
			color="red"
			content="Google"
			fluid
			icon="google"
			onClick={(event, data) =>
				window.location.replace(
					`${process.env.REACT_APP_SERVER_DOMAIN}/api/authentication/google/login`
				)
			}
			onSuccess={onSuccess}
			size="medium"
		/>
	);
};

export default ThirdPartyAuthenticators;
