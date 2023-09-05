export default interface Transaction {
	txId: number;
	total: number;
	date: Date;
	transactionDetails: {txDetailId: number, finalPrice: number}[],
	user: {
			userId: number,
			firstName: string,
			lastName: string,
			email: string,
			activatedAccount: true,
			createdAt: Date,
			updatedAt: Date,
			role: string,
	}
}