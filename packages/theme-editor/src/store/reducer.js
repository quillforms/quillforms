import {
	SET_SHOULD_BE_SAVED,
	SET_CURRENT_THEME_ID,
	ADD_NEW_THEME_SUCCESS,
	ADD_NEW_THEMES,
	SET_CURRENT_THEME_PROPERTIES,
	DELETE_THEME_SUCCESS,
	UPDATE_THEME_SUCCESS,
	SET_IS_SAVING,
	SET_CURRENT_THEME_TITLE,
	SETUP_THEMES,
} from './constants';

const initialState = {
	currentThemeId: null,
	currentTheme: {},
	shouldBeSaved: false,
	themesList: [],
	isSaving: false,
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
			const nextProperties = {
				...state.currentTheme.properties,
				...properties,
			};

			// Skip update if nothing has been changed.
			if (
				JSON.stringify( nextProperties ) ===
				JSON.stringify( state.currentTheme.properties )
			) {
				return state;
			}

			// Otherwise replace properties in state
			return {
				...state,
				currentTheme: {
					...state.currentTheme,
					properties: nextProperties,
				},
				shouldBeSaved: true,
			};
		}

		case SET_CURRENT_THEME_TITLE: {
			if ( action.title === state.currentTheme.title ) {
				return state;
			}
			// Otherwise replace properties in state
			return {
				...state,
				currentTheme: {
					...state.currentTheme,
					title: action.title,
				},
				shouldBeSaved: true,
			};
		}

		// SET CURRENT THEME ID
		case SET_CURRENT_THEME_ID: {
			const { currentThemeId } = action.payload;
			const $themesList = [ ...state.themesList ];
			const themeIndex = $themesList.findIndex(
				( theme ) => theme.id === currentThemeId
			);
			if ( themeIndex === -1 ) {
				return {
					...state,
					currentThemeId: null,
					currentTheme: {},
				};
			}

			const stateClone = {
				...state,
				currentThemeId,
				currentTheme: {
					title: $themesList[ themeIndex ].title,
					properties: $themesList[ themeIndex ].properties,
				},
			};

			return stateClone;
		}

		// SET SHOULD BE SAVED
		case SET_SHOULD_BE_SAVED: {
			const { shouldBeSaved } = action.payload;
			const stateClone = { ...state, shouldBeSaved };
			return stateClone;
		}

		case ADD_NEW_THEME_SUCCESS: {
			const { themeId, themeTitle, themeProperties } = action.payload;
			const $themesList = [ ...state.themesList ];
			$themesList.push( {
				id: themeId,
				title: themeTitle,
				properties: themeProperties,
			} );
			const stateClone = {
				...state,
				themesList: $themesList,
				currentThemeId: themeId,
			};
			return stateClone;
		}

		case SETUP_THEMES: {
			const { themes } = action.payload;
			if ( themes?.length > 0 )
				return {
					...state,
					themesList: [ ...themes ],
				};
			return state;
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
			const isCurrentTheme = themeId === state.currentThemeId;
			return {
				...state,
				themesList: [ ...state.themesList ].filter(
					( theme ) => theme.id !== themeId
				),
				currentTheme: isCurrentTheme ? {} : state.currentTheme,
				currentThemeId: isCurrentTheme ? null : state.currentThemeId,
			};
		}

		case UPDATE_THEME_SUCCESS: {
			const { themeId, themeTitle, themeProperties } = action.payload;
			const $themesList = [ ...state.themesList ];
			const themeIndex = $themesList.findIndex(
				( theme ) => theme.id === themeId
			);
			if ( themeIndex === -1 ) return state;
			$themesList[ themeIndex ].title = themeTitle;
			$themesList[ themeIndex ].properties = themeProperties;
			const stateClone = { ...state, themesList: $themesList };
			return stateClone;
		}

		case SET_IS_SAVING: {
			const { flag } = action.payload;
			return {
				...state,
				isSaving: flag,
			};
		}
	}

	return state;
};

export default ThemeReducer;
