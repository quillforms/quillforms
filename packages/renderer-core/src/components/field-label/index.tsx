/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
import { __experimentalUseFieldRenderContext } from '../field-render/context';
import useBlockTheme from '../../hooks/use-block-theme';
import { useBlockTypes, useFormContext, useFormSettings } from '../../hooks';
import BlockCounter from '../field-counter';
import { size } from 'lodash';
import { removep } from '@wordpress/autop';

const BlockLabel: React.FC = () => {
	const formSettings = useFormSettings();
	const FormContext = useFormContext();
	const { editor } = FormContext;
	const { attributes, id, blockName } = __experimentalUseFieldRenderContext();
	const blockTypes = useBlockTypes();
	// @ts-ignore
	const blockType = blockTypes[blockName];
	let label = '...';
	if (attributes?.label) label = attributes.label;
	if (attributes?.required && !formSettings?.disableAstreisksOnRequiredFields) label = label + ' *';
	label = label.replace("</p> *", " * </p>")
	const theme = useBlockTheme(attributes?.themeId);
	const align = attributes?.align;
	return (
		<div
			className={classnames(
				'renderer-components-block-label',
				css`
					${align === 'center' && `
						display: flex;
						align-items: flex-start;
						gap: 7px;

						${size(removep(attributes?.label ?? '')) < 1 && `
							> div:not(.renderer-components-block-label__counter) {
								flex: 1 1 100% !important;
							}
						`}
					`}
					color: ${theme.questionsColor} !important;
					font-family: ${theme.questionsLabelFont} !important;
					@media ( min-width: 768px ) {
						font-size: ${theme.questionsLabelFontSize
						.lg} !important;
						line-height: ${theme.questionsLabelLineHeight
						.lg} !important;
					}
					@media ( max-width: 767px ) {
						font-size: ${theme.questionsLabelFontSize
						.sm} !important;
						line-height: ${theme.questionsLabelLineHeight
						.sm} !important;
					}
				`
			)}
		>
			{align === 'center' && (
				<div className="renderer-components-block-label__counter">
					<BlockCounter
						id={id}
						attributes={attributes}
						blockType={blockType}
					/>
				</div>
			)}
			{editor?.mode === 'on' ? <editor.editLabel /> : <HtmlParser value={label} />}
		</div>
	);
};
export default BlockLabel;
