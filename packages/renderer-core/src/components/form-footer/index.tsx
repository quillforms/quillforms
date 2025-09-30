/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';

/**
 *
 * External Dependencies
 */
import classnames from 'classnames';
import FieldNavigation from '../field-navigation';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';
import SaveBtn from '../save-btn';
import { useCurrentTheme, useFormContext, useMessages } from '../../hooks';
import { random } from 'lodash';

const FormFooter: React.FC = memo(() => {
	const theme = useCurrentTheme();
	const { formObj, editor } = useFormContext();
	const messages = useMessages();
	const {
		currentBlockId,
		isWelcomeScreenActive,
		isThankyouScreenActive,
		shouldFooterBeDisplayed,
		correctIncorrectDisplay,
		isFieldActionSticky,
	} = useSelect((select) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			isThankyouScreenActive: select(
				'quillForms/renderer-core'
			).isThankyouScreenActive(),
			isWelcomeScreenActive: select(
				'quillForms/renderer-core'
			).isWelcomeScreenActive(),
			shouldFooterBeDisplayed: select(
				'quillForms/renderer-core'
			).shouldFooterBeDisplayed(),
			correctIncorrectDisplay: select(
				'quillForms/renderer-core'
			).getCorrectIncorrectDisplay(),
			isFieldActionSticky: select(
				'quillForms/renderer-core'
			).getIsFieldActionSticky(),
		};
	});

	const { isCurrentFieldAnswerCorrect } = useSelect((select) => {
		return {
			isCurrentFieldAnswerCorrect: select(
				'quillForms/renderer-core'
			)?.isFieldAnswerCorrect(currentBlockId || ''),
		};
	});

	if (!currentBlockId || editor.mode === 'on') return null;
	return (
		<div
			className={classnames(
				'renderer-components-form-footer',
				{
					hidden: isWelcomeScreenActive || isThankyouScreenActive,
				},
				css`
					z-index: ${isFieldActionSticky ? '999' : '99999999999999999'};
					@media ( max-width: 767px ) {
						background: ${theme.formFooterBgColor.sm} !important;
					}
				`
			)}
			tabIndex={-1}
		>
			<div className="renderer-components-form-footer__inner">
				<SaveBtn />
				{!formObj?.settings?.disableProgressBar && <ProgressBar />}
				{!formObj?.settings?.disableNavigationArrows && (
					<FieldNavigation
						shouldFooterBeDisplayed={shouldFooterBeDisplayed}
					/>
				)}
				{formObj?.settings?.displayBranding && (
					<div
						className={classnames(
							`renderer-core-powered-by-branding-${random(
								100
							)}`,
							css`
								display: block !important;
								visibility: visible !important;

								a {
									display: block !important;
									visibility: visible !important;
								}
							`
						)}
					>
						<a
							className={css`
								background: ${theme.buttonsBgColor} !important;
								color: ${theme.buttonsFontColor} !important;
								box-shadow: none !important;
								text-decoration: none !important;
								padding: 5px 8px;
								font-size: 14px;
								outline: none !important;
								z-index: 1;
								border-radius: 5px;
							` }
							href="https://quillforms.com"
							target="_blank"
						>
							Powered By Quill Forms
						</a>
					</div>
				)}
				{editor.mode === 'off' && formObj.correctIncorrectQuiz?.enabled && (
					< div
						className={classnames(
							`renderer-core-correct-incorrect-result`,
							{
								active: correctIncorrectDisplay,
							},
							css`
							z-index: 999999999;
							color: #fff;
							background: ${isCurrentFieldAnswerCorrect
									? '#5bc68a'
									: '#d93148'};
						`
						)}
					>
						{isCurrentFieldAnswerCorrect
							? messages['label.correct']
							: messages['label.incorrect']}
					</div>
				)}
			</div>
		</div >
	);
});
export default FormFooter;
