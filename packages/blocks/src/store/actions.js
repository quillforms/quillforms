import {
	SET_BLOCK_ADMIN_SETTINGS,
	ADD_BLOCK_TYPES,
	SET_BLOCK_RENDERER_SETTINGS,
} from './constants';

import { castArray } from 'lodash';

/**
 * Returns an action object used in registering block renderer settings.
 *
 * @param {Object} blockRendererSettings Block renderer settings which define block renderer behavior.
 *
 * @return {Object} Action object.
 */
export const setBlockRendererSettings = ( blockRendererSettings ) => {
	return {
		type: SET_BLOCK_RENDERER_SETTINGS,
		settings: blockRendererSettings,
	};
};

/**
 * Returns an action object used in registering block editor configuration.
 *
 * @param {Object} blockAdminSettings Block admin settings which defines block behavior at admin.
 *
 * @return {Object} Action object.
 */
export const setBlockAdminSettings = ( blockAdminSettings ) => {
	return {
		type: SET_BLOCK_ADMIN_SETTINGS,
		settings: blockAdminSettings,
	};
};

/**
 * Returns an action object used in signalling that block types have been added.
 *
 * @param {Array|Object} blockTypes Block types received.
 *
 * @return {Object} Action object.
 */
export function addBlockTypes( blockTypes ) {
	return {
		type: ADD_BLOCK_TYPES,
		blockTypes: castArray( blockTypes ),
	};
}
