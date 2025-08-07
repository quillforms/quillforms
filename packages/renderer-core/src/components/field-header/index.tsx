/**
 * WordPresss Dependencies
 */
import { memo } from '@wordpress/element';
/**
 * External Dependencies
 */
import { css } from 'emotion';
import classNames from 'classnames';
/**
 * Internal Dependencies
 */
import BlockCounter from '../field-counter';
import BlockTitle from '../field-label';
import BlockDescription from '../field-description';
import BlockAttachment from '../field-attachment';
import BlockCustomHTML from '../field-custom-html';
import { __experimentalUseFieldRenderContext } from '../field-render';
import { useMediaQuery } from "@uidotdev/usehooks";
import { useBlockTypes, useFormContext, useFormSettings } from '../../hooks';
import { removep } from '@wordpress/autop';
import { size } from 'lodash';

// Add this function for alignment styles
const getAlignmentStyles = (align) => {
	switch (align) {
		case 'left':
			return {
				textAlign: 'left',
				alignItems: 'flex-start',
			};
		case 'right':
			return {
				textAlign: 'right',
				alignItems: 'flex-end',
			};
		case 'center':
		default:
			return {
				textAlign: 'center',
				alignItems: 'center',
			};
	}
};

const QuestionHeader: React.FC = memo(() => {
	const { blockName, id, attributes } = __experimentalUseFieldRenderContext();
	const { editor } = useFormContext();
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	const blockTypes = useBlockTypes();
	const showQuestionsNumbers =
		useFormSettings()?.showQuestionsNumbers ?? true;

	if (!blockName || !id) return null;

	const blockType = blockTypes[blockName];
	const layout = isSmallDevice ? 'stack' : attributes?.layout ?? 'stack';

	// Get alignment value from attributes
	const align = attributes?.align ?? 'center';
	const alignmentStyles = getAlignmentStyles(align);

	const showCounter = showQuestionsNumbers || blockType?.counterIcon;

	return (
		<div
			className={classNames(
				"renderer-components-question-header",
				`renderer-components-question-header--${align}`,
				css`
					/* Apply alignment styles */
					text-align: ${alignmentStyles.textAlign};
					width: 100%;
					position: relative;
					
					/* Ensure all child components inherit the alignment */
					.renderer-components-field-label,
					.renderer-components-field-description,
					.renderer-components-field-attachment,
					.renderer-components-field-custom-html {
						text-align: inherit;
					}
					
					/* Create a content wrapper for center alignment */
					${align === 'center' && showCounter && `
						.renderer-components-question-header__content {
							display: flex;
							align-items: flex-start;
							justify-content: center;
							width: 100%;							
							@media (max-width: 767px) {
							}
						}
						
						.renderer-components-block-counter {
							flex-shrink: 0;
							position: static;
						}
						
						.renderer-components-question-header__text-content {
							flex: 1;
							max-width: 700px;
						}
					`}
					
					/* Standard positioning for left alignment */
					${align === 'left' && `
						.renderer-components-block-counter {
							position: absolute;
							right: 100%;
							margin-right: 16px;
							top: 0;
							@media (max-width: 767px) {
								margin-right: 7px;
							}
						}
					`}
					
					/* Flipped positioning for right alignment */
					${align === 'right' && `
						.renderer-components-block-counter {
							position: absolute;
							left: 100%;
							margin-left: 16px;
							top: 0;
							@media (max-width: 767px) {
								margin-left: 7px;
							}
							
							/* Flip the content order for right alignment */
							flex-direction: row-reverse;
							
							.renderer-components-block-counter__value {
								margin-right: 0;
								margin-left: 3px;
							}
						}
					`}
					
					/* Ensure attachment respects alignment in stack layout */
					${layout === 'stack' && `
						.renderer-components-field-attachment {
							align-self: ${alignmentStyles.alignItems};
						}
					`}
				`
			)}
			onClick={() => {
				if (editor.mode === 'on' && editor.onClick)
					editor.onClick(id)
			}}
		>
			{align === 'center' && showCounter ? (
				// Special layout for center alignment
				<div className="renderer-components-question-header__content">
					{align !== 'center' && (

						<BlockCounter
							id={id}
							attributes={attributes}
							blockType={blockType}
						/>
					)}
					<div className={classNames(`renderer-components-question-header__text-content`,
						css`
							${size(removep(attributes?.label ?? '')) < 1 && `
								flex: 1 1 100% !important;
							`}
						`
					)}>

						<BlockTitle />
						<BlockDescription />
						{(layout === 'stack' && <BlockAttachment />)}
						<BlockCustomHTML />
					</div>
				</div>
			) : (
				// Standard layout for left/right alignment
				<>
					{showCounter && (
						<BlockCounter
							id={id}
							attributes={attributes}
							blockType={blockType}
						/>
					)}
					<BlockTitle />
					<BlockDescription />
					{(layout === 'stack' && <BlockAttachment />)}
					<BlockCustomHTML />
				</>
			)}
		</div>
	);
});

export default QuestionHeader;