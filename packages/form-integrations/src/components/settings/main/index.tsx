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

interface Props {
	main: SettingsMain;
}

const Main: React.FC< Props > = ( { main } ) => {
	// context.
	const { setup } = useSettingsContext();

	return (
		<div className="integration-settings-main">{ setup && <App /> }</div>
	);
};

export default Main;
