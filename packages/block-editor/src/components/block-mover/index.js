/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const BlockMover = ( { blockType, id, dragHandleProps } ) => {
	const { blockOrder } = useSelect( ( select ) => {
		return {
			blockOrder: select( 'quillForms/block-editor' ).getBlockOrderById(
				id
			),
		};
	} );

	return (
		<div className="block-editor-block-mover" { ...dragHandleProps }>
			<BlockIconBox
				icon={ blockType?.icon }
				order={ blockOrder }
				color={ blockType?.color }
			/>
		</div>
	);
};

export default BlockMover;
