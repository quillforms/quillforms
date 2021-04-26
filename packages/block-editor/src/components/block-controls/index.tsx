/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import BlockControlsHeader from '../block-controls-header';

/**
 * Internal Dependencies
 */
import DefaultControls from '../block-default-controls';

const BlockControls = () => {
	const { setBlockAttributes } = useDispatch( 'quillForms/block-editor' );

	const { currentBlockId, currentFormBlock } = useSelect( ( select ) => {
		const { getCurrentBlockId, getCurrentBlock } = select(
			'quillForms/block-editor'
		);
		return {
			currentBlockId: getCurrentBlockId(),
			currentFormBlock: getCurrentBlock(),
		};
	} );

	const { blockType } = useSelect( ( select ) => {
		return {
			blockType: currentFormBlock
				? select( 'quillForms/blocks' ).getBlockTypes()[
						currentFormBlock.name
				  ]
				: null,
		};
	} );
	if ( ! currentBlockId || ! currentFormBlock ) return null;
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
					setBlockAttributes( currentBlockId, val );
				} }
			/>
			{ blockType?.controls && (
				<blockType.controls
					id={ currentBlockId }
					attributes={ currentFormBlock.attributes }
					setAttributes={ ( val ) => {
						setBlockAttributes( currentBlockId, val );
					} }
				/>
			) }
		</div>
	);
};
export default BlockControls;
