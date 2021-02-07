/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const BlockMover = ( { id, type, dragHandleProps } ) => {
	const { blockOrder, blockTypes } = useSelect( ( select ) => {
		return {
			blockOrder: select( 'quillForms/block-editor' ).getBlockOrderById(
				id
			),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );

	return (
		<div className="block-editor-block-mover" { ...dragHandleProps }>
			<BlockIconBox
				icon={ blockTypes[ type ]?.editorConfig?.icon }
				order={ blockOrder }
				color={ blockTypes[ type ]?.editorConfig?.color }
			/>
		</div>
	);
};

export default BlockMover;
