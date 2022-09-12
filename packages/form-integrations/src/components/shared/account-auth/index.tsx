/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import type { Provider, ConnectMainAccounts } from '../../types';
import Credentials from './credentials';
import Oauth from './oauth';

interface Props {
	provider: Provider;
	data: ConnectMainAccounts;
	onAdding?: ( status: boolean ) => void;
	onAdded: ( id: string, account: { name: string } ) => void;
}

const AccountAuth: React.FC< Props > = ( {
	provider,
	data,
	onAdding,
	onAdded,
} ) => {
	return (
		<div className="integration-auth">
			{ data.auth.type === 'oauth' ? (
				<Oauth
					provider={ provider }
					labels={ data.labels }
					onAdded={ onAdded }
				/>
			) : (
				<Credentials
					provider={ provider }
					labels={ data.labels }
					fields={ data.auth.fields }
					onAdding={ onAdding }
					onAdded={ onAdded }
				/>
			) }
		</div>
	);
};

export default AccountAuth;
