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
		currentBlockId,
	} = useSelect( ( select ) => {
		return {
			pathEditableFields: select(
				'quillForms/renderer-core'
			).getEditableFieldsInCurrentPath(),
			isThankyouScreenActive: select(
				'quillForms/renderer-core'
			).isThankyouScreenActive(),
			isWelcomeScreenActive: select(
				'quillForms/renderer-core'
			).isWelcomeScreenActive(),
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );
	const progressBar = useMemo( () => {
		return <ProgressBar totalQuestions={ pathEditableFields.length } />;
	}, [ currentBlockId ] );
	return (
		<div
			className={ classnames( 'renderer-components-form-footer', {
				hidden: isWelcomeScreenActive || isThankyouScreenActive,
			} ) }
		>
			{ pathEditableFields.length > 0 && progressBar }
		</div>
	);
};

export default FormFooter;
