/**
 * QuillForms Dependencies
 */
import { BlockIconBox, SelectControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { memo } from 'react';

/**
 * External Dependencies
 */
import { css } from 'emotion';

interface Props {
	id: string;
	isChildBlock: boolean;
	currentBlockName: string;
	parentId: string;
}

const BlockControlsHeader: React.FC<Props> = memo(({ id, currentBlockName, isChildBlock, parentId }) => {

	const { blockTypes, welcomeScreensLength } = useSelect((select) => {
		return {
			blockOrder: select('quillForms/block-editor').getBlockOrderById(id),
			currentBlockType: select('quillForms/blocks').getBlockType(currentBlockName),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
			welcomeScreensLength: select('quillForms/block-editor').getWelcomeScreensLength(),
		};
	});
	if (currentBlockName === 'group') {
		return (
			<div className="block-editor-block-controls-header">
				<div className={css`
						background: #fff;
						border-radius: 5px;
						border: 1px solid #e3e3e3;
						font-size: 14px;
						width: 100%;
						height: 45px;
						display: inline-flex;
						padding: 16px;
						justify-content: space-between;
				`}>
					<div className="block-controls-blocktype-select">
						<BlockIconBox
							icon={blockTypes['group']?.icon}
							color={blockTypes['group']?.color}
						/>
						<span>Group</span>
					</div>

				</div>
			</div>
		)
	}


	const { replaceBlockName } = useDispatch('quillForms/block-editor');

	const blockTypesOptions = Object.keys(blockTypes)
		.filter(($blockName) => {
			// Always include current block type
			if ($blockName === currentBlockName) {
				return true;
			}

			// Exclude specific blocks
			const excludedBlocks = ['partial-submission-point', 'group'];
			if (welcomeScreensLength > 0 || isChildBlock) {
				excludedBlocks.push('welcome-screen');
			}
			if (isChildBlock) {
				excludedBlocks.push('thankyou-screen');
			}
			if (excludedBlocks.includes($blockName)) {
				return false;
			}

			return true; // Include all other blocks
		})
		.map(($blockName) => ({
			key: $blockName,
			name: (
				<div className="block-controls-blocktype-select">
					<BlockIconBox
						icon={blockTypes[$blockName]?.icon}
						color={blockTypes[$blockName]?.color}
					/>
					<span>{blockTypes[$blockName].title}</span>
				</div>
			),
		}));

	return (
		<div className="block-editor-block-controls-header">
			<SelectControl
				value={
					blockTypesOptions.find((option) => option.key === currentBlockName)
				}
				options={blockTypesOptions}
				onChange={({ selectedItem }) => {
					if (selectedItem) {
						if (isChildBlock) {
							replaceBlockName(id, selectedItem.key, parentId);
						} else {
							replaceBlockName(id, selectedItem.key);
						}
					}

				}}


			/>

		</div>
	);
});

export default BlockControlsHeader;