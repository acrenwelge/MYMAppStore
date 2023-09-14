import React from "react";
import { Container } from "semantic-ui-react";

const Page: React.FC<{children: React.ReactNode}> = (props): JSX.Element => (
	<Container className="page" text textAlign="left">
		{props.children}
	</Container>
);

export default Page;
