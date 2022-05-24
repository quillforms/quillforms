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

export type Setup = {
	Instructions: React.FC;
	fields: SetupFields;
};

export type AccountsAuthFields = {
	[ key: string ]: {
		label: string;
		type: 'text';
	};
};

export type AccountsAuth = {
	type: 'credentials' | 'oauth';
	fields?: AccountsAuthFields;
};

export type ConnectMain = {
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

export type SettingsMainAccounts = {
	auth: AccountsAuth;
	actions?: React.FC< { accountId: string } >[];
};

export type SettingsMain = {
	accounts: SettingsMainAccounts;
	helpers?: React.FC[];
};
