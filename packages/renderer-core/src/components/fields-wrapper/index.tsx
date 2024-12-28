/* eslint-disable no-nested-ternary */
/**
 * Wordpress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import { Lethargy } from 'lethargy';
import type React from 'react';
import Cookies from 'js-cookie';

/**
 * Internal Dependencies
 */
import FieldRender from '../field-render';
import {
	useBlocks,
	useBlockTypes,
	useFormSettings,
	useLogic,
	useHiddenFields,
	useFormContext,
	useEditableFields,
} from '../../hooks';
import useCorrectIncorrectQuiz from '../../hooks/use-correct-incorrect-quiz';

let lastScrollDate = 0;
const lethargy = new Lethargy();

interface Props {
	applyLogic: boolean;
	isActive: boolean;
}

const FieldsWrapper: React.FC<Props> = ({ applyLogic, isActive }) => {
	const formContext = useFormContext();
	const { beforeGoingNext, isPreview, formId, formObj, editor, onPartialSubmit } = formContext;
	const blocks = useBlocks();
	const blockTypes = useBlockTypes();
	const logic = useLogic();
	const hiddenFields = useHiddenFields();
	const correctIncorrectQuiz = useCorrectIncorrectQuiz();
	const settings = useFormSettings();
	// @ts-ignore saveandcontinue is a property of formObj.
	const { saveandcontinue = {} } = formObj;
	// @ts-ignore saved_data is a property of formObj.
	const { saved_data = {} } = formObj;
	const editableFields = useEditableFields(true);

	const ref = useRef<HTMLDivElement | null>(null);
	const { swiper } = useSelect((select) => {
		return {
			swiper: select('quillForms/renderer-core').getSwiperState(),
		};
	});

	const {
		walkPath,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		lastActiveBlockId,
		canSwipeNext,
		canSwipePrev,
		isAnimating,
		isCurrentBlockSafeToSwipe,
	} = swiper;

	const { answers } = useSelect((select) => {
		return {
			answers: select('quillForms/renderer-core').getAnswers(),
		};
	});
	const currentBlockIndex = walkPath.findIndex(
		(block) => block.id === currentBlockId
	);

	const { nextBlock } = useSelect((select) => {
		return {
			nextBlock: nextBlockId
				? select('quillForms/renderer-core').getBlockById(
					nextBlockId
				)
				: undefined,
		};
	});
	const currentBlockName = walkPath[currentBlockIndex]?.name;

	const currentBlockType = blockTypes?.[currentBlockName];

	const lastActiveBlockIndex = walkPath.findIndex(
		(block) => block.id === lastActiveBlockId
	);

	const {
		setSwiper,
		goNext,
		goPrev,
		goToBlock,
		setIsCurrentBlockSafeToSwipe,
		setIsFieldValid,
		setIsFieldPending,
		setFieldValidationErr,
		setFieldAnswer,
		setCorrectIncorrectDisplay,
		setIsFieldCorrectIncorrectScreenDisplayed,
	} = useDispatch('quillForms/renderer-core');

	useEffect(() => {
		if (isPreview || editor.mode === 'on') return;
		if (saveandcontinue?.enable && saved_data?.snapshot) {
			const fields = saved_data?.fields || {};

			Object.keys(fields).forEach((fieldId) => {
				setFieldAnswer(fieldId, fields[fieldId].value);
			});

			return;
		}

		if (settings?.saveAnswersInBrowser && !formObj?.snapshot) {
			// replace localstorage with cookies.
			const answers = localStorage.getItem(`quillforms-answers-${formId}`)
				// @ts-ignore  
				? JSON.parse(localStorage.getItem(`quillforms-answers-${formId}`))
				: {};
			editableFields.forEach((field) => {
				if (answers[field.id]) {
					setFieldAnswer(field.id, answers[field.id].value);
				}
			});
		}
	}, []);

	useEffect(() => {
		if (!isPreview && editor.mode === 'off' && settings?.saveAnswersInBrowser && !formObj?.snapshot) {
			// replace localstorage with cookies which will expire in 30 days.
			localStorage.setItem(
				`quillforms-answers-${formId}`,
				JSON.stringify(answers)
			);
			if (currentBlockId)
				localStorage.setItem(`quillforms-current-block-${formId}`, currentBlockId);

		}
	}, [currentBlockId, answers]);
	const isTouchScreen =
		(typeof window !== 'undefined' && 'ontouchstart' in window) ||
		(typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) || // @ts-expect-error
		(typeof navigator !== 'undefined' && navigator.msMaxTouchPoints > 0);

	const getFieldsToRender = (): string[] => {
		if (currentBlockId) {
			if (editor?.mode === 'on') return [currentBlockId];
			const fieldIds: string[] = [];
			const filteredBlocks = walkPath.filter(
				(block) =>
					answers[block.id]?.isPending ||
					block.id === currentBlockId ||
					(!isTouchScreen && block.id === nextBlockId) ||
					(!isTouchScreen && block.id === prevBlockId) ||
					(!isTouchScreen && block.id === lastActiveBlockId)
			);
			filteredBlocks.forEach((block) => {
				if (
					block.name !== 'welcome-screen' &&
					block.name !== 'thankyou-screen'
				) {
					fieldIds.push(block.id);
				}
			});
			return fieldIds;
		}
		return [];
	};

	const fieldsToRender = getFieldsToRender();
	const fields = walkPath.filter(
		(block) =>
			block.name !== 'welcome-screen' && block.name !== 'thankyou-screen'
	);

	const goNextReally = async () => {
		if (editor?.mode === 'on') return;
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
			if (
				correctIncorrectQuiz?.enabled &&
				swiper?.correctIncorrectDisplay === false &&
				currentBlockType.supports.correctAnswers &&
				correctIncorrectQuiz?.showAnswersDuringQuiz &&
				!answers[currentBlockId]?.isCorrectIncorrectScreenDisplayed
			) {
				setCorrectIncorrectDisplay(true);
				setIsFieldCorrectIncorrectScreenDisplayed(
					currentBlockId,
					true
				);
				return;
			}

			doAction('QuillForms.RendererCore.BeforeNext', currentBlockId, formContext);
			goNext();
		}
	};

	const { isCurrentBlockValid } = useSelect((select) => {
		return {
			isCurrentBlockValid: currentBlockType?.supports?.innerBlocks
				? select('quillForms/renderer-core')?.hasValidFields(
					// @ts-expect-error
					currentBlockId
				)
				: currentBlockType?.supports?.editable
					? select('quillForms/renderer-core')?.isValidField(
						// @ts-expect-error
						currentBlockId
					)
					: true,
		};
	});
	useEffect(() => {
		if (editor.mode === 'on') return;
		if (isCurrentBlockSafeToSwipe) setIsCurrentBlockSafeToSwipe(true);
	}, [isCurrentBlockValid]);

	const isFirstField =
		walkPath?.length > 0 && walkPath[0].id === currentBlockId;

	const isLastField =
		walkPath?.length &&
		currentBlockId === walkPath[walkPath.length - 1].id;

	const handlers = useSwipeable({
		onSwiping: (e) => {
			swipingHandler(e, true);
		},
		preventDefaultTouchmoveEvent: false,
		trackMouse: false,
		trackTouch: true,
		delta: 70,
	});

	// Mouse Wheel Handler
	const swipingHandler = (
		e: React.WheelEvent | SwipeEventData,
		touch = false
	) => {
		if (settings?.disableWheelSwiping || editor?.mode === 'on') return;
		let delta = e.deltaY;
		if (settings?.animationDirection === 'horizontal') {
			delta = e.deltaX;
		}
		if (swiper.isAnimating) return;
		const lethargyCheck = lethargy.check(e);
		const now = new Date().getTime();
		let timeDelay = 900;
		if (touch) timeDelay = 500;
		if (
			lethargyCheck === false ||
			isAnimating ||
			(lastScrollDate && now - lastScrollDate < timeDelay)
		)
			return;
		if (
			canSwipePrev &&
			((delta < -50 && !touch) ||
				(touch &&
					delta > 50 &&
					(e as SwipeEventData).dir === 'Down')) &&
			!isFirstField
		) {
			// Scroll up
			lastScrollDate = new Date().getTime();
			goPrev();
		} else if (
			canSwipeNext &&
			((delta < -50 &&
				touch &&
				(e as SwipeEventData).dir === 'Up') ||
				(!touch && delta > 50)) &&
			!isLastField
		) {
			lastScrollDate = new Date().getTime();
			// Scroll down
			if (isCurrentBlockValid) {
				goNextReally();
			} else {
				setIsCurrentBlockSafeToSwipe(false);
			}
		}
	};

	useEffect((): void | (() => void) => {
		// if (editor.mode === 'on') return;
		if (isAnimating) {
			const timer = setTimeout(() => {
				setSwiper({
					isAnimating: false,
				});
			}, 600);
			return () => clearTimeout(timer);
		}
	}, [swiper]);

	useEffect(() => {
		if (editor.mode === 'on') return;
		if (applyLogic && isActive) {
			doAction(
				'QuillForms.RendererCore.LogicApply',
				blocks,
				blockTypes,
				logic,
				hiddenFields
			);
		}
	}, [answers, currentBlockId]);

	useEffect(() => {
		if (editor.mode === 'on') return;
		if (applyLogic && isActive) {
			setSwiper({
				currentBlockId: blocks[0].id,
				prevBlockId: undefined,
				canSwipePrev: false,
				lastActiveBlockId: undefined,
			});
			doAction(
				'QuillForms.RendererCore.LogicApply',
				blocks,
				blockTypes,
				logic,
				hiddenFields
			);
		}
		if (!applyLogic) {
			doAction('QuillForms.RendererCore.LogicTurnOff');
		}
	}, [applyLogic]);

	// const isThereNextField =
	// 	fields.filter( ( field ) => field.id === nextBlockId ).length === 0;

	const handleNext = () => {
		//console.log('handleNext');
		if (isCurrentBlockValid) {
			//console.log('isCurrentBlockValid');
			goNextReally();
		} else {
			//console.log('isCurrentBlockNotValid');
			setIsCurrentBlockSafeToSwipe(false);
		}
	};
	return (
		<div
			onWheel={swipingHandler}
			className={classNames('renderer-core-fields-wrapper', {
				active: isActive,
				'is-moving-up':
					isAnimating && currentBlockIndex < lastActiveBlockIndex,
				'is-moving-down':
					isAnimating && currentBlockIndex > lastActiveBlockIndex,
			})}
			ref={ref}
			aria-hidden={isActive ? false : true}
		>
			<div {...handlers}>
				{fields.map((field, index) => {
					const isActive = currentBlockId === field.id;
					return (
						<FieldRender
							key={`${field.id}`}
							id={field.id}
							shouldBeRendered={fieldsToRender.includes(
								field.id
							)}
							isActive={isActive}
							isCurrentBlockSafeToSwipe={
								isActive ? isCurrentBlockSafeToSwipe : true
							}
							isLastField={
								(!nextBlock ||
									nextBlock.name === 'thankyou-screen') &&
								index === fields.length - 1
							}
							next={() => handleNext()}
						/>
					);
				})}
			</div>
		</div>
	);
};
export default FieldsWrapper;
