/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
/**
 *
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';

const FormFooter = () => {
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
