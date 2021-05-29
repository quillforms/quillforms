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
import FieldNavigation from '../field-navigation';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';

const FormFooter: React.FC = memo( () => {
	const {
		currentBlockId,
		isWelcomeScreenActive,
		isThankyouScreenActive,
	} = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			isThankyouScreenActive: select(
				'quillForms/renderer-core'
			).isThankyouScreenActive(),
			isWelcomeScreenActive: select(
				'quillForms/renderer-core'
			).isWelcomeScreenActive(),
		};
	} );

	if ( ! currentBlockId ) return null;
	return (
		<div
			className={ classnames( 'renderer-components-form-footer', {
				hidden: isWelcomeScreenActive || isThankyouScreenActive,
			} ) }
			tabIndex={ -1 }
		>
			<ProgressBar />
			<FieldNavigation />
		</div>
	);
} );

export default FormFooter;
