/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import useBlocks from './use-blocks';
import useFlattenedBlocks from './use-flattened-blocks';

const useEditableFields = ( flatten = false ) => {
	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	let formBlocks = useBlocks();
	const flattenedBlocks = useFlattenedBlocks( formBlocks );
	if ( flatten ) {
		formBlocks = Object.values( flattenedBlocks );
	}

	const editableFields = formBlocks.filter( ( block ) => {
		const blockType = blockTypes[ block.name ];
		return blockType?.supports?.editable === true;
	} );

	return editableFields;
};

export default useEditableFields;
