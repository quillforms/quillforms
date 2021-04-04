/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
/**
 *
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';

const FormFooter: React.FC = () => {
	const {
		isWelcomeScreenActive,
		isThankyouScreenActive,
		pathEditableFields,
	} = useSelect( ( select ) => {
		return {
			isThankyouScreenActive: select(
				'quillForms/renderer-core'
			).isThankyouScreenActive(),
			isWelcomeScreenActive: select(
				'quillForms/renderer-core'
			).isWelcomeScreenActive(),
			pathEditableFields: select(
				'quillForms/renderer-core'
			).getEditableFieldsInCurrentPath(),
		};
	} );

	return (
		<div
			className={ classnames( 'renderer-components-form-footer', {
				hidden:
					isWelcomeScreenActive ||
					isThankyouScreenActive ||
					! pathEditableFields?.length,
			} ) }
		>
			<ProgressBar />
		</div>
	);
};

export default FormFooter;
