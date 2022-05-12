/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { Provider } from '../../types';

/**
 * Internal Dependencies
 */
import {
	Account,
	Accounts,
	Connection,
	ConnectionDeepPartial,
	Connections,
} from './types';

const ConnectContext = createContext< {
	provider: Provider;
	accounts: Accounts;
	connections: Connections;
	setupApp: ( app: any ) => void;
	addAccount: ( id: string, account: Account ) => void;
	updateAccount: ( id: string, account: Partial< Account > ) => void;
	addConnection: ( id: string, connection: Connection ) => void;
	updateConnection: (
		id: string,
		connection: ConnectionDeepPartial,
		recursive?: boolean
	) => void;
	deleteConnection: ( id: string ) => void;
	updatePayload: ( key: string, value: any ) => void;
	savePayload: ( key: string ) => void;
} >( {
	provider: {
		label: 'Provider',
		slug: 'provider',
	},
	accounts: {},
	connections: {},
	setupApp: ( _app: any ) => {
		throw 'setupApp() not implemented.';
	},
	addAccount: ( _id: string, _account: Account ) => {
		throw 'addAccount() not implemented.';
	},
	updateAccount: ( _id: string, _account: Partial< Account > ) => {
		throw 'updateAccount() not implemented.';
	},
	addConnection: ( _id: string, _connection: Connection ) => {
		throw 'addConnection() not implemented.';
	},
	updateConnection: (
		_id: string,
		_connection: ConnectionDeepPartial,
		_recursive: boolean = true
	) => {
		throw 'updateConnection() not implemented.';
	},
	deleteConnection: ( _id: string ) => {
		throw 'deleteConnection() not implemented.';
	},
	updatePayload: ( _key: string, _value: any ) => {
		throw 'updatePayload() not implemented.';
	},
	savePayload: ( _key: string ) => {
		throw 'savePayload() not implemented.';
	},
} );

const ConnectContextProvider = ConnectContext.Provider;
const useConnectContext = () => useContext( ConnectContext );

export { ConnectContext, ConnectContextProvider, useConnectContext };
