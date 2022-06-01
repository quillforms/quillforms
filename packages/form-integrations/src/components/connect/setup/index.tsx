/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { useConnectContext } from '../state/context';
import { default as GenericSetup } from '../../shared/setup';
import Footer from '../footer';
import type { Setup as SetupType } from '../../types';

interface Props {
	setup: SetupType;
	close: () => void;
}

const Setup: React.FC< Props > = ( { setup, close } ) => {
	const { provider, setupApp, savePayload } = useConnectContext();

	const SetupControls: React.FC< { submit: () => void } > = ( {
		submit,
	} ) => {
		return (
			<Footer
				save={ {
					label: 'Save',
					onClick: submit,
					disabled: false,
				} }
				close={ { label: 'Close', onClick: close } }
			/>
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
				setTimeout( () => savePayload( 'app' ) );
			} }
		/>
	);
};

export default Setup;
