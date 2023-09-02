import Product from "./product";

export default interface PurchaseCode {
	readonly code_id: number;
	name: string;
	priceOff: number;
	item: Product;
}
