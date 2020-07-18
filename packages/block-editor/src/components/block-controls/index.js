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
	} = useDispatch( 'quillForms/builder-core' );

	const { currentBlockId, currentBlockCat, currentFormItem } = useSelect(
		( select ) => {
			const {
				getCurrentBlockId,
				getCurrentBlockCat,
				getCurrentFormItem,
			} = select( 'quillForms/builder-core' );
			return {
				currentBlockId: getCurrentBlockId(),
				currentBlockCat: getCurrentBlockCat(),
				currentFormItem: getCurrentFormItem(),
			};
		}
	);

	const type =
		// eslint-disable-next-line no-nested-ternary
		currentBlockCat === 'fields'
			? currentFormItem.type
			: currentBlockCat === 'welcomeScreens'
			? 'welcome-screen'
			: 'thankyou-screen';

	const block = useSelect(
		( select ) => select( 'quillForms/blocks' ).getBlocks()[ type ]
	);

	return (
		<div className="block-editor-block-controls">
			<DefaultControls
				supports={ block.supports }
				currentFormItem={ currentFormItem }
				toggleDescription={ () => {
					toggleDescription( currentBlockId, currentBlockCat );
				} }
				setAttachment={ ( val ) => {
					setBlockAttachment( currentBlockId, val, currentBlockCat );
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
						setBlockAttributes(
							currentBlockId,
							val,
							currentBlockCat
						);
					} }
				/>
			) }
		</div>
	);
};
export default BlockControls;
