/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';

/**
 *
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';

const FormFooter: React.FC = memo( () => {
	const { isWelcomeScreenActive, isThankyouScreenActive } = useSelect(
		( select ) => {
			return {
				isThankyouScreenActive: select(
					'quillForms/renderer-core'
				).isThankyouScreenActive(),
				isWelcomeScreenActive: select(
					'quillForms/renderer-core'
				).isWelcomeScreenActive(),
			};
		}
	);

	return (
		<div
			className={ classnames( 'renderer-components-form-footer', {
				hidden: isWelcomeScreenActive || isThankyouScreenActive,
			} ) }
			tabIndex={ -1 }
		>
			<ProgressBar />
		</div>
	);
} );

export default FormFooter;
