import {
	SET_CURRENT_PANEL,
	SET_CURRENT_SUBPANEL,
	REGISTER_BUILDER_PANEL,
	REGISTER_BUILDER_SUBPANEL,
} from './constants';

// eslint-disable-next-line prettier/prettier
import type {
	PanelActionTypes,
	PanelSettings,
	SubPanelSettings,
} from '../types';

/**
 * Set Current Panel
 *
 * @param {string} panelName panel name
 *
 * @return {PanelActionTypes} Action object.
 */
export const setCurrentPanel = ( panelName: string ): PanelActionTypes => {
	return {
		type: SET_CURRENT_PANEL,
		panelName,
	};
};

/**
 * Set Current Sub Panel
 *
 * @param {string} subPanelName Subpanel name
 *
 * @return {PanelActionTypes} Action object.
 */
export const setCurrentSubPanel = (
	subPanelName: string
): PanelActionTypes => {
	return {
		type: SET_CURRENT_SUBPANEL,
		subPanelName,
	};
};

/**
 * Register Builder Panel
 *
 * @param {PanelSettings} panelSettings Panel settings
 * @param {string}        name          Panel name
 *
 * @return {PanelActionTypes} Action object.
 */
export const registerBuilderPanel = (
	name: string,
	panelSettings: PanelSettings
): PanelActionTypes => {
	return {
		type: REGISTER_BUILDER_PANEL,
		settings: panelSettings,
		name,
	};
};

/**
 * Register Builder Subpanel
 *
 * @param {string}           name             Panel name
 * @param {SubPanelSettings} subPanelSettings Sub panel settings
 * @param {string}           parent           Panel parent
 *
 * @return {PanelActionTypes} Action object.
 */
export const registerBuilderSubPanel = (
	name: string,
	subPanelSettings: SubPanelSettings,
	parent: string
): PanelActionTypes => {
	return {
		type: REGISTER_BUILDER_SUBPANEL,
		settings: subPanelSettings,
		parent,
		name,
	};
};
