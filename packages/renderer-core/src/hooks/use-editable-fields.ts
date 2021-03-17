/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import useBlocks from './use-blocks';

const useEditableFields = () => {
	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	const formBlocks = useBlocks();

	const editableFields = formBlocks.filter( ( block ) => {
		const registeredBlock = blockTypes[ block.name ];
		return registeredBlock?.supports?.editable === true;
	} );

	return editableFields;
};

export default useEditableFields;
