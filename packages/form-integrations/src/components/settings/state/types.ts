import {
	SETUP_APP,
	SETUP_ACCOUNTS,
	ADD_ACCOUNT,
	UPDATE_ACCOUNT,
	DELETE_ACCOUNT,
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

type deleteAccount = {
	type: typeof DELETE_ACCOUNT;
	id: string;
};

export type AccountsActionTypes =
	| setupAccounts
	| addAccount
	| updateAccount
	| deleteAccount
	| ReturnType< () => { type: 'NOOP' } >;
