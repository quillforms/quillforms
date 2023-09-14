/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import { __experimentalUseFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import BlockFooter from '../field-footer';
import useFormContext from '../../hooks/use-form-context';
import useHandleFocus from '../../hooks/use-handle-focus';
import useBlockTheme from '../../hooks/use-block-theme';
import { useCorrectIncorrectQuiz, useMessages } from '../../hooks';
import tinyColor from 'tinycolor2';
import classnames from "classnames";
interface Props {
	setIsShaking: (value: boolean) => void;
	isShaking: boolean;
}
let timer1: ReturnType<typeof setTimeout>,
	timer2: ReturnType<typeof setTimeout>;

const FieldDisplayWrapper: React.FC<Props> = ({
	isShaking,
	setIsShaking,
}) => {
	const inputRef = useRef(null);
	const {
		id,
		next,
		blockName,
		isActive,
		attributes,
		showNextBtn,
		showErrMsg,
		innerBlocks,
	} = __experimentalUseFieldRenderContext();
	const theme = useBlockTheme(attributes?.themeId);
	const correctIncorrectQuiz = useCorrectIncorrectQuiz();

	const isTouchScreen =
		(typeof window !== 'undefined' && 'ontouchstart' in window) ||
		(typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
		// @ts-expect-error
		(typeof navigator !== 'undefined' && navigator.msMaxTouchPoints > 0);

	useHandleFocus(inputRef, isActive, isTouchScreen);
	const { isPreview, formId } = useFormContext();

	if (!blockName || !id) return null;
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[blockName];
	const [shakingErr, setShakingErr] = useState(null);
	const messages = useMessages();
	const { isCurrentBlockEditable, isReviewing } = useSelect((select) => {
		return {
			isCurrentBlockEditable: select(
				'quillForms/blocks'
			).hasBlockSupport(blockName, 'editable'),
			isReviewing: select('quillForms/renderer-core').isReviewing(),
		};
	});
	const { answerValue, isAnswered, isValid, isPending, isAnswerLocked } = useSelect(
		(select) => {
			return {
				answerValue: isCurrentBlockEditable
					? select('quillForms/renderer-core').getFieldAnswerVal(
						id
					)
					: null,
				isAnswered: isCurrentBlockEditable
					? select('quillForms/renderer-core').isAnsweredField(id)
					: null,
				isValid: isCurrentBlockEditable
					? select('quillForms/renderer-core').isValidField(id)
					: null,
				isPending: select('quillForms/renderer-core').isFieldPending(
					id
				),
				isAnswerLocked: select('quillForms/renderer-core').isFieldAnswerLocked(id)
			};
		}
	);

	const clearTimers = () => {
		clearTimeout(timer1);
		clearTimeout(timer2);
	};

	useEffect(() => {
		clearTimers();
		setIsShaking(false);
		if (shakingErr) setShakingErr(null);
	}, [answerValue]);

	useEffect(() => {
		if (!isActive) {
			clearTimers();
			setIsShaking(false);
			if (shakingErr) setShakingErr(null);
		}

		if (isActive) {
			setFooterDisplay(true);
		}
	}, [isActive]);

	const shakeWithError = (err) => {
		clearTimers();
		if (!isShaking) setIsShaking(true);
		if (!shakingErr) setShakingErr(err);
		timer1 = setTimeout(() => {
			setIsShaking(false);
		}, 600);
		timer2 = setTimeout(() => {
			setShakingErr(null);
		}, 1200);
	};

	useEffect(() => {
		if (isAnswered) {
			const action = isActive
				? 'QuillForms.RendererCore.FieldAnsweredActive'
				: 'QuillForms.RendererCore.FieldAnswered';
			doAction(action, {
				formId,
				id,
				label: attributes?.label,
			});
		}
	}, [isAnswered, isActive]);

	useEffect(() => {
		if (isActive) {
			doAction('QuillForms.RendererCore.FieldActive', {
				formId,
				id,
				label: attributes?.label,
			});
		}
	}, [isActive]);

	const {
		setIsFieldValid,
		setFieldValidationErr,
		setIsFieldAnswered,
		setIsFieldPending,
		setFieldPendingMsg,
		setIsFieldAnswerCorrect,
		setFieldAnswer,
		setFooterDisplay,
	} = useDispatch('quillForms/renderer-core');

	const props = {
		id,
		next,
		attributes,
		isValid,
		isPending,
		innerBlocks,
		isReviewing,
		isAnswerLocked,
		val: answerValue,
		setIsValid: (val: boolean) => setIsFieldValid(id, val),
		setIsAnswered: (val: boolean) => setIsFieldAnswered(id, val),
		setIsPending: (val: boolean) => setIsFieldPending(id, val),
		setPendingMsg: (val: string) => setFieldPendingMsg(id, val),
		setValidationErr: (val: string) => setFieldValidationErr(id, val),
		setIsAnswerCorrect: (val: boolean) => setIsFieldAnswerCorrect(id, val),
		setVal: (val: string) => setFieldAnswer(id, val),
		showNextBtn,
		blockWithError: (err: string) => shakeWithError(err),
		showErrMsg,
		isPreview,
		isTouchScreen,
		inputRef,
		setFooterDisplay,
		formId,
	};

	return (
		<div
			role="presentation"
			className="renderer-core-field-display-wrapper"
		>
			{blockType?.display && (
				<div
					className={css`
						@media ( max-width: 767px ) {
							margin-top: ${theme.typographyPreset === 'sm'
							? `24px`
							: `32px`};
						}

						@media ( min-width: 768px ) {
							margin-top: ${theme.typographyPreset === 'sm'
							? `24px`
							: theme.typographyPreset === 'lg'
								? `40px`
								: `32px`};
						}
					` }
				>
					{
						/* @ts-expect-error */
						<blockType.display {...props} />


					}
					<>
						{isAnswerLocked && correctIncorrectQuiz?.enabled && correctIncorrectQuiz?.questions?.[id]?.explanation?.trim() && (
							<div className={classnames("renderer-core-field-display-wrapper__explanation", css`
							
								background-color: ${tinyColor(theme.questionsColor).setAlpha(0.1).toString()};
								color: ${theme.questionsColor};
								padding: 16px;
								margin-top: 16px;
								border-radius: 4px;
								border: 1px solid ${tinyColor(theme.questionsColor).setAlpha(0.2).toString()};
							`)}>
								<div className={classnames("renderer-core-field-display-wrapper__explanation__heading", css`
									margin-bottom: 15px;
								`)}>
									<strong>{messages['label.answersExplanation']}</strong>
								</div>
								{correctIncorrectQuiz?.questions[id].explanation}
							</div>

						)}
					</>

				</div>

			)}
			<BlockFooter shakingErr={shakingErr} isPending={isPending} />
		</div>
	);
};
export default FieldDisplayWrapper;
