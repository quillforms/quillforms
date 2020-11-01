/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const BlockMover = ( { id, type, dragHandleProps } ) => {
	const { blockOrder } = useSelect( ( select ) => {
		return {
			blockOrder: select( 'quillForms/block-editor' ).getBlockOrderById(
				id
			),
		};
	} );

	return (
		<div className="block-editor-block-mover" { ...dragHandleProps }>
			<BlockIconBox blockType={ type } blockOrder={ blockOrder } />
		</div>
	);
};

export default BlockMover;
