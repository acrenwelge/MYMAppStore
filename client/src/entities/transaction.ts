import User from "./user";

export default interface Transaction {
	txId: number;
	total: number;
	createdAt: Date;
	transactionDetails: {
		txDetailId: number, 
		finalPrice: number
	}[],
	user: User;
}