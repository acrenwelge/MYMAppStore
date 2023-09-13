export default interface PurchaseCode {
	name: string;
	priceOff: number;
	item: {
		itemId: number;
		itemName: string;
		itemSubscriptionLength: number;
	}
}
