/**
 * Internal dependencies
 */
import {
	SETUP_APP,
	SETUP_ACCOUNTS,
	ADD_ACCOUNT,
	UPDATE_ACCOUNT,
	DELETE_ACCOUNT,
} from './constants';
import type {
	App,
	Accounts,
	Account,
	AppActionTypes,
	AccountsActionTypes,
} from './types';

export default (
	dispatch: React.Dispatch< AppActionTypes | AccountsActionTypes >
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
		deleteAccount: ( id: string ) => {
			dispatch( {
				type: DELETE_ACCOUNT,
				id,
			} );
		},
	};
};
