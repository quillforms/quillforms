/**
 * Internal dependencies
 */
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
import type {
	App,
	Accounts,
	Account,
	Connections,
	Connection,
	ConnectionDeepPartial,
	AppActionTypes,
	AccountsActionTypes,
	ConnectionsActionTypes,
} from './types';

export default (
	dispatch: React.Dispatch<
		AppActionTypes | AccountsActionTypes | ConnectionsActionTypes
	>
) => {
	return {
		setupApp: ( app: App ) => {
			dispatch( {
				type: SETUP_APP,
				app,
			} );
		},
		setupAccounts: ( accounts: Accounts ) => {
			dispatch( {
				type: SETUP_ACCOUNTS,
				accounts,
			} );
		},
		addAccount: ( id: string, account: Account ) => {
			dispatch( {
				type: ADD_ACCOUNT,
				id,
				account,
			} );
		},
		updateAccount: ( id: string, account: Partial< Account > ) => {
			dispatch( {
				type: UPDATE_ACCOUNT,
				id,
				account,
			} );
		},
		setupConnections: ( connections: Connections ) => {
			dispatch( {
				type: SETUP_CONNECTIONS,
				connections,
			} );
		},
		addConnection: ( id: string, connection: Connection ) => {
			dispatch( {
				type: ADD_CONNECTION,
				id,
				connection,
			} );
		},
		updateConnection: (
			id: string,
			connection: ConnectionDeepPartial,
			recursive: boolean = true
		) => {
			dispatch( {
				type: UPDATE_CONNECTION,
				id,
				connection,
				recursive,
			} );
		},
		deleteConnection: ( id: string ) => {
			dispatch( {
				type: DELETE_CONNECTION,
				id,
			} );
		},
	};
};
