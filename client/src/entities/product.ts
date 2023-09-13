export default interface Product {
	readonly itemId: number;
	readonly name: string;
	readonly subscriptionLengthMonths: number;
	readonly price: number;
}

/**
 * @description A product that has been added to the cart, and optionally has a purchase code and quantity.
 * The quantity field is optional and is used to calculate the final price.
 * If not provided, the quantity is assumed to be 1.
 * The final price is calculated from the product's standard price, purchase code, and quantity.
 * The final price overrides the product's standard price and is used to calculate the cart's grand total.
 */
export interface CartItem extends Product {
	purchaseCode?: string;
	quantity?: number;
	finalPrice: number;
}