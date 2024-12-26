/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import BlockControlsHeader from '../block-controls-header';

/**
 * Internal Dependencies
 */
import DefaultControls from '../block-default-controls';
import { size } from 'lodash';
import { withErrorBoundary } from '@quillforms/admin-components';

const BlockControls = withErrorBoundary(() => {
	// Get the block editor dispatcher
	const { setBlockAttributes } = useDispatch('quillForms/block-editor');

	// Select necessary block editor state
	const {
		currentBlockId,
		currentChildBlockId,
		currentChildBlockIndex,
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
			currentChildBlockId: getCurrentChildBlockId(),
			currentChildBlockIndex: getCurrentChildBlockIndex(),
			currentFormBlock: getCurrentBlock(),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
		};
	});

	// Return null if no block is selected
	if (!currentBlockId || !currentFormBlock) return null;

	// Determine if the current block is a child block
	const isChildBlock = !!currentChildBlockId && currentChildBlockIndex !== undefined && size(currentFormBlock.innerBlocks) > 0;

	// Get the relevant block attributes and name
	const parentId = currentFormBlock.id;
	const activeBlock = isChildBlock
		? currentFormBlock?.innerBlocks[currentChildBlockIndex]
		: currentFormBlock;
	const { attributes, name: blockName } = activeBlock;
	const blockType = blockTypes[activeBlock.name];

	// Utility function to set attributes
	const handleSetAttributes = (val) => {
		if (isChildBlock) {
			setBlockAttributes(currentChildBlockId, val, parentId);
		} else {
			setBlockAttributes(currentBlockId, val);
		}
	};

	return (
		<div className="block-editor-block-controls">
			{/* Block Controls Header */}
			<BlockControlsHeader
				isChildBlock={isChildBlock}
				parentId={parentId}
				id={isChildBlock ? currentChildBlockId : currentBlockId}
				currentBlockName={blockName}
			/>

			{/* Default Controls */}
			<DefaultControls
				blockName={blockName}
				isChild={isChildBlock}
				attributes={attributes}
				setAttributes={handleSetAttributes}
				parentBlock={currentFormBlock}
			/>

			{/* Custom Controls (if any) */}
			{blockType?.controls && (
				<blockType.controls
					id={isChildBlock ? currentChildBlockId : currentBlockId}
					parentId={isChildBlock ? parentId : null}
					attributes={attributes}
					setAttributes={handleSetAttributes}
				/>
			)}
		</div>
	);
}, {
	title: 'Error',
	'message': 'An error occurred while rendering the block controls. Please contact Support.',
});

export default BlockControls;