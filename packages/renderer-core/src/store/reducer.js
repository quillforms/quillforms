/**
 * Internal Dependencies
 */
import {
	SET_IS_BLOCK_CHANGING,
	SET_CURRENT_BLOCK,
	SET_CAN_NEXT,
	SET_CAN_PREV,
	SET_ANIMATION_EFFECTS,
} from './constants';

/**
 * External dependencies
 */
import { reduce } from 'lodash';

const initialState = {
	isBlockChanging: false,
	currentBlockId: null,
	currentBlockCat: null,
	canNext: false,
	canPrev: false,
	animationEffects: {
		moveUp: null,
		moveDown: null,
		moveDownFromUp: null,
		moveUpFromDown: null,
	},
};

/**
 * Returns an object against which it is safe to perform mutating operations,
 * given the original object and its current working copy.
 *
 * @param {Object} original Original object.
 * @param {Object} working  Working object.
 *
 * @return {Object} Mutation-safe object.
 */
function getMutateSafeObject( original, working ) {
	if ( original === working ) {
		return { ...original };
	}

	return working;
}

const RendererCoreReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case SET_IS_BLOCK_CHANGING: {
			const { val } = action.payload;
			if ( val === state.isBlockChanging ) {
				return state;
			}
			const stateClone = { ...state };
			stateClone.isBlockChanging = val;
			return stateClone;
		}
		case SET_CURRENT_BLOCK: {
			const { id, cat } = action.payload;
			if (
				id === state.currentBlockId &&
				cat === state.currentBlockCat
			) {
				return state;
			}
			const stateClone = { ...state };
			stateClone.currentBlockId = id;
			stateClone.currentBlockCat = cat;
			return stateClone;
		}
		// SET_CAN_NEXT
		case SET_CAN_NEXT: {
			const { val } = action.payload;
			if ( val === state.canNext ) {
				return state;
			}
			const stateClone = { ...state };
			stateClone.canNext = val;
			return stateClone;
		}
		// SET_CAN_PREV
		case SET_CAN_PREV: {
			const { val } = action.payload;
			if ( val === state.canPrev ) {
				return state;
			}
			const stateClone = { ...state };
			stateClone.canPrev = val;
			return stateClone;
		}
		// SET ANIMATION EFFECTS
		case SET_ANIMATION_EFFECTS: {
			const { animationEffects } = action.payload;
			// Consider as updates only changed values
			const nextAnimationEffects = reduce(
				animationEffects,
				( result, value, key ) => {
					if ( value !== result[ key ] ) {
						result = getMutateSafeObject(
							state.animationEffects,
							result
						);
						result[ key ] = value;
					}

					return result;
				},
				state.animationEffects
			);

			// Skip update if nothing has been changed. The reference will
			// match the original block if `reduce` had no changed values.
			if ( nextAnimationEffects === state.animationEffects ) {
				return state;
			}

			// Otherwise replace attributes in state
			return {
				...state,
				...nextAnimationEffects,
			};
		}
	}
	return state;
};

export default RendererCoreReducer;
