export interface User {
	active: boolean;
	email: string;
	name: string;
	password: string;
	photo: string;
	role: string;
	subscriptions: [string];
	__v: number;
	_id: string;
}
