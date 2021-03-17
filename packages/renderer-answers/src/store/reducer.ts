import {
	SET_FIELD_ANSWER,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_IS_FIELD_ANSWERED,
	SET_FIELD_VALIDATION_ERR,
} from './constants';

const initialState = {
	answers: {},
};

const AnswersReducer = ( state = initialState, action ) => {
	const { answers } = state;
	switch ( action.type ) {
		// Insert Empty Field Answer
		case INSERT_EMPTY_FIELD_ANSWER: {
			const { id, type } = action.payload;
			const $state = { ...state };
			const $answers = { ...$state.answers };

			if ( ! $answers[ id ] ) {
				$answers[ id ] = {
					value: [],
					isValid: true,
					isAnswered: false,
					validationErr: null,
					type,
				};
			}
			$state.answers = $answers;
			// console.log( $state );
			return $state;
		}

		// SET FIELD ANSWER
		case SET_FIELD_ANSWER: {
			const { id, val } = action.payload;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! answers[ id ] || val === answers[ id ].value ) {
				return state;
			}
			const $state = { ...state };
			const $answers = { ...$state.answers };

			$answers[ id ].value = val;
			$state.answers = $answers;
			return $state;
		}

		// SET IS FIELD VALID
		case SET_IS_FIELD_VALID: {
			const { id, val } = action.payload;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! answers[ id ] || val === answers[ id ].isValid ) {
				return state;
			}
			const $state = { ...state };
			const $answers = { ...$state.answers };

			$answers[ id ].isValid = val;
			$state.answers = $answers;
			return $state;
		}

		// SET IS FIELD ANSWERED
		case SET_IS_FIELD_ANSWERED: {
			const { id, val } = action.payload;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! answers[ id ] || val === answers[ id ].isAnswered ) {
				return state;
			}
			const $state = { ...state };
			const $answers = { ...$state.answers };

			$answers[ id ].isAnswered = val;
			$state.answers = $answers;
			return $state;
		}

		// SET FIELD VALIDATION ERR
		case SET_FIELD_VALIDATION_ERR: {
			const { id, val } = action.payload;
			// If the field id is incorrect or the value passed is the same value, return same state.
			if ( ! answers[ id ] || val === answers[ id ].validationErr ) {
				return state;
			}
			const $state = { ...state };
			const $answers = { ...$state.answers };

			$answers[ id ].validationErr = val;
			$state.answers = $answers;
			return $state;
		}
	}
	return state;
};

export default AnswersReducer;
