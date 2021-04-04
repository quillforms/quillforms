/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { FormBlock } from '@quillforms/config/build-types';
import { combineReducers } from '@wordpress/data';
import { forEach, some } from 'lodash';

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
	GO_TO_FIELD,
	SET_SUBMISSION_ERR,
	SET_FIELD_ANSWER,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_IS_FIELD_ANSWERED,
	SET_FIELD_VALIDATION_ERR,
} from './constants';
import type {
	SwiperState,
	SwiperActionTypes,
	RendererAnswersActionTypes,
	RendererAnswersState,
	Screen,
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
	isSubmissionScreenActive: undefined,
	isThankyouScreenActive: false,
	isWelcomeScreenActive: false,
	isReviewing: false,
	submissionErrors: [],
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
		isSubmissionScreenActive,
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
									item.hasOwnProperty( 'id' ) &&
									typeof item.id === 'string'
								) {
									if (
										item.attributes &&
										typeof item.attributes !== 'object'
									) {
										validBlocksStructure = false;
										return;
									}

									if ( ( blockCat = 'walkPath' ) ) {
										if ( ! item.hasOwnProperty( 'name' ) ) {
											validBlocksStructure = false;
											return;
										}

										if ( typeof item.name !== 'string' ) {
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
			if ( ! validBlocksStructure ) return state;

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
				if (
					newSwiperState[ prop ] &&
					! some(
						allBlocks,
						( block ) =>
							block.id === newSwiperState[ prop ] ||
							block.id === 'default_thankyou_screen'
					)
				) {
					checkCorrectIds = false;
					return;
				}
			} );

			console.log( checkCorrectIds );

			if ( ! checkCorrectIds ) return state;

			// if typeof isAnimating isn't boolean.
			if (
				newSwiperState.isAnimating &&
				typeof newSwiperState.isAnimating !== 'boolean'
			) {
				return state;
			}

			const newCurrentBlockId = newSwiperState.currentBlockId
				? newSwiperState.currentBlockId
				: currentBlockId;
			const isFirstField =
				newWalkPath?.length > 0 &&
				newWalkPath[ 0 ].id == newCurrentBlockId;

			return {
				...state,
				...newSwiperState,
				canGoNext:
					newSwiperState.canGoNext === undefined
						? state.canGoNext
						: newSwiperState.canGoNext === true &&
						  isSubmissionScreenActive
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
						( screen ) => screen.id === currentBlockId
					)
						? true
						: false,
				isThankyouScreenActive: some(
					newThanksScreens,
					( screen ) =>
						screen.id === currentBlockId ||
						'default_thankyou_screen' === currentBlockId
				)
					? true
					: false,
			};
		}

		case GO_NEXT: {
			const { isSwiping } = action;
			if ( isAnimating || isSubmissionScreenActive ) return state;
			const isLastField =
				walkPath?.length > 0 &&
				walkPath[ walkPath.length - 1 ].id === currentBlockId;
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
				isSubmissionScreenActive: ! $newCurrentBlockId
					? true
					: undefined,
				isThankyouScreenActive: false,
				isReviewing: ! $newCurrentBlockId ? false : true,
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
				canGoPrev:
					walkPath[ currentFieldIndex - 2 ] ||
					isSubmissionScreenActive
						? true
						: false,
				canGoNext: true,
				currentBlockId: prevBlockId,
				lastActiveBlockId: currentBlockId,
				nextBlockId: currentBlockId,
				prevBlockId:
					isSubmissionScreenActive === true
						? walkPath[ walkPath.length - 2 ]?.id
							? walkPath[ walkPath.length - 2 ].id
							: undefined
						: walkPath[ currentFieldIndex - 2 ]?.id
						? walkPath[ currentFieldIndex - 2 ].id
						: undefined,
				isAnimating: true,
				isSubmissionScreenActive: isSubmissionScreenActive
					? false
					: undefined,
				isThankyouScreenActive: false,
			};
		}

		case GO_TO_FIELD: {
			const { id } = action;
			if ( currentBlockId === id ) return state;
			const fieldIndex = walkPath.findIndex(
				( field ) => field.id === id
			);
			if ( fieldIndex === -1 ) return state;
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
				isSubmissionScreenActive: undefined,
				isWelcomeScreenActive: false,
				isThankyouScreenActive: false,
				isReviewing: true,
			};
		}
		case COMPLETE_FORM: {
			return {
				...state,
				canGoNext: false,
				canGoPrev: false,
				isSubmissionScreenActive: false,
				isThankyouScreenActive: true,
				currentBlockId: nextBlockId
					? nextBlockId
					: thankyouScreens[ 0 ].id,
				prevBlockId: undefined,
				nextBlockId: undefined,
				lastActiveBlockId: undefined,
				isReviewing: false,
			};
		}

		case SET_SUBMISSION_ERR: {
			const { err } = action;
			return {
				...state,
				submissionErr: err,
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
					value: [],
					isValid: true,
					isAnswered: false,
					validationErr: undefined,
					name: blockName,
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
} );
export type State = ReturnType< typeof RendererCoreReducer >;

export default RendererCoreReducer;
