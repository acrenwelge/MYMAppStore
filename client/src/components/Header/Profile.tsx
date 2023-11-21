import React, { useContext } from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import ApplicationContext from "../../context/application.context";

const Profile: React.FC = (): JSX.Element => {
	// eslint-disable-next-line
	const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
	const ctx = useContext(ApplicationContext);
	const history = useHistory();

	return (
		<Dropdown as={Menu.Item} item text={ctx.user!.firstName + " " + ctx.user!.lastName}>
			<Dropdown.Menu>
				<Dropdown.Item
					onClick={(event, data) => history.push({
						pathname:"/profile",
						state: { prevPath: window.location.pathname }
					})}>
					Manage Profile
				</Dropdown.Item>
				<Dropdown.Item
					onClick={(event, data) => {
						localStorage.removeItem('user');
						localStorage.removeItem('token');
						ctx.setUser!(undefined);
						history.push("/");
					}}>
					Logout
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default Profile;
