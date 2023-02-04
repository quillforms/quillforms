/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import BlockControlsHeader from '../block-controls-header';

/**
 * Internal Dependencies
 */
import DefaultControls from '../block-default-controls';

const BlockControls = ( { parentIndex } ) => {
	const { setBlockAttributes } = useDispatch( 'quillForms/block-editor' );

	let {
		currentBlockId,
		currentChildBlockIndex,
		currentChildBlockId,
		currentFormBlock,
		blockTypes,
	} = useSelect( ( select ) => {
		const {
			getCurrentBlockId,
			getCurrentChildBlockId,
			getCurrentChildBlockIndex,
			getCurrentBlock,
		} = select( 'quillForms/block-editor' );
		return {
			currentBlockId: getCurrentBlockId(),
			currentChildBlockIndex: getCurrentChildBlockIndex(),
			currentChildBlockId: getCurrentChildBlockId(),
			currentFormBlock: getCurrentBlock(),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );

	//console.log( currentBlockId, currentChildBlockId );
	if ( ! currentBlockId || ! currentFormBlock ) return null;
	if ( currentChildBlockId ) {
		currentFormBlock =
			currentFormBlock.innerBlocks[ currentChildBlockIndex ];
		currentBlockId = currentChildBlockId;
	}
	const blockType = blockTypes[ currentFormBlock.name ];

	const { name } = currentFormBlock;

	return (
		<div className="block-editor-block-controls">
			<BlockControlsHeader
				id={ currentBlockId }
				blockName={ currentFormBlock.name }
			/>
			<DefaultControls
				blockName={ name }
				attributes={ currentFormBlock.attributes }
				setAttributes={ ( val ) => {
					setBlockAttributes( currentBlockId, val, parentIndex );
				} }
			/>
			{ blockType?.controls && (
				<blockType.controls
					id={ currentBlockId }
					attributes={ currentFormBlock.attributes }
					setAttributes={ ( val ) => {
						setBlockAttributes( currentBlockId, val, parentIndex );
					} }
				/>
			) }
		</div>
	);
};
export default BlockControls;
