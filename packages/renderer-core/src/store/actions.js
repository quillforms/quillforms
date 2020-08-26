import {
	SET_IS_BLOCK_CHANGING,
	SET_CURRENT_BLOCK,
	SET_CAN_NEXT,
	SET_CAN_PREV,
	SET_ANIMATION_EFFECTS,
} from './constants';

/**
 * Returns an action object used in setting block is changing flag.
 *
 * @param {boolean} val Is block changing flag value.
 *
 * @return {Object} Action object.
 */
export const setIsBlockChanging = ( val ) => {
	return {
		type: SET_IS_BLOCK_CHANGING,
		payload: { val },
	};
};

/**
 * Returns an action object used in setting current block
 *
 * @param {string}                                            id  Block id
 * @param {("fields" | "welcomeScreens" | "thankyouScreens")} cat Block cat.
 *
 * @return {Object} Action object.
 */
export const setCurrentBlock = ( id, cat ) => {
	return {
		type: SET_CURRENT_BLOCK,
		payload: { id, cat },
	};
};

/**
 * Returns an action object used in setting can go next flag.
 *
 * @param {boolean} val Can go next flag value.
 *
 * @return {Object} Action object.
 */
export const setCanNext = ( val ) => {
	return {
		type: SET_CAN_NEXT,
		payload: { val },
	};
};

/**
 * Returns an action object used in setting can go previous flag.
 *
 * @param {boolean} val Can go previous flag value.
 *
 * @return {Object} Action object.
 */
export const setCanPrev = ( val ) => {
	return {
		type: SET_CAN_PREV,
		payload: { val },
	};
};

/**
 * An object describing animation effects.
 *
 * @typedef {Object} QFAnimationEffects
 *
 * @property {string} moveUp          Move up.
 * @property {string} moveDown        Move down.
 * @property {string} moveUpFromDown  Move up from down.
 * @property {string} moveDownFromUp  Move down from up.
 */

/**
 * Returns an action object used in setting animation effects.
 *
 * @param {QFAnimationEffects} animationEffects  Animation effects object
 *
 * @return {Object} Action object
 */
export const setAnimationEffects = ( animationEffects ) => {
	return {
		type: SET_ANIMATION_EFFECTS,
		payload: { animationEffects },
	};
};
