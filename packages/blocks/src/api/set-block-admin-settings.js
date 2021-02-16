/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * WordPress Dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction, pick } from 'lodash';

/**
 * Internal Dependencies
 */
import { isValidIcon, normalizeIconObject } from './utils';
import defaultBlockIcon from './default-icon';

/**
 * Set block admin settings.
 * Block admin settings is the configuration for the block that should be loaded at the admin only.
 * We should define here the block icon, controls, color and logic control.
 *
 * @param {string} name       Block name.
 * @param {Object} settings   Block configuration.
 *
 */
export const setBlockAdminSettings = ( name, settings ) => {
	settings = {
		name,
		title: 'Untitled',
		color: '#333s',
		icon: defaultBlockIcon,
		controls: () => null,
		logicControl: () => null,
		...settings,
	};

	if ( typeof name !== 'string' ) {
		console.error( 'Block types must be strings.' );
		return;
	}

	const blockType = select( 'quillForms/blocks' ).getBlockType( name );
	if ( ! blockType ) {
		console.error(
			`The ${ name } block isn't registered. Please register it first!`
		);
		return;
	}

	if ( typeof settings.color !== 'string' ) {
		console.error( 'The "color" property must be a valid string!' );
	}

	settings.icon = normalizeIconObject( settings.icon );

	if ( ! isValidIcon( settings.icon.src ) ) {
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

	dispatch( 'quillForms/blocks' ).setBlockAdminSettings(
		pick( settings, [
			'controls',
			'logicControl',
			'color',
			'icon',
			'name',
			'title',
		] )
	);
};
