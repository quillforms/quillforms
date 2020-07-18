import {
	SET_CURRENT_PANEL,
	REGISTER_BUILDER_SUBPANEL,
	REGISTER_BUILDER_PANEL,
	SET_CURRENT_SUBPANEL,
} from './constants';

const initialState = {
	panels: [],
	currentPanel: 'blocks',
	currentSubPanel: null,
	areaToHide: null,
};

/**
 * Reducer returning the UI state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
const PanelReducer = ( state = initialState, action ) => {
	const $state = { ...state };

	switch ( action.type ) {
		// Register Builder Panel
		case REGISTER_BUILDER_PANEL: {
			const panel = action.payload;
			panel.subPanels = [];
			const { panels } = $state;
			panels.push( panel );
			$state.panels = panels;
			return $state;
		}

		// Register Builder Sub Panel
		case REGISTER_BUILDER_SUBPANEL: {
			const { panels } = $state;
			const { parent } = action.payload;
			// console.log(parent);
			const parentIndex = panels.findIndex(
				( panel ) => panel.name === parent
			);
			panels[ parentIndex ].subPanels.push( action.payload );
			return $state;
		}

		// Set Current Panel
		case SET_CURRENT_PANEL: {
			const { panels } = $state;
			$state.currentPanel = action.payload;
			if ( action.payload ) {
				const panelObj = panels.find(
					( panel ) => panel.name === action.payload
				);
				$state.areaToHide = panelObj.areaToHide;
			} else {
				$state.areaToHide = '';
			}
			return $state;
		}

		// Set Current SubPanel
		case SET_CURRENT_SUBPANEL: {
			$state.currentSubPanel = action.payload;
			return $state;
		}
	}
	return $state;
};

export default PanelReducer;
