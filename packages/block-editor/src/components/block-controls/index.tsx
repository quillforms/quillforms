/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import BlockControlsHeader from '../block-controls-header';

/**
 * Internal Dependencies
 */
import DefaultControls from '../block-default-controls';

const BlockControls = ({ parentId }) => {
	const { setBlockAttributes } = useDispatch('quillForms/block-editor');

	let {
		currentBlockId,
		currentChildBlockIndex,
		currentChildBlockId,
		currentFormBlock,
		blockTypes,
	} = useSelect((select) => {
		const {
			getCurrentBlockId,
			getCurrentChildBlockId,
			getCurrentChildBlockIndex,
			getCurrentBlock,
		} = select('quillForms/block-editor');
		return {
			currentBlockId: getCurrentBlockId(),
			currentChildBlockIndex: getCurrentChildBlockIndex(),
			currentChildBlockId: getCurrentChildBlockId(),
			currentFormBlock: getCurrentBlock(),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
		};
	});

	if (!currentBlockId || !currentFormBlock) return null;
	if (
		currentChildBlockId &&
		typeof currentChildBlockIndex !== 'undefined'
	) {
		currentFormBlock =
			currentFormBlock?.innerBlocks?.[currentChildBlockIndex];
		currentBlockId = currentChildBlockId;
	}
	if (!currentBlockId || !currentFormBlock) return null;

	const blockType = blockTypes[currentFormBlock.name];

	const { name } = currentFormBlock;

	return (
		<div className="block-editor-block-controls">
			<BlockControlsHeader
				id={currentBlockId}
				blockName={currentFormBlock.name}
			/>
			<DefaultControls
				blockName={name}
				parentId={parentId}
				attributes={currentFormBlock.attributes}
				setAttributes={(val) => {
					if (currentBlockId)
						setBlockAttributes(currentBlockId, val, parentId);
				}}
			/>
			{blockType?.controls && (
				<blockType.controls
					id={currentBlockId}
					// @ts-expect-error
					parentId={parentId}
					attributes={currentFormBlock.attributes}
					setAttributes={(val) => {
						if (currentBlockId)
							setBlockAttributes(currentBlockId, val, parentId);
					}}
				/>
			)}
		</div>
	);
};
export default BlockControls;
