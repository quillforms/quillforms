import {
	SET_SWIPER_STATE,
	GO_NEXT,
	GO_PREV,
	COMPLETE_FORM,
	GO_TO_FIELD,
	SET_SUBMISSION_ERR,
} from './constants';

/**
 * Returns an action object used in setting swiper state
 *
 * @param {Object} swiperState New swiper state.
 *
 * @return {Object} Action object.
 */
export const setSwiper = ( swiperState ) => {
	return {
		type: SET_SWIPER_STATE,
		payload: { swiperState },
	};
};

/**
 * Go to next block
 *
 * @param {boolean} isSwiping  Is swiping
 *
 * @return {Object} Action object.
 */
export const goNext = ( isSwiping = false ) => {
	return {
		type: GO_NEXT,
		payload: { isSwiping },
	};
};

/**
 * Go to previous block
 *
 *
 * @return {Object} Action object.
 */
export const goPrev = () => {
	return {
		type: GO_PREV,
	};
};

/**
 * Go to a specific field
 *
 * @param {string} id       The field id.
 *
 * @return {Object} Action object.
 */
export const goToField = ( id ) => {
	return {
		type: GO_TO_FIELD,
		payload: { id },
	};
};

/**
 * Set submission error
 *
 * @param {string} err     Submission error
 *
 * @return {Object} Action object
 */
export const setSubmissionErr = ( err ) => {
	return {
		type: SET_SUBMISSION_ERR,
		payload: { err },
	};
};

/**
 * Complete form and show thank you screen
 *
 *
 * @return {Object} Action object
 */
export const completeForm = () => {
	return {
		type: COMPLETE_FORM,
	};
};
