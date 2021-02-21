/* eslint-disable no-nested-ternary */
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
} from './constants';

const initialState = {
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

const RendererCoreReducer = ( state = initialState, action ) => {
	const {
		walkPath,
		isAnimating,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		isSubmissionScreenActive,
		thankyouScreens,
	} = state;
	const isLastField =
		walkPath?.length > 0 &&
		walkPath[ walkPath.length - 1 ].id === currentBlockId;

	switch ( action.type ) {
		case SET_SWIPER_STATE: {
			const newSwiperState = action.payload.swiperState;
			return { ...state, ...newSwiperState };
		}

		case GO_NEXT: {
			const { isSwiping } = action.payload;
			if ( isAnimating ) return state;
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
				$newCurrentBlockId = null;
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
				disableTransition: false,
				isSubmissionScreenActive: ! $newCurrentBlockId
					? true
					: undefined,
				isThankyouScreenActive: false,
				isReviewing: ! $newCurrentBlockId ? false : true,
			};
		}

		case GO_PREV: {
			if ( isAnimating ) return state;
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
			const { id } = action.payload;
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
			const { err } = action.payload;
			return {
				...state,
				submissionErr: err,
			};
		}
	}
	return state;
};

export default RendererCoreReducer;
