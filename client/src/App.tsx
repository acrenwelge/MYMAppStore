import React, { useState, useEffect, useContext } from "react";
import ProtectedRoute, { ProtectedRouteProps } from "./components/ProtectedRoute";
import { useCookies } from "react-cookie";
import { SWRConfig } from "swr";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MYMACalc1 from "./pages/MYMACalc1";
import MYMACalc3 from "./pages/MYMACalc3";
import MYMACalc2 from "./pages/MYMACalc2";
import FinancePreview from "./pages/FinancePreview";
import Checkout from "./pages/CheckoutPage";
import User from "./entities/user";
import { CartItem } from "./entities/product";
import Home from "./pages/Home";
import AccountActivation from "./pages/AccountActivation";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp/SignUpPage";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import ReadBook from "./pages/Book/index";
import AdminUserInfoPage from "./pages/Admin/AdminUserInfoPage";
import AdminPurchaseCode from "./pages/Admin/AdminPurchaseCodePage";
import UserSubscriptionPage from "./pages/UserSubscriptionPage";
import ProductsPage from "./pages/Products/ProductsPage";
import AdminTransactionPage from "./pages/Admin/AdminTransactionPage"
import AdminFreeSubscriptionPage from "./pages/Admin/AdminFreeSubscriptionPage";
import InstructorManageClassPage from "./pages/Instructor/InstructorManageClassPage";
import AdminPaidSubscriptionPage from "./pages/Admin/AdminPaidSubscriptionPage";
import AdminEditProductInfo from "./pages/Admin/AdminProductInfoPage";
import AdminManageClassesPage from "./pages/Admin/AdminManageClassesPage";
import ApplicationContext from "./context/application.context";
import NavMenu from "./components/Header/NavMenu";
import { Roles } from "./entities/roles";

const App: React.FC = (): JSX.Element => {
	const ctx = useContext(ApplicationContext);

	// eslint-disable-next-line
	const [user, setUser] = useState<User>();
	const [cart, setCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		const storedToken = localStorage.getItem('token');

		if (storedUser && storedToken) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const defaultProtectedRouteProps: ProtectedRouteProps = {
		isAuthenticated: (user?.role == Roles.Admin),
		authenticationPath: '/'
	};

	return (
		<BrowserRouter>
			<SWRConfig
				value={{
					refreshWhenHidden: false,
					refreshWhenOffline: false,
					revalidateOnFocus: false,
					revalidateOnReconnect: false
				}}
			>
				<ApplicationContext.Provider value={{ user, setUser, cart, setCart}}>
					<div className="App" style={{ display: "flex", flexDirection: "column" }}>
						<NavMenu />
						<br></br>
						<main style={{ flexGrow: 1 }}>
							<Switch>
								<Route exact path="/">
									{console.log(user?.role)}
									<Home />
								</Route>
								<Route exact path="/login">
									<Login />
								</Route>
								<Route exact path="/sign-up">
									<SignUp />
								</Route>
								<Route exact path="/about">
									<About />
								</Route>
								<Route exact path="/products">
									<ProductsPage />
								</Route>
								<Route exact path="/products/MYMACalc1">
									<MYMACalc1 />
								</Route>
								<Route exact path="/products/MYMACalc2">
									<MYMACalc2 />
								</Route>
								<Route exact path="/products/MYMACalc3">
									<MYMACalc3 />
								</Route>
								<Route exact path="/products/finance-with-maple">
									<FinancePreview />
								</Route>
								<Route exact path="/checkout">
									<Checkout />
								</Route>
								<Route exact path="/contact">
									<Contact />
								</Route>
								<Route exact path="/activate">
									<AccountActivation />
								</Route>
								<Route exact path="/reset-password">
									<ResetPassword />
								</Route>
								<Route exact path="/request-password-reset">
									<RequestPasswordReset />
								</Route>
								<Route exact path="/instructor/class">
									<InstructorManageClassPage />
								</Route>
								<Route exact path="/admin/class">
									<AdminManageClassesPage />
								</Route>
								<Route exact path="/admin/user">
									<AdminUserInfoPage />
								</Route>
								<Route exact path="/admin/products">
									<AdminEditProductInfo />
								</Route>
								<Route exact path="/admin/purchase-code">
									<AdminPurchaseCode />
								</Route>
								<Route exact path="/admin/free-subscription">
									<AdminFreeSubscriptionPage/>
								</Route>
								<Route exact path="/admin/paid-subscription">
									<AdminPaidSubscriptionPage/>
								</Route>
								<ProtectedRoute {...defaultProtectedRouteProps} exact path="/admin/transaction">
									<AdminTransactionPage />
								</ProtectedRoute>
								<Route exact path="/read">
									<ReadBook />
								</Route>
								<Route exact path="/subscriptions">
									<UserSubscriptionPage />
								</Route>
							</Switch>
						</main>
					</div>
				</ApplicationContext.Provider>
			</SWRConfig>
		</BrowserRouter>
	);
};

export default App;
