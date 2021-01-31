/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * WordPress Dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction } from 'lodash';

/**
 * Internal Dependencies
 */
import { isValidIcon } from './utils';
import defaultBlockIcon from './default-icon';

/**
 * Set block admin settings.
 * Block admin settings is the configuration for the block that should be loaded at the admin only.
 * We should define here the block icon, controls, color and logic control.
 *
 * @param {string} type       Block type.
 * @param {Object} settings   Block configuration.
 *
 */
export const setBlockAdminSettings = ( type, settings ) => {
	settings = {
		type,
		color: '#333s',
		icon: defaultBlockIcon,
		controls: () => null,
		logicControl: () => null,
		...settings,
	};

	if ( typeof type !== 'string' ) {
		console.error( 'Block types must be strings.' );
		return;
	}

	const blockType = select( 'quillForms/blocks' ).getBlockType( type );
	if ( ! blockType ) {
		console.error(
			`The ${ type } block isn't registered. Please register it first!`
		);
		return;
	}

	if ( typeof settings.color !== 'string' ) {
		console.error( 'The "color" property must be a valid string!' );
	}
	if ( ! isValidIcon( settings.icon ) ) {
		console.error( 'The "icon" property must be a valid function!' );
		return;
	}

	if ( ! isFunction( settings.logicControl ) ) {
		console.error(
			'The "logicControl" property must be a valid function!'
		);
		return;
	}

	if ( ! isFunction( settings.controls ) ) {
		console.error( 'The "controls" property must be a valid function!' );
		return;
	}

	dispatch( 'quillForms/blocks' ).setBlockAdminSettings( settings );
};
