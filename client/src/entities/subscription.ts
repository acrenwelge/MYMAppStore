import Product from "./product";

export default interface Subscription {
	readonly id: number;
	readonly product?: Product;
	readonly expirationDate: Date;
	readonly userId: number;
}
