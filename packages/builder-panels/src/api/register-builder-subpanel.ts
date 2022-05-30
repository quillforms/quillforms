/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * WordPress Dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { isFunction, pick, some } from 'lodash';

/**
 * Internal Dependencies
 */
import type { SubPanelSettings } from '../types';

/**
 * Register Builder Sub Panel
 *
 * @param {string}                 name      Subpanel unique name.
 * @param {SubPanelSettings} 	   settings  Subpanel settings.
 *
 */
export const registerBuilderSubPanel = (
	name: string,
	settings: SubPanelSettings
): SubPanelSettings | undefined => {
	settings = applyFilters(
		'QuillForms.BuilderPanels.SubPanelSettings',
		settings,
		name
	) as SubPanelSettings;
	if ( typeof name !== 'string' ) {
		console.error( 'Builder subpanel names must be strings.' );
		return;
	}

	const regexMatch = name.match( /^([a-z][a-z0-9-]*)\/[a-z][a-z0-9-]*$/ );
	if ( ! regexMatch || ! regexMatch[ 1 ] ) {
		console.error(
			'Builder subpanel name must contain the parent namespace prefix. Example: parent-panel/subpanel-panel'
		);
		return;
	}

	const parent = regexMatch[ 1 ];
	const parentPanels = select(
		'quillForms/builder-panels'
	).getParentPanels();

	if ( ! some( parentPanels, ( panel ) => panel.name === parent ) ) {
		console.error(
			`Builder sub panel parent ${ parent } isn't registered. Please register it first!`
		);
		return;
	}

	if ( ! settings.title ) {
		console.error( "The 'title' property must be passed" );
		return;
	}

	if ( typeof settings.title !== 'string' ) {
		console.error( "The 'title' property must be a string" );
		return;
	}

	if ( ! settings.render ) {
		console.error( "The 'render' property is mandatory" );
		return;
	}

	if ( ! isFunction( settings.render ) ) {
		console.error( "The 'render' property must be a valid function" );
		return;
	}

	if ( settings.position && typeof settings.position !== 'number' ) {
		console.error( 'The "position" property must be a number' );
		return;
	}

	if ( settings.position !== 0 && ! settings.position ) {
		// Default position
		settings.position = 10;
	}

	settings = pick( settings, [ 'title', 'render', 'position' ] );

	dispatch( 'quillForms/builder-panels' ).registerBuilderSubPanel(
		name,
		settings,
		parent
	);

	return settings;
};
