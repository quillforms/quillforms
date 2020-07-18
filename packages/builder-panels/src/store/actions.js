import {
	SET_CURRENT_PANEL,
	SET_CURRENT_SUBPANEL,
	REGISTER_BUILDER_PANEL,
	REGISTER_BUILDER_SUBPANEL,
} from './constants';

/**
 * Set Current Panel
 *
 * @param {string} panelName panel name
 *
 * @return {Object} Action object.
 */
export const setCurrentPanel = ( panelName ) => {
	return {
		type: SET_CURRENT_PANEL,
		payload: panelName,
	};
};

/**
 * Set Current Sub Panel
 *
 * @param {string} subPanelName Subpanel name
 *
 * @return {Object} Action object.
 */
export const setCurrentSubPanel = ( subPanelName ) => {
	return {
		type: SET_CURRENT_SUBPANEL,
		payload: subPanelName,
	};
};

/**
 * Register Builder Panel
 *
 * @param {Object} panelSettings Panel settings
 *
 * @return {Object} Action object.
 */
export const registerBuilderPanel = ( panelSettings ) => {
	return {
		type: REGISTER_BUILDER_PANEL,
		payload: panelSettings,
	};
};

/**
 * Register Builder Subpanel
 *
 * @param {Object} subPanelSettings Sub panel settings
 *
 * @return {Object} Action object.
 */
export const registerBuilderSubPanel = ( subPanelSettings ) => {
	return {
		type: REGISTER_BUILDER_SUBPANEL,
		payload: subPanelSettings,
	};
};
