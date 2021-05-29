/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { FormBlock } from '@quillforms/config';

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
	SET_SUBMISSION_ERRORS,
	SET_FIELD_ANSWER,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_IS_FIELD_ANSWERED,
	SET_FIELD_VALIDATION_ERR,
	RESET_ANSWERS,
	SET_IS_REVIEWING,
	SET_IS_SUBMITTING,
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
	canGoNext: false,
	canGoPrev: false,
	isAnimating: true,
	isThankyouScreenActive: false,
	isWelcomeScreenActive: false,
};

const swiper: Reducer< SwiperState, SwiperActionTypes > = (
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
	} = state;

	switch ( action.type ) {
		case SET_SWIPER_STATE: {
			const newSwiperState = action.swiperState;
			let validBlocksStructure = true;
			forEach(
				[ 'walkPath', 'welcomeScreens', 'thankyouScreens' ],
				( blockCat ) => {
					if ( newSwiperState[ blockCat ] ) {
						const newBlockCat = newSwiperState[ blockCat ];
						if ( ! Array.isArray( newBlockCat ) ) {
							validBlocksStructure = false;
							return;
						}

						// check if  structure isn't correct
						if ( newBlockCat.length > 0 ) {
							forEach( newBlockCat, ( item ) => {
								if (
									typeof item === 'object' &&
									item != null &&
									item.id &&
									typeof item.id === 'string'
								) {
									if (
										size( item.attributes ) > 0 &&
										typeof item.attributes !== 'object'
									) {
										validBlocksStructure = false;
										return;
									}

									if ( blockCat === 'walkPath' ) {
										// Check if the block has a name or it is a thank you screen or default thank you screen
										if (
											( ! item.hasOwnProperty( 'name' ) ||
												typeof item.name !==
													'string' ) &&
											! some(
												newSwiperState[
													'thankyouScreens'
												],
												( block ) =>
													block.id === item.id
											) &&
											item.id !==
												'default_thankyou_screen'
										) {
											validBlocksStructure = false;
											return;
										}
									}
								} else {
									validBlocksStructure = false;
									return;
								}
							} );
						}
					}
				}
			);

			console.log( validBlocksStructure );

			if ( ! validBlocksStructure ) {
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
			].forEach( ( prop ) => {
				const allBlocks: ( Screen | FormBlock )[] = [
					...newWalkPath,
					...newWelcomeScreens,
				];
				console.log( allBlocks );
				if (
					newSwiperState[ prop ] &&
					! some(
						allBlocks,
						( block ) =>
							block.id === newSwiperState[ prop ] ||
							newSwiperState[ prop ] === 'default_thankyou_screen'
					)
				) {
					checkCorrectIds = false;
					return;
				}
			} );

			console.log( checkCorrectIds );

			if ( ! checkCorrectIds ) return state;

			let correctBooleans = true;

			// if typeof  new boolean props isn't boolean.
			[
				'isAnimating',
				'canGoNext',
				'canGoPrev',
				'isThankyouScreenActive',
				'isWelcomeScreenActive',
			].forEach( ( prop ) => {
				if (
					newSwiperState[ prop ] &&
					typeof newSwiperState[ prop ] !== 'boolean'
				) {
					correctBooleans = false;
					return;
				}
			} );

			if ( ! correctBooleans ) {
				return state;
			}

			const newCurrentBlockId = newSwiperState.currentBlockId
				? newSwiperState.currentBlockId
				: currentBlockId;
			const isFirstField =
				newWalkPath?.length > 0 &&
				newWalkPath[ 0 ].id == newCurrentBlockId;

			const isLastField =
				newWalkPath?.length > 0 &&
				newWalkPath[ newWalkPath.length - 1 ].id == newCurrentBlockId;

			return {
				...state,
				...newSwiperState,
				canGoNext:
					newSwiperState.canGoNext === undefined
						? state.canGoNext
						: newSwiperState.canGoNext === true && isLastField
						? false
						: newSwiperState.canGoNext,
				canGoPrev:
					newSwiperState.canGoPrev === undefined
						? state.canGoPrev
						: newSwiperState.canGoPrev === true && isFirstField
						? false
						: newSwiperState.canGoPrev,
				isWelcomeScreenActive:
					newWelcomeScreens.length &&
					some(
						newWelcomeScreens,
						( screen ) => screen.id === newCurrentBlockId
					)
						? true
						: false,
				isThankyouScreenActive:
					some(
						newThanksScreens,
						( screen ) => screen.id === newCurrentBlockId
					) || 'default_thankyou_screen' === newCurrentBlockId
						? true
						: false,
			};
		}

		case GO_NEXT: {
			const { isSwiping } = action;
			if ( isAnimating ) return state;
			const isLastField =
				walkPath?.length > 0 &&
				walkPath[ walkPath.length - 1 ].id === currentBlockId;
			if ( isLastField ) return state;
			const currentFieldIndex = walkPath.findIndex(
				( field ) => field.id === currentBlockId
			);
			let $newCurrentBlockId = nextBlockId;
			// To check if the new current block is within the path, if it isn't, navigate to submission screen.
			// This should apply only when the next block is before the current block.
			const newCurrentFieldIndex = walkPath.findIndex(
				( $field ) => $field.id === $newCurrentBlockId
			);

			if (
				isLastField &&
				( newCurrentFieldIndex === -1 ||
					newCurrentFieldIndex === currentFieldIndex ||
					// In case of swiping by mouse wheel or nav buttons, don't go back to the next block if next block should be before the current block, continue
					// to submission screen; this previous case can be produced by implementing jump logic to previous block.
					isSwiping )
			) {
				$newCurrentBlockId = undefined;
			}
			return {
				...state,
				canGoNext: ! $newCurrentBlockId ? false : true,
				canGoPrev: true,
				currentBlockId: $newCurrentBlockId,
				prevBlockId: $newCurrentBlockId
					? walkPath[ newCurrentFieldIndex - 1 ]
						? walkPath[ newCurrentFieldIndex - 1 ].id
						: undefined
					: walkPath[ walkPath.length - 1 ].id,
				lastActiveBlockId: currentBlockId,
				nextBlockId:
					newCurrentFieldIndex !== -1
						? walkPath[ newCurrentFieldIndex + 1 ]
							? walkPath[ newCurrentFieldIndex + 1 ].id
							: undefined
						: nextBlockId,
				isAnimating: true,
				isThankyouScreenActive: false,
			};
		}

		case GO_PREV: {
			const isFirstField =
				walkPath?.length > 0 && walkPath[ 0 ].id === currentBlockId;

			if ( isAnimating || isFirstField ) return state;
			const currentFieldIndex = walkPath.findIndex(
				( field ) => field.id === currentBlockId
			);
			return {
				...state,
				canGoPrev: walkPath[ currentFieldIndex - 2 ] ? true : false,
				canGoNext: true,
				currentBlockId: prevBlockId,
				lastActiveBlockId: currentBlockId,
				nextBlockId: currentBlockId,
				prevBlockId: walkPath[ currentFieldIndex - 2 ]?.id
					? walkPath[ currentFieldIndex - 2 ].id
					: undefined,
				isAnimating: true,
				isThankyouScreenActive: false,
			};
		}

		case GO_TO_BLOCK: {
			console.log( state );
			const { id } = action;
			console.log( id );
			if ( currentBlockId === id ) return state;
			const isTheBlockWelcomeScreenBlock = state.welcomeScreens.some(
				( screen ) => screen.id === id
			);
			console.log( isTheBlockWelcomeScreenBlock );
			const isTheBlockThankyouScreenBlock = state.thankyouScreens.some(
				( screen ) => screen.id === id
			);

			if (
				isTheBlockThankyouScreenBlock ||
				isTheBlockWelcomeScreenBlock
			) {
				return {
					...state,
					currentBlockId: id,
					isAnimating: true,
					canGoNext: false,
					canGoPrev: false,
					nextBlockId: undefined,
					prevBlockId: undefined,
					lastActiveBlockId: currentBlockId,
					isWelcomeScreenActive: isTheBlockWelcomeScreenBlock,
					isThankyouScreenActive: isTheBlockThankyouScreenBlock,
				};
			}
			const isTheBlockFieldBlock = state.walkPath.some(
				( field ) => field.id === id
			);

			console.log( isTheBlockFieldBlock );
			// If invalid block
			if (
				! isTheBlockFieldBlock &&
				! isTheBlockWelcomeScreenBlock &&
				! isTheBlockThankyouScreenBlock
			) {
				return state;
			}

			const fieldIndex = walkPath.findIndex(
				( field ) => field.id === id
			);
			return {
				...state,
				currentBlockId: id,
				isAnimating: true,
				canGoNext: walkPath[ fieldIndex + 1 ] ? true : false,
				canGoPrev: walkPath[ fieldIndex - 1 ] ? true : false,
				nextBlockId: walkPath[ fieldIndex + 1 ]
					? walkPath[ fieldIndex + 1 ].id
					: undefined,
				prevBlockId: walkPath[ fieldIndex - 1 ]
					? walkPath[ fieldIndex - 1 ].id
					: undefined,
				lastActiveBlockId: currentBlockId,
				isWelcomeScreenActive: false,
				isThankyouScreenActive: false,
			};
		}
		case COMPLETE_FORM: {
			return {
				...state,
				canGoNext: false,
				canGoPrev: false,
				isThankyouScreenActive: true,
				currentBlockId: nextBlockId
					? nextBlockId
					: thankyouScreens[ 0 ]?.id
					? thankyouScreens[ 0 ].id
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

const submit: Reducer< SubmissionState, SubmitActionTypes > = (
	state = {
		isSubmitting: false,
		isReviewing: false,
		submissionErrors: [],
	},
	action
) => {
	switch ( action.type ) {
		case COMPLETE_FORM: {
			return {
				isSubmitting: false,
				isReviewing: false,
				submissionErrors: [],
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
			};
		}

		case SET_SUBMISSION_ERRORS: {
			// Make sure this action is called while the form is submitting already, otherwhise, do nothing.
			if ( ! state.isSubmitting ) return state;
			const { val } = action;
			return {
				...state,
				isSubmitting: false,
				submissionErrors: val,
			};
		}
	}

	return state;
};

const answers: Reducer< RendererAnswersState, RendererAnswersActionTypes > = (
	state = {},
	action
) => {
	switch ( action.type ) {
		// Insert Empty Field Answer
		case INSERT_EMPTY_FIELD_ANSWER: {
			const { id, blockName } = action;
			const answers = { ...state };

			if ( ! answers[ id ] ) {
				answers[ id ] = {
					value: undefined,
					isValid: true,
					isAnswered: false,
					validationErr: undefined,
					blockName,
				};
			}
			return answers;
		}

		// SET FIELD ANSWER
		case SET_FIELD_ANSWER: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! state[ id ] || val === state[ id ].value ) {
				return state;
			}

			return {
				...state,
				[ id ]: {
					...state[ id ],
					value: val,
				},
			};
		}

		case RESET_ANSWERS: {
			return {};
		}

		// SET IS FIELD VALID
		case SET_IS_FIELD_VALID: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! state[ id ] || val === state[ id ].isValid ) {
				return state;
			}

			return {
				...state,
				[ id ]: {
					...state[ id ],
					isValid: val,
				},
			};
		}

		// SET IS FIELD ANSWERED
		case SET_IS_FIELD_ANSWERED: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! state[ id ] || val === state[ id ].isAnswered ) {
				return state;
			}
			return {
				...state,
				[ id ]: {
					...state[ id ],
					isAnswered: val,
				},
			};
		}

		// SET FIELD VALIDATION ERR
		case SET_FIELD_VALIDATION_ERR: {
			const { id, val } = action;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! state[ id ] || val === state[ id ].validationErr ) {
				return state;
			}
			return {
				...state,
				[ id ]: {
					...state[ id ],
					validationErr: val,
				},
			};
		}
	}
	return state;
};

const RendererCoreReducer = combineReducers( {
	swiper,
	answers,
	submit,
} );
export type State = ReturnType< typeof RendererCoreReducer >;

export default RendererCoreReducer;
