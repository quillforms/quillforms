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

	const { blockType } = useSelect( ( select ) => {
		return {
			blockType: select( 'quillForms/blocks' ).getBlockTypes()[ type ],
		};
	} );

	return (
		<div className="block-editor-block-controls">
			<DefaultControls
				type={ type }
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
			{ blockType.editorConfig?.controls && (
				<blockType.editorConfig.controls
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
