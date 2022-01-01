/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';

interface Props {
	id: string;
	blockName: string;
}
const BlockControlsHeader: React.FC< Props > = memo( ( { id, blockName } ) => {
	const { blockOrder, blockType } = useSelect( ( select ) => {
		return {
			blockOrder: select( 'quillForms/block-editor' ).getBlockOrderById(
				id
			),
			blockType: select( 'quillForms/blocks' ).getBlockType( blockName ),
		};
	} );
	return (
		<div className="block-editor-block-controls-header">
			<BlockIconBox
				icon={ blockType?.icon }
				order={ blockOrder }
				color={ blockType?.color }
			/>
			<div className="block-editor-block-controls-header__block-title">
				{ blockType?.title }
			</div>
			<div className="block-editor-block-controls-header__block-id">
				ID: { id }
			</div>
		</div>
	);
} );

export default BlockControlsHeader;
