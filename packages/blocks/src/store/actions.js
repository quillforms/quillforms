import {
	SET_BLOCK_RENDERER_CONFIG,
	SET_BLOCK_EDITOR_CONFIG,
	REGISTER_SERVER_SIDE_BLOCKS,
} from './constants';

/**
 * Returns an action object used in registering block renderer settings.
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
 * Returns an action object used in registering block editor configuration.
 *
 * @param {Object} blockEditorConfig Block editor config which should have icon, color and controls
 *
 * @return {Object} Action object.
 */
export const addBlockEditorConfig = ( blockEditorConfig ) => {
	return {
		type: SET_BLOCK_EDITOR_CONFIG,
		payload: blockEditorConfig,
	};
};

/**
 * Returns an action object used in registring blocks from server side.
 *
 * @param {Object} blocks The registered blocks.
 *
 * @return {Object} Action object.
 */
export const __unstableRegisterServerSideBlocks = ( blocks ) => {
	return {
		type: REGISTER_SERVER_SIDE_BLOCKS,
		payload: { blocks },
	};
};
