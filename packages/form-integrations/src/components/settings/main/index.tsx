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
import { useSettingsContext } from '../state/context';
import type { SettingsMain } from '../../types';
import App from './app';
import AccountAuth from './account-auth';
import Accounts from './accounts';

interface Props {
	main: SettingsMain;
}

const Main: React.FC< Props > = ( { main } ) => {
	// context.
	const { setup } = useSettingsContext();

	return (
		<div className="integration-settings-main">
			{ setup && <App /> }
			<Accounts data={ main.accounts } />
			<AccountAuth data={ main.accounts.auth } />
			{ main.helpers &&
				main.helpers.map( ( Helper, index ) => (
					<Helper key={ index } />
				) ) }
		</div>
	);
};

export default Main;
