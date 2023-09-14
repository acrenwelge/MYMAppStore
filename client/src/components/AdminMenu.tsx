import React from "react";
import { Container, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AdminMenu: React.FC = (): JSX.Element => {
	return (
	<Container style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
		<Menu pointing vertical>
			<Menu.Item as={Link} header to="/admin/user" name="Users"/>
			<Menu.Item as={Link} header to="/admin/class" name="Classes"/>
			<Menu.Item as={Link} header to="/admin/transaction" name="Transactions"/>
			<Menu.Item as={Link} header to="/admin/products" name="Products"/>
			<Menu.Item as={Link} header to="/admin/purchase-code" name="Purchase Codes"/>
			<Menu.Item as={Link} header to="/admin/free-subscription" name="Free Subscriptions"/>
			<Menu.Item as={Link} header to="/admin/paid-subscription" name="All Paid Subscriptions"/>
		</Menu>
	</Container>
	);
};

export default AdminMenu;
