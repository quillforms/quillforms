/**
 * Get all panels.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered panels
 */
export function getPanels( state ) {
	return state.panels;
}

/**
 * Get visible panels.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered panels
 */
export function getVisiblePanels( state ) {
	return state.panels.filter( ( panel ) => panel.isHidden !== true );
}

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
export function getCurrentPanelObj( state ) {
	return state.panels.find(
		( panel ) => panel.name === getCurrentPanel( state )
	);
}

/**
 * Get current sub panel object
 *
 * @param {Object} state
 *
 * @return {Object} Current sub panel object
 */
export function getCurrentSubPanelObj( state ) {
	if ( state.currentSubPanel )
		return getCurrentPanelObj( state ).subPanels.find(
			( subPanel ) => subPanel.name === state.currentSubPanel
		);
}

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
