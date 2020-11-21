import {
	SET_FIELD_ANSWER,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_IS_FIELD_ANSWERED,
	SET_FIELD_VALIDATION_ERR,
} from './constants';

const initialState = {
	answers: [],
	isReviewing: false,
	isSubmitting: false,
};

const AnswersReducer = ( state = initialState, action ) => {
	const { answers } = state;
	switch ( action.type ) {
		// Insert Empty Field Answer
		case INSERT_EMPTY_FIELD_ANSWER: {
			const { id, type } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			const $state = { ...state };
			const $answers = [ ...$state.answers ];

			if ( index === -1 ) {
				$answers.push( {
					value: [],
					isValid: true,
					isAnswered: false,
					validationErr: null,
					id,
					type,
				} );
			}
			$state.answers = $answers;
			return $state;
		}

		// SET FIELD ANSWER
		case SET_FIELD_ANSWER: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			if ( index === -1 ) {
				return state;
			}
			const $state = { ...state };
			const $answers = [ ...$state.answers ];

			$answers[ index ].value = val;
			$state.answers = $answers;
			return $state;
		}

		// SET IS FIELD VALID
		case SET_IS_FIELD_VALID: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			if ( index === -1 ) {
				return state;
			}
			const $state = { ...state };
			const $answers = [ ...$state.answers ];

			$answers[ index ].isValid = val;
			$state.answers = $answers;
			return $state;
		}

		// SET IS FIELD ANSWERED
		case SET_IS_FIELD_ANSWERED: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			if ( index === -1 ) {
				return state;
			}
			const $state = { ...state };
			const $answers = [ ...$state.answers ];
			$answers[ index ].isAnswered = val;
			$state.answers = $answers;

			return $state;
		}

		// SET FIELD VALIDATION ERR
		case SET_FIELD_VALIDATION_ERR: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			if ( index === -1 ) {
				return state;
			}
			const $state = { ...state };
			const $answers = [ ...$state.answers ];
			$answers[ index ].validationErr = val;
			$state.answers = $answers;
			return $state;
		}
	}
	return state;
};

export default AnswersReducer;
