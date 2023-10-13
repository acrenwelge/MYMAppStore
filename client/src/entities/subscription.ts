import Product from "./product";

export default interface Subscription {
	readonly id: number;
	readonly item: Product;
	expirationDate: Date; // allow this to be edited for string -> Date conversion
	readonly userId: number;
	readonly ownerId: number;
}
