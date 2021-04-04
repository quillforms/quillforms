import {
	SET_SWIPER_STATE,
	GO_NEXT,
	GO_PREV,
	COMPLETE_FORM,
	GO_TO_FIELD,
	SET_SUBMISSION_ERR,
	SET_FIELD_ANSWER,
	SET_IS_FIELD_ANSWERED,
	SET_IS_FIELD_VALID,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_FIELD_VALIDATION_ERR,
} from './constants';

import type {
	SwiperState,
	SwiperActionTypes,
	RendererAnswersActionTypes,
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
export const goToField = ( id: string ): SwiperActionTypes => {
	return {
		type: GO_TO_FIELD,
		id,
	};
};

/**
 * Set submission error
 *
 * @param {string} err     Submission error
 *
 * @return {SwiperActionTypes} Action object
 */
export const setSubmissionErr = ( err: string ): SwiperActionTypes => {
	return {
		type: SET_SUBMISSION_ERR,
		err,
	};
};

/**
 * Complete form and show thank you screen
 *
 *
 * @return {SwiperActionTypes} Action object
 */
export const completeForm = (): SwiperActionTypes => {
	return {
		type: COMPLETE_FORM,
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
 * Returns and object used in setting error message key
 *
 * @param {string}  id   Field uuid.
 * @param {string}  val  Field isAnswered flag.
 *
 * @return {Object} Action object.
 */
export const setFieldValidationErrr = (
	id: string,
	val: string
): RendererAnswersActionTypes => {
	return {
		type: SET_FIELD_VALIDATION_ERR,
		id,
		val,
	};
};
