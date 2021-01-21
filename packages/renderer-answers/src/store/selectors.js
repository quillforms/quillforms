/**
 * WordPress Dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * External Dependencies
 */
import { mapValues, findIndex, pickBy, size } from 'lodash';

/**
 * Get all answers.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered blocks
 */
export function getAnswers( state ) {
	return state.answers;
}

/**
 * Get answers values.
 *
 * @param {Object} state      Global application state.
 *
 * @return {Array} Registered
 *
 */
export function getAnswersValues( state ) {
	return mapValues( state.answers, ( o ) => {
		return o.value;
	} );
}

/**
 * Get count of answered fields.
 *
 * @param {Object} state
 *
 * @return {number} Answered fields count
 */
export function getAnsweredFieldsLength( state ) {
	const answeredFields = pickBy(
		state.answers,
		( value ) => value?.isAnswered === true
	);
	return answeredFields ? size( answeredFields ) : 0;
}

/**
 * Get field answer value.
 *
 * @param {Object} state   Global application state.
 * @param {string} id 	   Field id.
 *
 * @return {any} Field answer value
 */
export function getFieldAnswerVal( state, id ) {
	const answer = state.answers[ id ]?.value;
	return answer ? answer : [];
}

/**
 * Get invalid fields
 *
 * @param {Object} state
 *
 * @return {Object} Invalid fields keyed by id
 */
export function getInvalidFields( state ) {
	const invalidFields = pickBy( state.answers, ( o ) => o.isValid === false );
	return invalidFields;
}

/**
 * Get invalid fields length
 *
 * @param {Object} state
 *
 * @return {number} Invalid fields length
 */
export function getInvalidFieldsLength( state ) {
	return getInvalidFields( state ).length;
}

/**
 * Get first invalid field id
 *
 * @param {Object} state
 *
 * @return {string} First invalid field id
 */
export const getFirstInvalidFieldId = createRegistrySelector(
	( select ) => ( state ) => {
		const invalidFields = getInvalidFields( state );
		if ( size( invalidFields ) > 0 ) {
			const invalidFieldsIds = Object.keys( invalidFields );
			const walkPath = select( 'quillForms/renderer-core' ).getWalkPath();
			const firstFieldIndex = findIndex( walkPath, ( o ) =>
				invalidFieldsIds.includes( o.id )
			);
			if ( firstFieldIndex !== -1 ) return walkPath[ firstFieldIndex ].id;
		}
		return null;
	}
);

/**
 * Is valid field.
 *
 * @param {Object} state   Global application state.
 * @param {string} id      Field id.
 *
 * @return {boolean} showErr flag
 */
export function isValidField( state, id ) {
	const isValid = state.answers[ id ]?.isValid;
	return isValid;
}

/**
 * Get field validation error message.
 *
 * @param {Object} state   Global application state.
 * @param {string} id      Field id.
 *
 * @return {string} Field validation error message
 */
export function getFieldValidationErr( state, id ) {
	const validationErr = state.answers[ id ]?.validationErr;
	return validationErr ? validationErr : [];
}
