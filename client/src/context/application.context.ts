import React from "react";
import { User } from "../entities";
import { CartItem } from "../entities/product";

export type ApplicationContextData = {
	user?: User
	setUser?: (user?: User) => void
	cart: CartItem[]
	setCart: (cart: CartItem[]) => void
	students: number[]
	setStudents: (students: number[]) => void
};

const ApplicationContext = React.createContext<ApplicationContextData>({
	cart: [],
	setCart: () => {console.warn("No cart provider")},
	students: [],
	setStudents: () => {console.warn("No students found")}
});

export default ApplicationContext;