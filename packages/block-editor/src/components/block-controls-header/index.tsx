/**
 * QuillForms Dependencies
 */
import { BlockIconBox, SelectControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { memo } from 'react';

/**
 * External Dependencies
 */
import { FormBlock } from '@quillforms/types';

interface Props {
	id: string;
	isChildBlock: boolean;
	currentBlockName: string;
	parentId: string;
	parentBlock: FormBlock;
}

const BlockControlsHeader: React.FC<Props> = memo(({ id, currentBlockName, isChildBlock, parentId, parentBlock }) => {

	const { blockTypes, welcomeScreensLength } = useSelect((select) => {
		return {
			blockOrder: select('quillForms/block-editor').getBlockOrderById(id),
			currentBlockType: select('quillForms/blocks').getBlockType(currentBlockName),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
			welcomeScreensLength: select('quillForms/block-editor').getWelcomeScreensLength(),
		};
	});
	if (isChildBlock && parentBlock?.name === 'address') {
		return <></>
	}
	if (currentBlockName === 'group' || currentBlockName === 'address') {
		return (
			<div className="block-editor-block-controls-header">
				<div className="block-editor-block-controls-header__type-field">
					<span className="block-editor-block-controls-header__type-label">
						{__('Type of question', 'quillforms')}
					</span>
					<div className="block-editor-block-controls-header__static-type-row">
						<div className="block-controls-blocktype-select">
							<BlockIconBox
								icon={blockTypes[currentBlockName]?.icon}
								color={blockTypes[currentBlockName]?.color}
							/>
							<span>
								{currentBlockName === 'group'
									? __('Group', 'quillforms')
									: __('Address', 'quillforms')}
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}


	const { replaceBlockName } = useDispatch('quillForms/block-editor');

	const blockTypesOptions = Object.keys(blockTypes)
		.filter(($blockName) => {
			// Always include current block type
			if ($blockName === currentBlockName) {
				return true;
			}

			// Exclude specific blocks
			const excludedBlocks = ['partial-submission-point', 'group', 'address', 'autocomplete-address'];
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
			<div className="block-editor-block-controls-header__type-field">
				<span className="block-editor-block-controls-header__type-label">
					{__('Type of question', 'quillforms')}
				</span>
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
		</div>
	);
});

export default BlockControlsHeader;