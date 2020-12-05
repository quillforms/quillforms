import {
	SET_SHOULD_BE_SAVED,
	SET_CURRENT_THEME_ID,
	ADD_NEW_THEME,
	ADD_NEW_THEMES,
	SET_CURRENT_THEME_PROPERTIES,
	DELETE_THEME_SUCCESS,
} from './constants';

/**
 * External dependencies
 */
import { reduce } from 'lodash';

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

const initialState = {
	currentThemeId: null,
	currentTheme: {},
	shouldBeSaved: false,
	themesList: [],
};
/**
 * Themes Reducer
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const ThemeReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		// SET THEME PROPERTIES
		case SET_CURRENT_THEME_PROPERTIES: {
			const { properties } = action.payload;
			// Consider as updates only changed values
			const nextProperties = reduce(
				properties,
				( result, value, key ) => {
					if ( value !== result[ key ] ) {
						result = getMutateSafeObject(
							state.currentTheme,
							result
						);
						result[ key ] = value;
					}

					return result;
				},
				state.currentTheme
			);

			// Skip update if nothing has been changed.
			if ( nextProperties === state.currentTheme ) {
				return state;
			}

			// Otherwise replace attributes in state
			const stateClone = { ...state };
			stateClone.currentTheme = nextProperties;
			return stateClone;
		}

		// SET CURRENT THEME ID
		case SET_CURRENT_THEME_ID: {
			const { currentThemeId } = action.payload;
			const stateClone = { ...state, currentThemeId };
			return stateClone;
		}

		// SET SHOULD BE SAVED
		case SET_SHOULD_BE_SAVED: {
			const { shouldBeSaved } = action.payload;
			const stateClone = { ...state, shouldBeSaved };
			return stateClone;
		}

		case ADD_NEW_THEME: {
			const { themeId, themeTitle, themeData } = action.payload;
			const $themesList = [ ...state.themesList ];
			$themesList.push( {
				id: themeId,
				title: themeTitle,
				theme_data: themeData,
			} );
			const stateClone = { ...state, themesList: $themesList };
			return stateClone;
		}

		case ADD_NEW_THEMES: {
			const { themes } = action.payload;
			if ( themes?.length > 0 )
				return {
					...state,
					themesList: [ ...state.themesList, ...themes ],
				};
			return state;
		}

		case DELETE_THEME_SUCCESS: {
			const { themeId } = action.payload;
			return {
				...state,

				themesList: [ ...state.themesList ].filter(
					( theme ) => theme.id !== themeId
				),
			};
		}
	}

	return state;
};

export default ThemeReducer;
