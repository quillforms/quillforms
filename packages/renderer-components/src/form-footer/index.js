/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';

const FormFooter = ( {
	currentBlockId,
	currentBlockCat,
	pathEditableFields,
} ) => {
	return (
		<div
			className={ classnames( 'renderer-components-form-footer', {
				hidden: currentBlockCat !== 'fields',
			} ) }
		>
			{ pathEditableFields.length > 0 && (
				<ProgressBar
					currentBlockId={ currentBlockId }
					totalQuestions={ pathEditableFields.length }
				/>
			) }
		</div>
	);
};

export default FormFooter;
