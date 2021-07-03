import {
	SET_SWIPER_STATE,
	GO_NEXT,
	GO_PREV,
	COMPLETE_FORM,
	GO_TO_BLOCK,
	SET_SUBMISSION_ERR,
	SET_IS_REVIEWING,
	SET_IS_SUBMITTING,
	SET_FIELD_ANSWER,
	SET_IS_FIELD_ANSWERED,
	SET_IS_FIELD_PENDING,
	SET_FIELD_PENDING_MSG,
	SET_IS_FIELD_VALID,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_FIELD_VALIDATION_ERR,
	RESET_ANSWERS,
	SET_IS_FOCUSED,
	SET_FOOTER_DISPLAY,
} from './constants';

import type {
	SwiperState,
	SwiperActionTypes,
	RendererAnswersActionTypes,
	SubmitActionTypes,
} from './types';

/**

 * Returns an action object used in setting swiper state
 *
 * @param {SwiperState} swiperState New swiper state.
 *
 * @return {SwiperActionTypes} Action object.
 */
export const setSwiper = (
	swiperState: Partial< SwiperState >
): SwiperActionTypes => {
	return {
		type: SET_SWIPER_STATE,
		swiperState,
	};
};

/**
 * Go to next block
 *
 * @param {boolean} isSwiping  Is swiping
 *
 * @return {SwiperActionTypes} Action object.
 */
export const goNext = ( isSwiping: boolean = false ): SwiperActionTypes => {
	return {
		type: GO_NEXT,
		isSwiping,
	};
};

/**
 * Go to previous block
 *
 * @return {SwiperActionTypes} Action object.
 */
export const goPrev = (): SwiperActionTypes => {
	return {
		type: GO_PREV,
	};
};

/**
 * Go to a specific field
 *
 * @param {string} id       The field id.
 *
 * @return {SwiperActionTypes} Action object.
 */
export const goToBlock = ( id: string ): SwiperActionTypes => {
	return {
		type: GO_TO_BLOCK,
		id,
	};
};

/**
 * Complete form and show thank you screen
 *
 * @return {SwiperActionTypes} Action object
 */
export const completeForm = (): SwiperActionTypes => {
	return {
		type: COMPLETE_FORM,
	};
};

/**
 * Reset answers
 *
 * @return {RendererAnswersActionTypes} Action object.
 */
export const resetAnswers = (): RendererAnswersActionTypes => {
	return {
		type: RESET_ANSWERS,
	};
};
/**
 * Returns an action object used in inserting empty field answer.
 *
 * @param {string} id 		Field uuid.
 * @param {string} type		Field type
 *
 * @return {RendererAnswersActionTypes} Action object.
 */
export const insertEmptyFieldAnswer = (
	id: string,
	blockName: string
): RendererAnswersActionTypes => {
	return {
		type: INSERT_EMPTY_FIELD_ANSWER,
		id,
		blockName,
	};
};

/**
 * Returns an action object used in setting field answer.
 *
 * @param {string}     id   Field uuid.
 * @param {unknown}    val  Field value could be string, array, number or any type.
 *
 * @return {Object} Action object.
 */
export const setFieldAnswer = (
	id: string,
	val: unknown
): RendererAnswersActionTypes => {
	return {
		type: SET_FIELD_ANSWER,
		id,
		val,
	};
};

/**
 * Returns an action object used in setting field valid flag.
 *
 * @param {string}  id   Field uuid.
 * @param {boolean} val  Field isValid flag.
 *
 * @return {Object} Action object.
 */
export const setIsFieldValid = (
	id: string,
	val: boolean
): RendererAnswersActionTypes => {
	return {
		type: SET_IS_FIELD_VALID,
		id,
		val,
	};
};

/**
 * Returns an action object used in setting fields answered flag.
 *
 * @param {string}  id   Field uuid.
 * @param {boolean} val  Field isAnswered flag.
 *
 * @return {RendererAnswersActionTypes} Action object.
 */
export const setIsFieldAnswered = (
	id: string,
	val: boolean
): RendererAnswersActionTypes => {
	return {
		type: SET_IS_FIELD_ANSWERED,
		id,
		val,
	};
};

/**
 * Returns an action object used in setting fields pending flag.
 *
 * @param {string}  id   Field uuid.
 * @param {boolean} val  Field isPending flag.
 *
 * @return {RendererAnswersActionTypes} Action object.
 */
export const setIsFieldPending = (
	id: string,
	val: boolean
): RendererAnswersActionTypes => {
	return {
		type: SET_IS_FIELD_PENDING,
		id,
		val,
	};
};

/**
 * Returns and object used in setting pending message key
 *
 * @param {string}  id   Field uuid.
 * @param {string}  val  Field pendingMsg flag.
 *
 * @return {Object} Action object.
 */
export const setFieldPendingMsg = (
	id: string,
	val: string
): RendererAnswersActionTypes => {
	return {
		type: SET_FIELD_PENDING_MSG,
		id,
		val,
	};
};

/**
 * Returns and object used in setting error message key
 *
 * @param {string}  id   Field uuid.
 * @param {string}  val  Field isAnswered flag.
 *
 * @return {Object} Action object.
 */
export const setFieldValidationErr = (
	id: string,
	val: string
): RendererAnswersActionTypes => {
	return {
		type: SET_FIELD_VALIDATION_ERR,
		id,
		val,
	};
};

/**
 * Set is reviewing flag
 *
 * @param {boolean} val  The new flag value.
 *
 * @return {Object} Action object
 */
export const setIsReviewing = ( val: boolean ): SubmitActionTypes => {
	return {
		type: SET_IS_REVIEWING,
		val,
	};
};

/**
 * Set is submitting flag.
 *
 * @param {boolean} val  The new flag value.
 *
 * @return {Object} Action object
 */
export const setIsSubmitting = ( val: boolean ): SubmitActionTypes => {
	return {
		type: SET_IS_SUBMITTING,
		val,
	};
};

/**
 * Set submission errors.
 *
 * @param {String} val  The new submission errors.
 *
 * @return {Object} Action object
 */
export const setSubmissionErr = ( val: string ): SubmitActionTypes => {
	return {
		type: SET_SUBMISSION_ERR,
		val,
	};
};

/**
 * Set isFocused flag
 *
 * @param {Boolean} val   The new flag value.
 *
 * @return {Object} Action object
 */
export const setIsFocused = ( val: boolean ) => {
	return {
		type: SET_IS_FOCUSED,
		val,
	};
};

/**
 * Set footerDisplay flag
 * This flag will alomst be needed to control in touch screens.
 *
 * @param {Boolean} val   The new flag value.
 *
 * @return {Object} Action object
 */
export const setFooterDisplay = ( val: boolean ) => {
	return {
		type: SET_FOOTER_DISPLAY,
		val,
	};
};
