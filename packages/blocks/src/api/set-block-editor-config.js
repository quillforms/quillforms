import { dispatch } from '@wordpress/data';
/**
 * Set block editor configuration.
 * Block editor configuration is the configuration for the block that should be loaded at the builder only.
 * We should define here the block icon, controls, color, ...etc.
 *
 * @param {string} type       Block type.
 * @param {Object} settings   Block configuration.
 *
 */
export const setBlockEditorConfig = ( type, settings ) => {
	settings = {
		type,
		...settings,
	};
	dispatch( 'quillForms/blocks' ).addBlockEditorConfig( settings );
};
