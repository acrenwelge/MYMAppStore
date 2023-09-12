import React from "react";
import { User, Product } from "../entities";

export type ApplicationContextData = {
	user?: User;
	setUser?: (user?: User) => void;
	cart: Product[];
	setCart: (cart: Product[]) => void;
};

export const ApplicationContext = React.createContext<ApplicationContextData>({
	cart: [],
	setCart: () => {console.warn("No cart provider")},
});
