import Product from "./product";
import User from "./user";

export default interface Subscription {
	readonly subscriptionId: number;
	readonly item: Product;
	expirationDate: Date; // allow this to be edited for string -> Date conversion
	readonly user: User;
	readonly owner: User;
}
