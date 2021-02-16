import createSelector from 'rememo';

/**
 * Returns all block objects.
 *
 * Note: It's important to memoize this selector to avoid return a new instance
 * on each call.
 *
 * @param {Object}  state        Editor state.
 *
 * @return {Object[]} Post blocks.
 */
export const getPanels = createSelector(
	( state ) => {
		return state.panels;
	},
	( state ) => [ state.panels.length ]
);

/**
 * Get visible panels.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered panels
 */
export const getVisiblePanels = createSelector(
	( state ) => {
		return state.panels.filter( ( panel ) => panel.isHidden !== true );
	},
	( state ) => [ state.panels.length ]
);

/**
 * Get current panel.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current panel
 */
export function getCurrentPanel( state ) {
	return state.currentPanel;
}

/**
 * Get current panel object.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} Current panel object
 */
export const getCurrentPanelObj = createSelector(
	( state ) => {
		return state.panels.find(
			( panel ) => panel.name === getCurrentPanel( state )
		);
	},
	( state ) => [ state.panels.length, state.currentPanel ]
);

/**
 * Get current sub panel object
 *
 * @param {Object} state
 *
 * @return {Object} Current sub panel object
 */
export const getCurrentSubPanelObj = createSelector(
	( state ) => {
		if ( state.currentSubPanel )
			return getCurrentPanelObj( state ).subPanels.find(
				( subPanel ) => subPanel.name === state.currentSubPanel
			);
	},
	( state ) => [
		state.panels.length,
		state.currentSubPanel,
		state.currentPanel,
	]
);

/**
 * Get current sub panel.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current sub panel
 */
export function getCurrentSubPanel( state ) {
	return state.currentSubPanel;
}

/**
 * Get area to hide.
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Area to hide
 */
export function getAreaToHide( state ) {
	return state.areaToHide;
}
