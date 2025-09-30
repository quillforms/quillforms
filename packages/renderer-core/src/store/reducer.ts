/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { FormBlock } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { combineReducers } from '@wordpress/data';
import { forEach, some, size } from 'lodash';

/**
 * External dependencies
 */
import type { Reducer } from 'redux';

/**
 * Internal Dependencies
 */
import {
	GO_NEXT,
	GO_PREV,
	COMPLETE_FORM,
	SET_SWIPER_STATE,
	GO_TO_BLOCK,
	SET_CORRECT_INCORRECT_DISPLAY,
	SET_SUBMISSION_ERR,
	SET_FIELD_ANSWER,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_IS_FIELD_ANSWERED,
	SET_IS_FIELD_PENDING,
	SET_FIELD_PENDING_MSG,
	SET_IS_FIELD_ANSWER_CORRECT,
	SET_FIELD_VALIDATION_ERR,
	RESET_ANSWERS,
	SET_ANSWERS,
	SET_IS_REVIEWING,
	SET_IS_SUBMITTING,
	SET_PAYMENT_DATA,
	SET_IS_FOCUSED,
	SET_FOOTER_DISPLAY,
	SET_IS_CURRENT_BLOCK_SAFE_TO_SWIPE,
	SET_IS_FIELD_ANSWER_LOCKED,
	SET_IS_FIELD_CORRECT_INCORRECT_SCREEN_DISPLAYED,
	SET_THANKYOU_SCREENS,
	SET_GLOBAL_HASH,
	SET_IS_FIELD_ACTION_STICKY,
} from './constants';
import type {
	SwiperState,
	SwiperActionTypes,
	RendererAnswersActionTypes,
	RendererAnswersState,
	Screen,
	SubmissionState,
	SubmitActionTypes,
} from './types';

const initialState: SwiperState = {
	walkPath: [],
	welcomeScreens: [],
	thankyouScreens: [],
	currentBlockId: undefined,
	nextBlockId: undefined,
	lastActiveBlockId: undefined,
	prevBlockId: undefined,
	correctIncorrectDisplay: false,
	canSwipeNext: false,
	canSwipePrev: false,
	isCurrentBlockSafeToSwipe: true,
	isAnimating: true,
	isThankyouScreenActive: false,
	isWelcomeScreenActive: false,
	isReviewing: false,
	isFieldActionSticky: false,
};

const swiper: Reducer<SwiperState, SwiperActionTypes> = (
	state = initialState,
	action
) => {
	const {
		walkPath,
		isAnimating,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		thankyouScreens,
		correctIncorrectDisplay,
		isFieldActionSticky
	} = state;
	switch (action.type) {
		case SET_SWIPER_STATE: {
			const newSwiperState = action.swiperState;
			let validBlocksStructure = true;
			forEach(
				['walkPath', 'welcomeScreens', 'thankyouScreens'],
				(blockCat) => {
					if (newSwiperState[blockCat]) {
						const newBlockCat = newSwiperState[blockCat];
						if (!Array.isArray(newBlockCat)) {
							validBlocksStructure = false;
							return;
						}

						// check if  structure isn't correct
						if (newBlockCat.length > 0) {
							forEach(newBlockCat, (item) => {
								if (
									typeof item === 'object' &&
									item != null &&
									item.id &&
									typeof item.id === 'string'
								) {
									if (
										size(item.attributes) > 0 &&
										typeof item.attributes !== 'object'
									) {
										validBlocksStructure = false;
										return;
									}

									if (blockCat === 'walkPath') {
										// Check if the block has a name or it is a thank you screen or default thank you screen
										if (
											(!item.hasOwnProperty('name') ||
												typeof item.name !==
												'string') &&
											!some(
												newSwiperState.thankyouScreens,
												(block) =>
													block.id === item.id
											) &&
											item.id !==
											'default_thankyou_screen'
										) {
											validBlocksStructure = false;
										}
									}
								} else {
									validBlocksStructure = false;
								}
							});
						}
					}
				}
			);

			if (!validBlocksStructure) {
				return state;
			}

			const newWalkPath = newSwiperState.walkPath
				? newSwiperState.walkPath
				: walkPath;

			const newWelcomeScreens = newSwiperState.welcomeScreens
				? newSwiperState.welcomeScreens
				: state.welcomeScreens;

			const newThanksScreens = newSwiperState.thankyouScreens
				? newSwiperState.thankyouScreens
				: state.thankyouScreens;
			// If  new current block id or new next block id or new prev block id or last active block id aren't
			// in the new walkPath
			let checkCorrectIds = true;
			[
				'currentBlockId',
				'nextBlockId',
				'prevBlockId',
				'lastActiveBlockId',
			].forEach((prop) => {
				const allBlocks: (Screen | FormBlock)[] = [
					...newWalkPath,
					...newWelcomeScreens,
					...newThanksScreens,
				];
				if (
					newSwiperState[prop] &&
					!some(
						allBlocks,
						(block) =>
							block.id === newSwiperState[prop] ||
							newSwiperState[prop] === 'default_thankyou_screen'
					)
				) {
					checkCorrectIds = false;
				}
			});

			if (!checkCorrectIds) return state;

			let correctBooleans = true;

			// if typeof  new boolean props isn't boolean.
			[
				'isAnimating',
				'canSwipeNext',
				'canSwipePrev',
				'isThankyouScreenActive',
				'isWelcomeScreenActive',
			].forEach((prop) => {
				if (
					newSwiperState[prop] &&
					typeof newSwiperState[prop] !== 'boolean'
				) {
					correctBooleans = false;
				}
			});

			if (!correctBooleans) {
				return state;
			}

			const newCurrentBlockId = newSwiperState.currentBlockId
				? newSwiperState.currentBlockId
				: currentBlockId;
			const isFirstField =
				newWalkPath?.length > 0 &&
				newWalkPath[0].id == newCurrentBlockId;

			const isLastField =
				newWalkPath?.length > 0 &&
				newWalkPath[newWalkPath.length - 1].id == newCurrentBlockId;
			return {
				...state,
				...newSwiperState,
				canSwipeNext:
					newSwiperState.canSwipeNext === undefined
						? state.canSwipeNext
						: newSwiperState.canSwipeNext === true && isLastField
							? false
							: newSwiperState.canSwipeNext,
				canSwipePrev:
					newSwiperState.canSwipePrev === undefined
						? state.canSwipePrev
						: newSwiperState.canSwipePrev === true && isFirstField
							? false
							: newSwiperState.canSwipePrev,
				isWelcomeScreenActive:
					newWelcomeScreens.length &&
						some(
							newWelcomeScreens,
							(screen) => screen.id === newCurrentBlockId
						)
						? true
						: false,
				isThankyouScreenActive:
					some(
						newThanksScreens,
						(screen) => screen.id === newCurrentBlockId
					) || 'default_thankyou_screen' === newCurrentBlockId
						? true
						: false,
			};
		}

		case GO_NEXT: {
			if (isAnimating || correctIncorrectDisplay) return state;
			const nextFieldType = walkPath.find(
				(block) => block.id === nextBlockId
			)?.name;
			if (!nextFieldType || nextFieldType === 'thankyou-screen') return state;
			// const isThereNextField =
			// 	walkPath.filter(
			// 		( block ) =>
			// 			block.name !== 'welcome-screen' &&
			// 			block.name !== 'thankyou-screen' &&
			// 			block.id === nextBlockId
			// 	).length > 0;
			// const isReallyLastField =
			// 	walkPath?.length > 0 &&
			// 	walkPath[ walkPath.length - 1 ].id === currentBlockId &&
			// 	! isThereNextField;
			// if ( isReallyLastField ) return state;
			const currentFieldIndex = walkPath.findIndex(
				(field) => field.id === currentBlockId
			);
			let $newCurrentBlockId = nextBlockId;
			// To check if the new current block is within the path, if it isn't, navigate to submission screen.
			// This should apply only when the next block is before the current block.
			const newCurrentFieldIndex = walkPath.findIndex(
				($field) => $field.id === $newCurrentBlockId
			);

			if (
				newCurrentFieldIndex === -1 ||
				newCurrentFieldIndex === currentFieldIndex
			) {
				$newCurrentBlockId = undefined;
			}

			return {
				...state,
				canSwipeNext: !$newCurrentBlockId ? false : true,
				canSwipePrev: true,
				currentBlockId: $newCurrentBlockId,
				prevBlockId: $newCurrentBlockId
					? walkPath[newCurrentFieldIndex - 1]
						? walkPath[newCurrentFieldIndex - 1].id
						: undefined
					: walkPath[walkPath.length - 1].id,
				lastActiveBlockId: currentBlockId,
				nextBlockId:
					newCurrentFieldIndex !== -1
						? walkPath[newCurrentFieldIndex + 1]
							? walkPath[newCurrentFieldIndex + 1].id
							: undefined
						: nextBlockId,
				isAnimating: true,
				isThankyouScreenActive: false,
			};
		}

		case GO_PREV: {
			const isFirstField =
				walkPath?.length > 0 && walkPath[0].id === currentBlockId;

			if (isAnimating || isFirstField || correctIncorrectDisplay) return state;
			const currentFieldIndex = walkPath.findIndex(
				(field) => field.id === currentBlockId
			);
			return {
				...state,
				canSwipePrev: walkPath[currentFieldIndex - 2] ? true : false,
				canSwipeNext: true,
				currentBlockId: prevBlockId,
				lastActiveBlockId: currentBlockId,
				nextBlockId: currentBlockId,
				prevBlockId: walkPath[currentFieldIndex - 2]?.id
					? walkPath[currentFieldIndex - 2].id
					: undefined,
				isAnimating: true,
				isThankyouScreenActive: false,
			};
		}

		case SET_CORRECT_INCORRECT_DISPLAY: {
			const { val } = action;
			return {
				...state,
				correctIncorrectDisplay: val,
			};
		}

		case SET_IS_CURRENT_BLOCK_SAFE_TO_SWIPE: {
			const { val } = action;
			return {
				...state,
				isCurrentBlockSafeToSwipe: val,
			};
		}
		case SET_IS_FIELD_ACTION_STICKY: {
			const { val } = action;
			return {
				...state,
				isFieldActionSticky: val,
			};
		}

		case GO_TO_BLOCK: {
			let { id, forceUpdateState } = action;
			if (currentBlockId === id && !forceUpdateState) return state;
			const isTheBlockWelcomeScreenBlock = state.welcomeScreens.some(
				(screen) => screen.id === id
			);
			const isTheBlockThankyouScreenBlock = state.thankyouScreens.some(
				(screen) => screen.id === id
			);

			if (
				isTheBlockThankyouScreenBlock ||
				isTheBlockWelcomeScreenBlock
			) {
				return {
					...state,
					currentBlockId: id,
					isAnimating: true,
					canSwipeNext: false,
					canSwipePrev: false,
					nextBlockId: undefined,
					prevBlockId: undefined,
					lastActiveBlockId: currentBlockId,
					isWelcomeScreenActive: isTheBlockWelcomeScreenBlock,
					isThankyouScreenActive: isTheBlockThankyouScreenBlock,
				};
			}
			let fieldIndex = state.walkPath.findIndex(
				(field) => field.id === id
			);

			// If invalid parent block, try to search for inner blocks.
			if (
				fieldIndex === -1 &&
				!isTheBlockWelcomeScreenBlock &&
				!isTheBlockThankyouScreenBlock
			) {
				const groupBlocks = state.walkPath.filter(
					(field) => field.name === 'group'
				);

				let parentId;
				forEach(groupBlocks, (groupBlock) => {
					if (groupBlock.innerBlocks) {
						const childIndex = groupBlock.innerBlocks.findIndex(
							(childBlock) => childBlock.id === id
						);

						if (childIndex !== -1) {
							parentId = groupBlock.id;
						}
					}
				});

				if (!parentId) {
					return state;
				}
				id = parentId;
				fieldIndex = state.walkPath.findIndex(
					(field) => field.id === id
				);
			}

			return {
				...state,
				currentBlockId: id,
				isAnimating: true,
				canSwipeNext: walkPath[fieldIndex + 1] ? true : false,
				canSwipePrev: walkPath[fieldIndex - 1] ? true : false,
				nextBlockId: walkPath[fieldIndex + 1]
					? walkPath[fieldIndex + 1].id
					: undefined,
				prevBlockId: walkPath[fieldIndex - 1]
					? walkPath[fieldIndex - 1].id
					: undefined,
				lastActiveBlockId: currentBlockId,
				isWelcomeScreenActive: false,
				isThankyouScreenActive: false,
				isFieldActionSticky: false,
			};
		}

		case SET_THANKYOU_SCREENS: {
			return {
				...state,
				thankyouScreens: action.screens,
			}
		}
		case COMPLETE_FORM: {
			return {
				...state,
				canSwipeNext: false,
				canSwipePrev: false,
				isThankyouScreenActive: true,
				currentBlockId: nextBlockId && state.thankyouScreens.find(screen => screen.id === nextBlockId)
					? nextBlockId
					: thankyouScreens[0]?.id
						? thankyouScreens[0].id
						: 'default_thankyou_screen',
				prevBlockId: undefined,
				nextBlockId: undefined,
				lastActiveBlockId: undefined,
				isReviewing: false,
			};
		}
	}
	return state;
};

const isFocused: Reducer = (state = false, action) => {

	switch (action.type) {
		case SET_IS_FOCUSED: {
			if (typeof action.val !== 'boolean') {
				return state;
			}

			return action.val;
		}
	}

	return state;
};

const footerDisplay: Reducer = (state = true, action) => {
	switch (action.type) {
		case SET_FOOTER_DISPLAY: {
			if (typeof action.val !== 'boolean') {
				return state;
			}

			return action.val;
		}
	}

	return state;
};

// @ts-ignore globalHash is a property of globalHash.
const submit: Reducer<SubmissionState, SubmitActionTypes> = (
	state = {
		isSubmitting: false,
		isReviewing: false,
		submissionErr: '',
		paymentData: null,
		globalHash: '',
	},
	action
) => {
	switch (action.type) {
		case COMPLETE_FORM: {
			return {
				isSubmitting: false,
				isReviewing: false,
				submissionErr: '',
				paymentData: null,
			};
		}

		case SET_IS_REVIEWING: {
			const { val } = action;
			return {
				...state,
				isReviewing: val,
			};
		}

		case SET_IS_SUBMITTING: {
			const { val } = action;
			return {
				...state,
				isSubmitting: val,
				submissionErr: '',
			};
		}

		case SET_SUBMISSION_ERR: {
			// Make sure this action is called while the form is submitting already, otherwhise, do nothing.
			if (!state.isSubmitting) return state;
			const { val } = action;
			return {
				...state,
				isSubmitting: false,
				submissionErr: val,
			};
		}

		case SET_PAYMENT_DATA: {
			return {
				...state,
				paymentData: action.data,
			};
		}

		case SET_GLOBAL_HASH: {
			const { hash } = action;
			return {
				...state,
				globalHash: hash,
			};
		}
	}

	return state;
};

const answers: Reducer<RendererAnswersState, RendererAnswersActionTypes> = (
	state = {},
	action
) => {
	switch (action.type) {
		// Insert Empty Field Answer
		case INSERT_EMPTY_FIELD_ANSWER: {
			const { id, blockName } = action;
			const answers = { ...state };

			if (!answers[id]) {
				answers[id] = {
					value: undefined,
					isValid: true,
					isAnswered: false,
					isPending: false,
					pendingMsg: undefined,
					validationErr: undefined,
					isCorrect: undefined,
					isCorrectIncorrectScreenDisplayed: false,
					isLocked: false,
					blockName,
				};
			}
			return answers;
		}

		// SET FIELD ANSWER
		case SET_FIELD_ANSWER: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (val === state[id]?.value) {
				return state;
			}

			return {
				...state,
				[id]: {
					...state[id],
					value: val,
				},
			};
		}

		case RESET_ANSWERS: {
			return {};
		}

		case SET_ANSWERS: {
			return action.answers;
		}
		// SET IS FIELD VALID
		case SET_IS_FIELD_VALID: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (!state[id] || val === state[id].isValid) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					isValid: val,
				},
			};
		}

		// SET IS FIELD ANSWERED
		case SET_IS_FIELD_ANSWERED: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (!state[id] || val === state[id].isAnswered) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					isAnswered: val,
				},
			};
		}

		// SET IS FIELD ANSWER CORRECT
		case SET_IS_FIELD_ANSWER_CORRECT: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (!state[id] || val === state[id].isCorrect) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					isCorrect: val,
				},
			};
		}

		case SET_IS_FIELD_ANSWER_LOCKED: {
			const { id, val } = action;
			// .
			if (!state[id] || val === state[id].isLocked) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					isLocked: val,
				},
			};
		}

		case SET_IS_FIELD_CORRECT_INCORRECT_SCREEN_DISPLAYED: {
			const { id, val } = action;
			// .
			if (!state[id] || val === state[id].isCorrectIncorrectScreenDisplayed) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					isCorrectIncorrectScreenDisplayed: val,
				},
			};
		}

		// SET IS FIELD PENDING
		case SET_IS_FIELD_PENDING: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (!state[id] || val === state[id].isPending) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					isPending: val,
				},
			};
		}

		// SET FIELD PENDING MSG
		case SET_FIELD_PENDING_MSG: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (!state[id] || val === state[id].pendingMsg) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					pendingMsg: val,
				},
			};
		}

		// SET FIELD VALIDATION ERR
		case SET_FIELD_VALIDATION_ERR: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if (!state[id] || val === state[id].validationErr) {
				return state;
			}
			return {
				...state,
				[id]: {
					...state[id],
					validationErr: val,
				},
			};
		}
	}
	return state;
};

// @ts-ignore
const RendererCoreReducer: Reducer<
	{
		answers: RendererAnswersState;
		footerDisplay: boolean;
		isFocused: boolean;
		submit: SubmissionState;
		swiper: SwiperState;
	},
	any
> = combineReducers({
	answers,
	footerDisplay,
	isFocused,
	submit,
	swiper,
});
export type State = ReturnType<typeof RendererCoreReducer>;

export default RendererCoreReducer;
