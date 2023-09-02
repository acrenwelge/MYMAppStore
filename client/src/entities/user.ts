export default interface User {
	readonly userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	activatedAccount: boolean;
}
