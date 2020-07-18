import {
	SET_FIELD_ANSWER,
	SET_IS_FIELD_ANSWERED,
	SET_IS_FIELD_VALID,
	INSERT_EMPTY_FIELD_ANSWER,
} from './actionTypes';

/**
 * Returns an action object used in registering block settings.
 *
 * @param {string} id 		Field uuid.
 * @param {string} type		Field type
 *
 * @return {Object} Action object.
 */
export const insertEmptyFieldAnswer = ( id, type ) => {
	return {
		type: INSERT_EMPTY_FIELD_ANSWER,
		payload: { id, type },
	};
};

/**
 * Returns an action object used in registering block settings.
 *
 * @param {string} id   Field uuid.
 * @param {any}    val  Field value could be string, array, number or any type.
 *
 * @return {Object} Action object.
 */
export const setFieldAnswer = ( id, val ) => {
	return {
		type: SET_FIELD_ANSWER,
		payload: { id, val },
	};
};

/**
 * Returns an action object used in registering block settings.
 *
 * @param {string}     id   Field uuid.
 * @param {boolean}    val  Field isValid flag.
 *
 * @return {Object} Action object.
 */
export const setIsFieldValid = ( id, val ) => {
	return {
		type: SET_IS_FIELD_VALID,
		payload: { id, val },
	};
};

/**
 * Returns an action object used in registering block settings.
 *
 * @param {string}     id   Field uuid.
 * @param {boolean}    val  Field isAnswered flag.
 *
 * @return {Object} Action object.
 */
export const setIsFieldAnswered = ( id, val ) => {
	return {
		type: SET_IS_FIELD_ANSWERED,
		payload: { id, val },
	};
};
