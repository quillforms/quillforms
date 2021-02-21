/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import DefaultControls from './default-controls';

const BlockControls = () => {
	const { setBlockAttributes } = useDispatch( 'quillForms/block-editor' );

	const { currentBlockId, currentFormItem } = useSelect( ( select ) => {
		const { getCurrentBlockId, getCurrentFormItem } = select(
			'quillForms/block-editor'
		);
		return {
			currentBlockId: getCurrentBlockId(),
			currentFormItem: getCurrentFormItem(),
		};
	} );

	const { blockType } = useSelect( ( select ) => {
		return {
			blockType: currentFormItem
				? select( 'quillForms/blocks' ).getBlockTypes()[
						currentFormItem.name
				  ]
				: null,
		};
	} );
	if ( ! currentBlockId || ! currentFormItem ) return null;
	const { name } = currentFormItem;

	return (
		<div className="block-editor-block-controls">
			<DefaultControls
				blockName={ name }
				attributes={ currentFormItem.attributes }
				setAttributes={ ( val ) => {
					setBlockAttributes( currentBlockId, val );
				} }
			/>
			{ blockType?.controls && (
				<blockType.controls
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
