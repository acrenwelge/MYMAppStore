import React, { useEffect, useContext } from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ApplicationContext from "../../context/application.context";
import Cart from "./Cart";
import Profile from "./Profile";
import LoginSignUp from "./LoginSignUp";
import { getUserSubscriptions } from "../../api/user";
import { Subscription } from "../../entities";

function renderSwitch(param: string) {
	switch(param) {
		case 'Calculus':
			return <Dropdown className="link item" pointing="left" text="Calculus">
						<Dropdown.Menu>
							<Dropdown.Item as={Link} to="/read">
								{"Calculus 1"}
							</Dropdown.Item>
							<Dropdown.Item as={Link} to="/read">
								{"Calculus 2"}
							</Dropdown.Item>
							<Dropdown.Item as={Link} to="/read">
								{"Calculus 3"}
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>;
		default:
			return <Dropdown.Item as={Link} to="/read">
						{param}
					</Dropdown.Item>
	}
  }

const NavMenu: React.FC = (): JSX.Element => {
	const ctx = useContext(ApplicationContext);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(false);

	if (ctx.user) {
		useEffect(() => {
			setLoading(true);
			getUserSubscriptions()
				.then(res => {
					// conversion from string to date must be done manually
					setSubscriptions(res.data.map((sub: Subscription) => {
						sub.expirationDate = new Date(sub.expirationDate); 
						return sub
					}));
					setLoading(false)
				})
				.catch(error => {
					console.error(error)
					setLoading(false)
				});
		}, []);
	} else {
		useEffect(() => {
			setLoading(true);
		})
	}


	return (
		<nav>
			<Menu>
				<Menu.Item as={Link} header to="/">
					{"MYMathApps"}
				</Menu.Item>
				<Dropdown item text="Products">
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/products">
							{"Product Pricing"}
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown className="link item" pointing="left" text="Calculus">
							<Dropdown.Menu>
								<Dropdown.Item as={Link} to="/products/MYMACalc1">
									{"Calculus 1"}
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/products/MYMACalc2">
									{"Calculus 2"}
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/products/MYMACalc3">
									{"Calculus 3"}
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Dropdown.Item as={Link} to="/products/m4c">
							{"Maplets for Calculus"}
						</Dropdown.Item>

						<Dropdown.Item as={Link} to="/products/finance-with-maple">
							{"Finance with Maple"}
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Menu.Item as={Link} to="/about">
					{"About Us"}
				</Menu.Item>
				{/*<Menu.Item as={Link} to="/contact">*/}
				{/*	{"Contact"}*/}
				{/*</Menu.Item>*/}
				{
					ctx.user && (
						<Dropdown item text="Read Book">
						<Dropdown.Menu> {
								subscriptions.map((subscription) => 
									renderSwitch(subscription.item.name)
								)
							}
						</Dropdown.Menu>
					</Dropdown>
					)
				}

				<Menu.Item fitted position="right">
					{ctx.user ? <Menu.Item as={Link} to="/subscriptions">My Subscriptions</Menu.Item> : null}
					{ctx.user?.role === "admin" ?
						<Menu.Item as={Link} to="/admin/user">Admin</Menu.Item> : null}
					{ctx.user?.role === "instructor" ?
						<Menu.Item as={Link} to="/instructor/class">Manage Class</Menu.Item>: null}
					<Cart />
					{ctx.user ? <Profile /> : <LoginSignUp />}
				</Menu.Item>
			</Menu>
		</nav>
	);
};

export default NavMenu;
