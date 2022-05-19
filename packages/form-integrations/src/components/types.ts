export type Provider = {
	slug: string;
	label: string;
};

export type SetupFields = {
	[ key: string ]: {
		label: string;
		type: 'text';
		check: boolean;
	};
};

export type AccountsAuth = {
	type: 'credentials' | 'oauth';
	fields?: {
		[ key: string ]: {
			label: string;
			type: 'text';
		};
	};
};

export type Main = {
	connection: {
		accounts?: {
			auth: AccountsAuth;
		};
		options: {
			default: { [ x: string ]: any };
			Component: React.FC< { connectionId: string } >;
			validate?: ( args: {
				connection: any;
				account?: any;
			} ) => { valid: boolean; message?: string };
		};
	};
};
