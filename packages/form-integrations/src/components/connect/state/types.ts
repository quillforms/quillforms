import {
	SETUP_APP,
	SETUP_ACCOUNTS,
	ADD_ACCOUNT,
	UPDATE_ACCOUNT,
	SETUP_CONNECTIONS,
	ADD_CONNECTION,
	UPDATE_CONNECTION,
	DELETE_CONNECTION,
} from './constants';

export type App = {
	[ x: string ]: any;
};

type setupApp = {
	type: typeof SETUP_APP;
	app: App;
};

export type AppActionTypes = setupApp | ReturnType< () => { type: 'NOOP' } >;

export type Accounts = {
	[ accountId: string ]: Account;
};

export type Account = {
	name: string;
};

export type Connections = {
	[ connectionId: string ]: Connection;
};

export type Connection = {
	name: string;
	account_id?: string;
	[ x: string ]: any;
	conditions?:  any;
};

type DeepPartial< T > = {
	[ P in keyof T ]?: DeepPartial< T[ P ] >;
};
export type ConnectionDeepPartial = DeepPartial< Connection >;

type setupAccounts = {
	type: typeof SETUP_ACCOUNTS;
	accounts: Accounts;
};

type addAccount = {
	type: typeof ADD_ACCOUNT;
	id: string;
	account: Account;
};

type updateAccount = {
	type: typeof UPDATE_ACCOUNT;
	id: string;
	account: Partial< Account >;
};

export type AccountsActionTypes =
	| setupAccounts
	| addAccount
	| updateAccount
	| ReturnType< () => { type: 'NOOP' } >;

type setupConnections = {
	type: typeof SETUP_CONNECTIONS;
	connections: Connections;
};

type addConnection = {
	type: typeof ADD_CONNECTION;
	id: string;
	connection: Connection;
};

type updateConnection = {
	type: typeof UPDATE_CONNECTION;
	id: string;
	connection: ConnectionDeepPartial;
	recursive: boolean;
};

type deleteConnection = {
	type: typeof DELETE_CONNECTION;
	id: string;
};

export type ConnectionsActionTypes =
	| setupConnections
	| addConnection
	| updateConnection
	| deleteConnection
	| ReturnType< () => { type: 'NOOP' } >;
