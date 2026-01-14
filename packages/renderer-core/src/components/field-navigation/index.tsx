/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { doAction } from '@wordpress/hooks';
/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import { useCurrentTheme, useFormContext, useFormSettings, useMessages } from '../../hooks';
import SubmitButton from '../submit-btn';
import DownIcon from './down-icon';
import UpIcon from './up-icon';
import Button from '../button';
import useCorrectIncorrectQuiz from '../../hooks/use-correct-incorrect-quiz';

const FieldNavigation = ({ shouldFooterBeDisplayed }) => {
	const {
		goNext,
		goPrev,
		setIsCurrentBlockSafeToSwipe,
		setIsFieldValid,
		setIsFieldPending,
		setFieldValidationErr,
		goToBlock,
		setCorrectIncorrectDisplay,
		setIsFieldCorrectIncorrectScreenDisplayed
	} = useDispatch('quillForms/renderer-core');
	const { beforeGoingNext } = useFormContext();
	const theme = useCurrentTheme();
	const settings = useFormSettings();
	const messages = useMessages();
	const formContext = useFormContext();
	const { editor } = formContext;
	const correctIncorrectQuiz = useCorrectIncorrectQuiz();
	const { currentBlockId, walkPath, blockTypes, correctIncorrectDisplay } = useSelect((select) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			walkPath: select('quillForms/renderer-core').getWalkPath(),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
			correctIncorrectDisplay: select('quillForms/renderer-core').getCorrectIncorrectDisplay(),
		};
	});
	if (!currentBlockId) return null;
	const currentBlockIndex = walkPath.findIndex(
		(block) => block.id === currentBlockId
	);

	const currentBlockName = walkPath[currentBlockIndex]?.name;

	const currentBlockType = blockTypes?.[currentBlockName];

	const { isCurrentBlockValid, answers, isFieldCorrectIncorrectScreenDisplayed, isLastBlock } = useSelect((select) => {
		return {
			answers: select('quillForms/renderer-core').getAnswers(),
			isCurrentBlockValid: currentBlockType?.supports?.innerBlocks
				? select('quillForms/renderer-core')?.hasValidFields(
					currentBlockId
				)
				: currentBlockType?.supports?.editable
					? select('quillForms/renderer-core')?.isValidField(
						currentBlockId
					)
					: true,
			isLastBlock: walkPath[walkPath.length - 1].id === currentBlockId,
			isFieldCorrectIncorrectScreenDisplayed: select('quillForms/renderer-core').isFieldCorrectIncorrectScreenDisplayed(currentBlockId)
		};
	});

	const goNextReally = async () => {
		if (editor.mode === 'on') return;
		if (answers[currentBlockIndex]?.isPending) return;
		if (beforeGoingNext && currentBlockId) {
			await beforeGoingNext({
				answers,
				currentBlockId,
				setIsFieldValid,
				setFieldValidationErr,
				setIsCurrentBlockSafeToSwipe,
				goToBlock,
				goNext,
				setIsPending: (val) =>
					setIsFieldPending(currentBlockId, val),
			});
		} else {
			if (correctIncorrectQuiz?.enabled &&
				correctIncorrectDisplay === false &&
				currentBlockType.supports.correctAnswers &&
				!isFieldCorrectIncorrectScreenDisplayed
			) {
				setCorrectIncorrectDisplay(true);
				setIsFieldCorrectIncorrectScreenDisplayed(currentBlockId, true);
				return;
			}
			doAction('QuillForms.RendererCore.BeforeNext', currentBlockId, formContext);
			goNext();
		}
	};

	return (
		<div
			className={classnames('renderer-core-field-navigation', {
				hidden: !shouldFooterBeDisplayed,
			})}
		>
			{settings?.navigationType === 'arrows' && (
				<>
					<div
						className={classnames(
							'renderer-core-field-navigation__up-icon',
							{
								rotate: settings?.animationDirection === 'horizontal',
							},
							css`
						background: ${theme.buttonsBgColor};
					`
						)}
						onClick={() => {
							if (editor.mode === 'on') return;
							goPrev();
						}}
					>
						<UpIcon />
					</div>
					<div
						className={classnames(
							'renderer-core-field-navigation__down-icon',
							{
								rotate: settings?.animationDirection === 'horizontal',
							},
							css`
						background: ${theme.buttonsBgColor};
					`
						)}
						onClick={() => {
							if (
								walkPath[walkPath.length - 1].id !== currentBlockId
							) {
								//console.log(isCurrentBlockValid);
								if (isCurrentBlockValid) {
									goNextReally();
								} else {
									setIsCurrentBlockSafeToSwipe(false);
								}
							}
						}}
					>
						<DownIcon />
					</div>
				</>
			)}
			{settings?.navigationType === 'buttons' && (
				<>
					<Button className="renderer-core-field-navigation__up-button" onClick={() => goPrev()}>
						{messages['label.previous']}
					</Button>
					{isLastBlock ? <SubmitButton /> : (
						<Button className="renderer-core-field-navigation__down-button" onClick={() => goNextReally()}>
							{messages['label.next']}
						</Button>
					)}
				</>
			)}
		</div>
	);
};
export default FieldNavigation;
