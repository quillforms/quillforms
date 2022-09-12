/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { useSettingsContext } from '../state/context';
import { default as GenericSetup } from '../../shared/setup';

const Setup: React.FC = () => {
	const { provider, setup, setupApp } = useSettingsContext();

	// for ts. won't be reached normally.
	if ( ! setup ) return null;

	const SetupControls: React.FC< { submit: () => void } > = ( {
		submit,
	} ) => {
		return (
			<Button isPrimary onClick={ submit }>
				Submit
			</Button>
		);
	};

	return (
		<GenericSetup
			provider={ provider }
			Instructions={ setup.Instructions }
			fields={ setup.fields }
			Controls={ SetupControls }
			onFinish={ ( app ) => {
				setupApp( app );
			} }
		/>
	);
};

export default Setup;
