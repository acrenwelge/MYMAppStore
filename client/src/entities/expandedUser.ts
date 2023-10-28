interface SubscriptionInterface {
  	owner: any;
	subscriptionId: number,
	expirationDate: Date;
}

export default interface ExpandedUser {
	readonly userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	activatedAccount: boolean;
  	readonly usingSubscriptions: SubscriptionInterface[];
  	readonly ownedSubscriptions: SubscriptionInterface[];
}