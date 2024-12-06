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
import { useFormContext, useFormSettings } from '../../hooks';

const BlockLabel: React.FC = () => {
	const formSettings = useFormSettings();
	const FormContext = useFormContext();
	const { editor } = FormContext;
	const { attributes } = __experimentalUseFieldRenderContext();
	let label = '...';
	if (attributes?.label) label = attributes.label;
	if (attributes?.required && !formSettings?.disableAstreisksOnRequiredFields) label = label + ' *';
	label = label.replace("</p> *", " * </p>")
	const theme = useBlockTheme(attributes?.themeId);
	return (
		<div
			className={classnames(
				'renderer-components-block-label',
				css`
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
			{editor?.mode === 'on' ? <editor.editLabel /> : <HtmlParser value={label} />}
		</div>
	);
};
export default BlockLabel;
