/**
 * QuillForms Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import { useSettingsContext } from '../../state/context';
import { default as GenericAccountAuth } from '../../../shared/account-auth';
import { SettingsMainAccounts } from '../../../types';

interface Props {
	data: SettingsMainAccounts;
}

const AccountAuth: React.FC< Props > = ( { data } ) => {
	// context.
	const {
		provider,
		accounts,
		addAccount,
		updateAccount,
	} = useSettingsContext();

	const onAdded = ( id: string, account: { name: string } ) => {
		// add or update the account.
		if ( accounts[ id ] ) {
			updateAccount( id, account );
		} else {
			addAccount( id, account );
		}
	};

	return (
		<div className="integration-settings-main-account-auth">
			<b>
				{ data.auth.type === 'oauth'
					? 'Authorize/Reauthorize'
					: 'Add/Update' }{ ' ' }
				{ data.labels?.plural?.toLowerCase() ?? 'account' }:
			</b>
			<GenericAccountAuth
				provider={ provider }
				data={ data }
				onAdded={ onAdded }
			/>
		</div>
	);
};

export default AccountAuth;
