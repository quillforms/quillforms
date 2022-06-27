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
import { isValidIcon, normalizeIconObject } from '@quillforms/utils';
import { BlockAdminSettings } from '../types';

/**
 * Set block admin settings.
 * Block admin settings is the configuration for the block that should be loaded at the admin only.
 * We should define here the block icon, controls, color and logic control.
 *
 * @param {string}             name       Block name.
 * @param {BlockAdminSettings} settings   Block configuration.
 *
 */
export const setBlockAdminSettings = (
	name: string,
	settings: BlockAdminSettings
): BlockAdminSettings | void => {
	settings = {
		title: 'Untitled',
		color: '#333s',
		icon: 'plus',
		order: 20,
		controls: () => null,
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

	if ( settings.logicControl && ! isFunction( settings.logicControl ) ) {
		console.error(
			'The "logicControl" property must be a valid function!'
		);
		return;
	}

	if ( settings.entryDetails && ! isFunction( settings.entryDetails ) ) {
		console.error(
			'The "entryDetails" property must be a valid function!'
		);
		return;
	}

	if ( ! isFunction( settings.controls ) ) {
		console.error( 'The "controls" property must be a valid function!' );
		return;
	}

	if ( settings.order && isNaN( settings.order ) ) {
		console.error( 'The "order" property must be a valid number!' );
		return;
	}

	if ( ! isFunction( settings.getChoices ) ) {
		// @ts-ignore
		settings.getChoices = ( { id, attributes } ) => {
			return [];
		};
	}

	dispatch( 'quillForms/blocks' ).setBlockAdminSettings(
		pick( settings, [
			'controls',
			'entryDetails',
			'logicControl',
			'color',
			'icon',
			'title',
			'order',
			'getChoices',
		] ),
		name
	);
};
