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
import { memo, useState, useEffect } from 'react';
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
		index,
		disableAnimation,
		destinationIndex,
		parent,
	}) => {
		const [isMounted, setIsMounted] = useState(false);

		useEffect(() => {
			setTimeout(() => {
				setIsMounted(true);
			}, 50);
		}, []);
		const { blockType } = useSelect((select) => {
			return {
				blockType:
					select('quillForms/blocks').getBlockType(blockName),
			};
		});

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
		const { __experimentalInsertBlock, setCurrentBlock } = useDispatch(
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
			attributes: Record<string, unknown> = {}
		): FormBlock | void => {
			// Blocks are stored with a unique ID, the assigned type name, the block
			// attributes.
			return {
				id: generateBlockId(),
				name,
				attributes: sanitizeBlockAttributes(name, attributes),
			};
		};

		return (
			<div
				onClick={(e) => {
					if (disabled) return;
					e.stopPropagation();
					const blockToInsert = createBlock(blockName);
					if (blockToInsert) {
						// blockToInsert.id = generateBlockId();
						if (blockType.supports.editable)
							insertEmptyFieldAnswer(
								blockToInsert.id,
								blockName
							);
						__experimentalInsertBlock(
							blockToInsert,
							destinationIndex,
							parent
						);
						setTimeout(() => {
							if (
								!document.querySelector(
									`#block-editor-box-wrapper-${blockToInsert.id} .block-editor-block-edit`
								)
							) {
								setCurrentBlock(blockToInsert.id);
								document
									?.getElementById(
										`block-editor-box-wrapper-${blockToInsert.id}`
									)
									?.scrollIntoView({ behavior: 'smooth' });
							}
						}, 80);
					}
				}}
				className={classNames(
					'admin-components-blocks-list-item',
					css`
						&:not( .animation-disabled ) {
							opacity: 0;
							transform: translateX( -15px );
							transition: transform 0.3s ease ${index * 0.1}s,
								opacity 0.3s ease ${index * 0.1}s;

							&.mounted {
								opacity: 1;
								transform: scale( 1 );
							}
						}
						&:hover {
							background: ${tinycolor(blockType?.color)
							.setAlpha(0.1)
							.toString()};
							cursor: pointer;
						}
					`,
					{
						disabled: disabled ? true : false,
						mounted: isMounted,
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
				{(blockType?.name === 'group' || blockType?.name === 'slider') && (
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
