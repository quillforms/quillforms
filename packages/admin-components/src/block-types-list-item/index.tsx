/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * QuillForms Dependencies
 */
import type {
	IconDescriptor,
	FormBlock,
	Icon as IconType,
} from '@quillforms/types';
import { sanitizeBlockAttributes } from '@quillforms/blocks';

/**
 * WordPress Dependencies
 */
import { memo, useState, useEffect, useCallback } from 'react';
// @ts-expect-error
import { Icon, Dashicon } from '@wordpress/components';
import { blockDefault, plus } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { FC } from 'react';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { css } from 'emotion';
import tinycolor from 'tinycolor2';
import { findIndex } from 'lodash';

const areEqual = (prevProps: Props, nextProps: Props): boolean => {
	if (prevProps.disabled === nextProps.disabled) return true;
	return false;
};
interface Props {
	disabled: boolean;
	blockName: string;
	index: number;
	disableAnimation?: boolean;
	destinationIndex: number;
	parent?: string;
}
const BlockTypesListItem: FC<Props> = memo(
	({
		disabled,
		blockName,
		disableAnimation,
	}) => {
		const { formBlocks, currentBlockId, currentChildBlockId, currentBlockIndex } = useSelect((select) => {
			return {
				formBlocks: select('quillForms/block-editor').getBlocks(true),
				currentBlockId: select('quillForms/block-editor').getCurrentBlockId(),
				currentChildBlockId: select('quillForms/block-editor').getCurrentChildBlockId(),
				currentBlockIndex: select('quillForms/block-editor').getCurrentBlockIndex(),
			};
		}
		);
		let currentChildBlockIndex = -1;
		if (currentChildBlockId && currentBlockId && currentBlockIndex > -1 && formBlocks[currentBlockIndex]?.innerBlocks) {
			currentChildBlockIndex = findIndex(formBlocks[currentBlockIndex].innerBlocks, {
				id: currentChildBlockId,
			});
		}
		const { blockType } = useSelect((select) => {
			return {
				blockType:
					select('quillForms/blocks').getBlockType(blockName),
			};
		});

		const { setCurrentPanel } = useDispatch('quillForms/builder-panels');

		if (!blockType) return null;
		let { icon } = blockType;
		if ((icon as IconDescriptor)?.src === 'block-default') {
			icon = {
				src: blockDefault,
			};
		}
		if (!icon) icon = plus;
		const renderedIcon = (
			<Icon
				icon={
					((icon as IconDescriptor).src as IconType)
						? ((icon as IconDescriptor).src as IconType)
						// @ts-expect-error
						: (icon as Dashicon.Icon)
				}
			/>
		);
		const { insertEmptyFieldAnswer } = useDispatch(
			'quillForms/renderer-core'
		);
		const { __experimentalInsertBlock, setCurrentBlock, setCurrentChildBlock } = useDispatch(
			'quillForms/block-editor'
		);
		const generateBlockId = (): string => {
			return Math.random().toString(36).substr(2, 9);
		};

		/**
		 * Returns a block object given its type and attributes.
		 *
		 * @param {string} name       Block name.
		 * @param {Object} attributes Block attributes.
		 *
		 * @throws {Error} If the block type isn't registered.
		 * @return {Object?} Block object.
		 */
		const createBlock = (
			name: string,
			attributes: Record<string, unknown> = {},
			forceId: string = ''
		): FormBlock | void => {
			// Blocks are stored with a unique ID, the assigned type name, the block
			// attributes.

			let createdBlock = {
				id: forceId ? forceId : name === 'partial-submission-point' ? 'partial-submission-point' : generateBlockId(),
				name,
				attributes: sanitizeBlockAttributes(name, attributes),
			};

			if (name === 'group') {
				createdBlock.innerBlocks = [createBlock('short-text', {})]
			}

			if (name === "address") {
				createdBlock.innerBlocks = [
					createBlock('autocomplete-address', {
						label: 'Address',
						placeholder: 'Enter your address',
					},
						createdBlock.id + '-address'
					),
					createBlock('short-text', {
						label: 'Address Line 2',
						placeholder: 'Address Line 2',
					},
						createdBlock.id + '-address-line-2'
					),
					createBlock('short-text', {
						label: 'City',
						placeholder: 'City',
					},
						createdBlock.id + '-city'
					),
					createBlock('short-text', {
						label: 'State',
						placeholder: 'State',
					},
						createdBlock.id + '-state'
					),
					createBlock('short-text', {
						label: 'Postal Code',
						placeholder: 'Postal Code',
					},
						createdBlock.id + '-postal-code'
					),
					createBlock('short-text', {
						label: 'Country',
						placeholder: 'Country',
					},
						createdBlock.id + '-country'
					),
				]
			}

			return createdBlock;
		};

		const nonChildBlocks = ['welcome-screen', 'thankyou-screen', 'partial-submission-point', 'group', 'address'];


		const handleBlockInsertion = useCallback((blockToInsert) => {
			setTimeout(() => {
				if (currentChildBlockIndex > -1 && !nonChildBlocks.includes(blockName)) {
					setCurrentChildBlock(blockToInsert.id);
				} else {
					setCurrentBlock(blockToInsert.id);
				}
			}, 80);
		}, [currentChildBlockIndex, blockName, setCurrentChildBlock, setCurrentBlock]);

		// const for blocks that couldn't be children
		return (
			<div
				onClick={(e) => {
					if (disabled) return;
					e.stopPropagation();
					const blockToInsert = createBlock(blockName);
					if (blockToInsert) {
						// blockToInsert.id = generateBlockId();
						if (blockType.supports.editable) {
							insertEmptyFieldAnswer(
								blockToInsert.id,
								blockName
							);
						}
						__experimentalInsertBlock(
							blockToInsert,
							currentChildBlockIndex > -1 && !nonChildBlocks.includes(blockName) ? currentChildBlockIndex + 1 : currentBlockIndex + 1,
							currentChildBlockIndex > -1 && !nonChildBlocks.includes(blockName) ? currentBlockId : undefined
						);
						setCurrentPanel('');
						handleBlockInsertion(blockToInsert);
					}
				}}
				className={classNames(
					'admin-components-blocks-list-item',
					css`
						&:hover {
							background: ${tinycolor(blockType?.color)
							.setAlpha(0.4)
							.toString()};
							cursor: pointer;
						}
					`,
					{
						disabled: disabled ? true : false,
						'animation-disabled': disableAnimation,
					}
				)}
			>
				<span
					className="admin-components-blocks-list-item__icon-wrapper"
					style={{
						backgroundColor: blockType?.color
							? blockType.color
							: '#bb426f',
					}}
				>
					<span className="admin-components-blocks-list-item__icon">
						{renderedIcon}
					</span>
				</span>
				<span className="admin-components-blocks-list-item__block-name">
					{blockType?.title}
				</span>
				{blockType?.name === 'partial-submission-point' || blockType?.name === 'auto-complete-address' || blockType?.name === 'quill-booking' && (
					<div className="admin-components-control-label__new-feature">
						NEW
					</div>
				)}
			</div>
		);
	},
	areEqual
);

export default BlockTypesListItem;
