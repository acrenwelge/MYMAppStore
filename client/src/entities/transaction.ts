import User from "./user";

export default interface Transaction {
	txId: number;
	total: number;
	date: Date;
	transactionDetails: {
		txDetailId: number, 
		finalPrice: number
	}[],
	user: User;
}