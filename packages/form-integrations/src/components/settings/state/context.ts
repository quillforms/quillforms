/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { Provider, Setup } from '../../types';

/**
 * Internal Dependencies
 */
import { Account, Accounts, App } from './types';

const SettingsContext = createContext< {
	provider: Provider;
	setup?: Setup;
	app: App;
	accounts: Accounts;
	setupApp: ( app: any ) => void;
	setupAccounts: ( accounts: Accounts ) => void;
	addAccount: ( id: string, account: Account ) => void;
	updateAccount: ( id: string, account: Partial< Account > ) => void;
	deleteAccount: ( id: string ) => void;
} >( {
	provider: {
		label: 'Provider',
		slug: 'provider',
	},
	app: {},
	accounts: {},
	setupApp: ( _app: any ) => {
		throw 'setupApp() not implemented.';
	},
	setupAccounts: ( _accounts: Accounts ) => {
		throw 'setupAccounts() not implemented.';
	},
	addAccount: ( _id: string, _account: Account ) => {
		throw 'addAccount() not implemented.';
	},
	updateAccount: ( _id: string, _account: Partial< Account > ) => {
		throw 'updateAccount() not implemented.';
	},
	deleteAccount: ( _id: string ) => {
		throw 'deleteAccount() not implemented.';
	},
} );

const SettingsContextProvider = SettingsContext.Provider;
const useSettingsContext = () => useContext( SettingsContext );

export { SettingsContext, SettingsContextProvider, useSettingsContext };
