import {
	SET_THEME_PROPERTIES,
	SET_SHOULD_BE_SAVED,
	SET_CURRENT_THEME_ID,
	SETUP_STORE,
	ADD_NEW_THEME,
} from './constants';

/**
 * External dependencies
 */
import { reduce, uniqueId } from 'lodash';

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
 * Reducer returning an array of registered blocks.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const ThemeReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		// SET UP STORE
		case SETUP_STORE: {
			const { initialPayload } = action.payload;
			const { currentTheme, currentThemeId, themesList } = initialPayload;
			const stateClone = {
				currentThemeId,
				currentTheme,
				themesList,
				shouldBeSaved: false,
			};
			return stateClone;
		}

		// SET THEME PROPERTIES
		case SET_THEME_PROPERTIES: {
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

			// Skip update if nothing has been changed. The reference will
			// match the original block if `reduce` had no changed values.
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
			const { id, themeData } = action.payload;
			const $themesList = [ ...state.themesList ];
			$themesList.push( { id, theme_data: themeData } );
			const stateClone = { ...state, themesList: $themesList };
			return stateClone;
		}
	}

	return state;
};

export default ThemeReducer;
