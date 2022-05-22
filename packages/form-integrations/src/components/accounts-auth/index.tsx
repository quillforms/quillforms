/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import type { Provider, AccountsAuth as AccountsAuthData } from '../types';
import Credentials from './credentials';
import Oauth from './oauth';

interface Props {
	provider: Provider;
	data: AccountsAuthData;
	onAdding: ( status: boolean ) => void;
	onAdded: ( id: string, account: { name: string } ) => void;
}

const AccountsAuth: React.FC< Props > = ( {
	provider,
	data,
	onAdding,
	onAdded,
} ) => {
	return (
		<div className="integration-auth">
			{ data.type === 'oauth' ? (
				<Oauth provider={ provider } onAdded={ onAdded } />
			) : (
				<Credentials
					provider={ provider }
					fields={ data.fields }
					onAdding={ onAdding }
					onAdded={ onAdded }
				/>
			) }
		</div>
	);
};

export default AccountsAuth;
