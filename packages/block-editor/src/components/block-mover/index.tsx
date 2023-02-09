/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';
import type { BlockTypeSettings } from '@quillforms/blocks';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface Props {
	id: string;
	blockType: BlockTypeSettings;
	handleProps: DraggableProvidedDragHandleProps | undefined;
	parentIndex?: number;
}
const BlockMover: React.FC< Props > = ( {
	blockType,
	id,
	parentIndex,
	handleProps,
} ) => {
	//console.log( 'Dfdff' );
	const { blockOrder } = useSelect( ( select ) => {
		return {
			blockOrder: select( 'quillForms/block-editor' ).getBlockOrderById(
				id,
				parentIndex
			),
		};
	} );

	//console.log( blockOrder );

	return (
		<div className="block-editor-block-mover" { ...handleProps }>
			<BlockIconBox
				icon={ blockType?.icon }
				order={ blockOrder }
				color={ blockType?.color }
			/>
		</div>
	);
};

export default BlockMover;
