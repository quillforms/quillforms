import {
	SET_FIELD_ANSWER,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_IS_FIELD_ANSWERED,
} from './actionTypes';

const initialState = {
	answersList: [],
};

const AnswersReducer = ( state = initialState, action ) => {
	const $state = { ...state };
	const answers = $state.answersList;
	switch ( action.type ) {
		// Insert Empty Field Answer
		case INSERT_EMPTY_FIELD_ANSWER: {
			const { id, type } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			if ( index === -1 ) {
				answers.push( {
					value: [],
					isValid: true,
					isAnswered: false,
					id,
					type,
				} );
			}
			$state.answersList = answers;
			return $state;
		}

		// SET FIELD ANSWER
		case SET_FIELD_ANSWER: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			answers[ index ].value = val;
			$state.answersList = answers;
			return $state;
		}

		// SET IS FIELD VALID
		case SET_IS_FIELD_VALID: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			answers[ index ].isValid = val;
			$state.answersList = answers;
			return $state;
		}

		// SET IS FIELD ANSWERED
		case SET_IS_FIELD_ANSWERED: {
			const { id, val } = action.payload;
			const index = answers.findIndex( ( answer ) => {
				return answer.id === id;
			} );
			answers[ index ].isAnswered = val;
			$state.answersList = answers;
			return $state;
		}
	}
	return $state;
};

export default AnswersReducer;
