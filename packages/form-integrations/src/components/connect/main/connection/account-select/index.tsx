/**
 * QuillForms Dependencies
 */
import { SelectControl } from '@quillforms/admin-components';
import type { CustomSelectControl } from '@wordpress/components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import { useConnectContext } from '../../../state/context';
import { useConnectMainContext } from '../../context';
import { Account } from '../../../state/types';
import AccountAuth from '../../../../shared/account-auth';

interface Props {
	connectionId: string;
}

const AccountSelector: React.FC< Props > = ( { connectionId } ) => {
	// context.
	const {
		provider,
		accounts,
		connections,
		addAccount,
		updateAccount,
		updateConnection,
		savePayload,
	} = useConnectContext();
	const connection = connections[ connectionId ];
	const main = useConnectMainContext();

	// state.
	const [ showingAddNewAccount, setShowingAddNewAccount ] = useState( false );
	const [ addingNewAccount, setAddingNewAccount ] = useState( false );

	// for ts. won't be reached normally.
	if ( ! main.connection.accounts?.auth ) {
		return null;
	}

	// if there is no accounts, show add account.
	if ( ! showingAddNewAccount ) {
		if ( Object.entries( accounts ).length === 0 ) {
			setTimeout( () => setShowingAddNewAccount( true ) );
			return null;
		}
	}

	// define options and the selected one.
	const options: CustomSelectControl.Option[] = [
		{
			key: 'select',
			name: __( 'Select an account', 'quillforms' ),
			style: { display: 'none' },
		},
		...Object.entries( accounts ).map( ( [ id, account ] ) => {
			return { key: id, name: account.name };
		} ),
		{
			key: 'add',
			name: __( 'Add new account', 'quillforms' ),
		},
	];
	let selected: CustomSelectControl.Option;
	if ( connection.account_id ) {
		selected =
			options.find(
				( option ) => option.key === connection.account_id
			) ?? options[ 0 ];
	} else {
		selected = showingAddNewAccount
			? options[ options.length - 1 ] // add
			: options[ 0 ]; // select
	}

	// updating connection on changing account selection.
	const onChange = ( value ) => {
		setShowingAddNewAccount( value === 'add' );
		if ( value === 'select' || value === 'add' ) {
			value = undefined;
		}
		updateConnection(
			connectionId,
			{
				account_id: value,
				...cloneDeep( main.connection.options.default ),
			},
			false
		);
	};

	const onAdded = ( id: string, account: Account ) => {
		// add or update the account.
		if ( accounts[ id ] ) {
			updateAccount( id, account );
		} else {
			addAccount( id, account );
		}
		// save payload.
		setTimeout( () => savePayload( 'accounts' ) );
		// select it.
		onChange( id );
	};

	return (
		<div className="connection-section connection-account-selector">
			<SelectControl
				className="connection-primary-control"
				label={ provider.label + ' ' + __( 'Account', 'quillforms' ) }
				options={ options }
				value={ selected }
				onChange={ ( { selectedItem: { key } } ) => onChange( key ) }
				disabled={ addingNewAccount }
			/>
			{ showingAddNewAccount && (
				<AccountAuth
					provider={ provider }
					data={ main.connection.accounts.auth }
					onAdding={ setAddingNewAccount }
					onAdded={ onAdded }
				/>
			) }
		</div>
	);
};

export default AccountSelector;
