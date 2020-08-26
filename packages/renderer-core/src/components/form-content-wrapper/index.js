/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import FormContent from '../form-content';

const FormContentWrapper = ( {
	formStructure,
	editableFields,
	currentBlockId,
	currentBlockCat,
} ) => {
	const { blocks } = useSelect( ( select ) => {
		return {
			blocks: select( 'quillForms/blocks' ).getBlocks(),
		};
	} );
	const { insertNewFieldAnswer } = useDispatch(
		'quillForms/renderer-submission'
	);

	useEffect( () => {
		// con§sole.log(editableFields);
		editableFields.map( ( field ) =>
			insertNewFieldAnswer( field.id, field.type )
		);
	}, [] );

	return (
		<div className="renderer-core-form-contenet-wrapper">
			<FormContent
				formStructure={ { ...formStructure } }
				editableFields={ editableFields }
				blocks={ blocks }
				currentBlockId={ currentBlockId }
				currentBlockCat={ currentBlockCat }
			/>
		</div>
	);
};
export default FormContentWrapper;
