/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import DefaultControls from './default-controls';

const BlockControls = () => {
	const {
		setBlockAttributes,
		toggleDescription,
		setBlockAttachment,
		toggleRequired,
	} = useDispatch( 'quillForms/block-editor' );

	const { currentBlockId, currentFormItem } = useSelect( ( select ) => {
		const { getCurrentBlockId, getCurrentFormItem } = select(
			'quillForms/block-editor'
		);
		return {
			currentBlockId: getCurrentBlockId(),
			currentFormItem: getCurrentFormItem(),
		};
	} );

	const { type } = currentFormItem;

	const block = useSelect(
		( select ) => select( 'quillForms/blocks' ).getBlocks()[ type ]
	);

	return (
		<div className="block-editor-block-controls">
			<DefaultControls
				supports={ block.supports }
				currentFormItem={ currentFormItem }
				toggleDescription={ () => {
					toggleDescription( currentBlockId );
				} }
				setAttachment={ ( val ) => {
					setBlockAttachment( currentBlockId, val );
				} }
				toggleRequired={ ( val ) => {
					toggleRequired( currentBlockId, val );
				} }
			/>
			{ block.editorConfig?.controls && (
				<block.editorConfig.controls
					id={ currentBlockId }
					attributes={ currentFormItem.attributes }
					setAttributes={ ( val ) => {
						setBlockAttributes( currentBlockId, val );
					} }
				/>
			) }
		</div>
	);
};
export default BlockControls;
