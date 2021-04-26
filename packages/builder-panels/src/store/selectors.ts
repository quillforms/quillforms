import createSelector from 'rememo';
import { find, filter } from 'lodash';
import type { PanelsState, Panel, SubPanel } from '../types';

/**
 * Returns all panels.
 *
 * Note: It's important to memoize this selector to avoid return a new instance
 * on each call.
 *
 * @param {PanelsState}  state        Panels state.
 *
 * @return {Panel[]} Builder Panels.
 */
export const getPanels = createSelector(
	( state: PanelsState ): Panel[] => {
		return state.panels;
	},
	( state: PanelsState ) => [ state.panels.length ]
);

/**
 * Get all panels which have parent mode.
 *
 * @param {PanelsState} state      Global application state.
 *
 * @return {Panel[]} Parent panels.
 */
export const getParentPanels = createSelector(
	( state: PanelsState ): Panel[] => {
		return filter( state.panels, ( panel ) => panel.mode === 'parent' );
	},
	( state: PanelsState ) => [ state.panels.length ]
);

/**
 * Get panel by name
 *
 * @param {PanelsState } state          Global application state.
 * @param {string}       panelName      Panel name.
 *
 * @return {?Panel}  Panel object
 */
export const getPanelByName = (
	state: PanelsState,
	panelName: string
): Panel | undefined => {
	const panels = getPanels( state );
	return panels.find( ( panel ) => panel.name === panelName );
};

/**
 * Get visible panels.
 *
 * @param {PanelsState} state       Global application state.
 *
 * @return {Panel[]} Registered panels
 */
export const getVisiblePanels = createSelector(
	( state: PanelsState ): Panel[] => {
		return state.panels.filter( ( panel ) => panel.isHidden !== true );
	},
	( state: PanelsState ) => [ state.panels.length ]
);

/**
 * Get current panel.
 *
 * @param {PanelsState} state       Global application state.
 *
 * @return {?string} Current panel
 */
export function getCurrentPanelName( state: PanelsState ): string | undefined {
	return state.currentPanel;
}

/**
 * Get current panel object.
 *
 * @param {PanelsState} state       Global application state.
 *
 * @return {?Panel} Current panel object
 */
export const getCurrentPanel = createSelector(
	( state: PanelsState ): Panel | undefined => {
		const currentPanelName = getCurrentPanelName( state );
		if ( currentPanelName ) {
			return find(
				state?.panels,
				( panel ) => panel.name === currentPanelName
			);
		}
		return undefined;
	},
	( state: PanelsState ) => [ state?.panels.length, state?.currentPanel ]
);

/**
 * Get current sub panel object
 *
 * @param {PanelsState} state
 *
 * @return {Object} Current sub panel object
 */
export const getCurrentSubPanel = createSelector(
	( state: PanelsState ): SubPanel | undefined => {
		const currentPanel = getCurrentPanel( state );
		if ( state.currentSubPanel && currentPanel ) {
			return currentPanel?.subPanels?.find(
				( subPanel ) => subPanel.name === state.currentSubPanel
			);
		}
		return undefined;
	},
	( state: PanelsState ) => [
		state?.panels.length,
		state?.currentSubPanel,
		state?.currentPanel,
	]
);

/**
 * Get current sub panel.
 *
 * @param {PanelsState} state       Global application state.
 *
 * @return {?string} Current sub panel
 */
export function getCurrentSubPanelName(
	state: PanelsState
): string | undefined {
	return state.currentSubPanel;
}

/**
 * Get area to show.
 *
 * @param {PanelsState} state       Global application state.
 *
 * @return {?string} Area to show
 */
export function getAreaToShow( state: PanelsState ): string | undefined {
	return getCurrentPanel( state )?.areaToShow;
}
