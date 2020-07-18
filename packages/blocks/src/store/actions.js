import {
	SET_BLOCK_RENDERER_CONFIG,
	SET_BLOCK_EDITOR_CONFIG,
} from './constants';

/**
 * Returns an action object used in registering block UI settings.
 *
 * @param {Object} blockRendererConfig Block renderer settings which should define its output behavior
 *
 * @return {Object} Action object.
 */
export const addBlockRendererConfig = ( blockRendererConfig ) => {
	return {
		type: SET_BLOCK_RENDERER_CONFIG,
		payload: blockRendererConfig,
	};
};

/**
 * Returns an action object used in registering block Configuration.
 *
 * @param {Object} blockEditorConfig Block edito config which should have icon, color and controls
 *
 * @return {Object} Action object.
 */
export const addBlockEditorConfig = ( blockEditorConfig ) => {
	return {
		type: SET_BLOCK_EDITOR_CONFIG,
		payload: blockEditorConfig,
	};
};
