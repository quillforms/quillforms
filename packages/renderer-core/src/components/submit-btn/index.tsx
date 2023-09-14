/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { TailSpin as Loader } from 'react-loader-spinner';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import Button from '../button';
import HTMLParser from '../html-parser';
import { useBlockTheme, useFormContext, useMessages } from '../../hooks';
import { __experimentalUseFieldRenderContext } from '../field-render';

const SubmitBtn: React.FC = () => {
	const messages = useMessages();
	const [active, setActive] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setActive(true);
		}, 100);
	});
	const { isLastField, isActive, attributes } =
		__experimentalUseFieldRenderContext();
	const theme = useBlockTheme(attributes?.themeId);
	const isTouchScreen =
		(typeof window !== 'undefined' && 'ontouchstart' in window) ||
		(typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
		// @ts-expect-error
		(typeof navigator !== 'undefined' && navigator.msMaxTouchPoints > 0);
	const {
		goToBlock,
		goNext,
		setIsReviewing,
		setIsSubmitting,
		setIsFieldValid,
		setFieldValidationErr,
		setSubmissionErr,
		completeForm,
		setIsCurrentBlockSafeToSwipe,
		setIsFieldPending,
	} = useDispatch('quillForms/renderer-core');
	const { onSubmit, beforeGoingNext } = useFormContext();
	const [isWaitingPending, setIsWaitingPending] = useState(false);

	const {
		answers,
		firstInvalidFieldId,
		pendingMsg,
		isSubmitting,
		submissionErr,
		currentBlockId,
	} = useSelect((select) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			answers: select('quillForms/renderer-core').getAnswers(),
			pendingMsg: select('quillForms/renderer-core').getPendingMsg(),
			isSubmitting: select('quillForms/renderer-core').isSubmitting(),
			firstInvalidFieldId: select(
				'quillForms/renderer-core'
			).getFirstInvalidFieldId(),
			submissionErr: select(
				'quillForms/renderer-core'
			).getSubmissionErr(),
		};
	});


	if (!currentBlockId) return null;

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !isTouchScreen) {
			submitHandler();
		}
	};

	const goToFirstInvalidField = () => {
		if (firstInvalidFieldId) goToBlock(firstInvalidFieldId);
	};
	useEffect(() => {
		if (isLastField && isActive) {
			setIsReviewing(false);
			window.addEventListener('keydown', handleKeyDown);
		} else {
			removeEventListener('keydown', handleKeyDown);
		}

		return () => removeEventListener('keydown', handleKeyDown);
	}, [isLastField, isActive]);

	const submitHandler = async () => {
		if (isSubmitting) return;
		if (beforeGoingNext && currentBlockId) {
			await beforeGoingNext({
				answers,
				setIsFieldValid,
				setFieldValidationErr,
				goToBlock,
				currentBlockId,
				goNext,
				setIsCurrentBlockSafeToSwipe,
				setIsPending: (val) =>
					setIsFieldPending(currentBlockId, val),
			});
		}
		if (pendingMsg === false) {
			reviewAndSubmit();
		} else {
			setIsWaitingPending(true);
		}
	};

	const reviewAndSubmit = () => {
		setIsReviewing(false);
		if (firstInvalidFieldId) {
			setTimeout(() => {
				setIsReviewing(true);
			}, 50);

			setTimeout(() => {
				goToFirstInvalidField();
			}, 100);
		} else {
			setIsSubmitting(true);
			onSubmit(
				{ answers },
				{
					setIsSubmitting,
					setIsFieldValid,
					setFieldValidationErr,
					setIsReviewing,
					goToBlock,
					completeForm,
					setSubmissionErr,
					setIsPending: (val) =>
						setIsFieldPending(currentBlockId, val),
				}
			);
		}
	};

	useEffect(() => {
		if (isWaitingPending && pendingMsg === false) {
			setIsWaitingPending(false);
			reviewAndSubmit();
		}
	}, [isWaitingPending, pendingMsg]);

	return (
		<div className={classNames("renderer-core-submit-btn-wrapper", {
			active
		},
			css`
			opacity: 0;
			transform: translateY(20px);
			transition: all 0.4s ease;
			&.active {
				opacity: 1;
				transform: translateY(0);
			}
		`)}>
			<Button
				className="renderer-core-submit-btn"
				onClick={() => {
					if (!isSubmitting) submitHandler();
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.stopPropagation();
						if (!isSubmitting) submitHandler();
					}
				}}
				theme={theme}
			>
				<HTMLParser
					value={
						isWaitingPending
							? pendingMsg
								? pendingMsg
								: ''
							: messages['label.submitBtn']
					}
				/>
				{(isWaitingPending || isSubmitting) && (
					<Loader
						wrapperClass="renderer-core-submit-btn__loader"
						color="#fff"
						height={20}
						width={20}
					/>
				)}
			</Button>
			{submissionErr && (
				<div
					className={classNames(
						'renderer-core-submit-error',
						css`
							color: ${theme.questionsColor};
							margin-top: 15px;
						`
					)}
				>
					{submissionErr}
				</div>
			)}
		</div>
	);
};
export default SubmitBtn;
