/**
 * External Dependencies
 */
import { some, findIndex } from 'lodash';

import type { PanelsState, PanelActionTypes } from '../types';
import type { Reducer } from 'redux';
import {
	SET_CURRENT_PANEL,
	REGISTER_BUILDER_SUBPANEL,
	REGISTER_BUILDER_PANEL,
	SET_CURRENT_SUBPANEL,
} from './constants';

const initialState: PanelsState = {
	panels: [],
	currentPanel: 'blocks',
	currentSubPanel: undefined,
	areaToShow: undefined,
};

/**
 * Reducer returning the UI state.
 *
 * @param {PanelsState} state  Current state.
 * @param {PanelActionTypes} action Dispatched action.
 *
 * @return {PanelsState} Updated state.
 */
const PanelReducer: Reducer< PanelsState, PanelActionTypes > = (
	state = initialState,
	action
): PanelsState => {
	switch ( action.type ) {
		// Register Builder Panel
		case REGISTER_BUILDER_PANEL: {
			const panelName = action.name;
			if ( some( state.panels, ( panel ) => panel.name === panelName ) ) {
				return state;
			}

			const panelSettings = action.settings;

			return {
				...state,
				panels: [
					...state.panels,
					{
						...panelSettings,
						name: panelName,
					},
				],
			};
		}

		// Register Builder Sub Panel
		case REGISTER_BUILDER_SUBPANEL: {
			const { parent } = action;
			const parentIndex = findIndex(
				state.panels,
				( panel ) => panel.name === parent
			);

			if (
				parentIndex === -1 ||
				state.panels[ parentIndex ].mode !== 'parent'
			) {
				return state;
			}

			let subPanels = state.panels[ parentIndex ].subPanels;

			if ( ! subPanels ) {
				subPanels = [];
			}

			subPanels.push( {
				...action.settings,
				name: action.name,
			} );

			const newStatePanels = state.panels;
			newStatePanels[ parentIndex ][ 'subPanels' ] = subPanels;
			return {
				...state,
				panels: newStatePanels,
			};
		}

		// Set Current Panel
		case SET_CURRENT_PANEL: {
			// Do nothing if there is no panel with this name.
			if (
				action.panelName &&
				! some(
					state.panels,
					( panel ) => panel.name === action.panelName
				)
			) {
				return state;
			}
			return {
				...state,
				currentPanel: action.panelName,
			};
		}

		// Set Current SubPanel
		case SET_CURRENT_SUBPANEL: {
			// Do nothing if current parent panel isn't set.
			if ( ! state.currentPanel ) {
				return state;
			}

			const currentPanel = state.panels.find(
				( panel ) => panel.name === state.currentPanel
			);
			if (
				! currentPanel ||
				! some(
					currentPanel[ 'subPanels' ],
					( subPanel ) => subPanel.name === action.subPanelName
				)
			) {
				return state;
			}
			return {
				...state,
				currentSubPanel: action.subPanelName,
			};
		}
	}
	return state;
};

export default PanelReducer;
export type State = ReturnType< typeof PanelReducer >;
