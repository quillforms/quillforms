/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { select, dispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction, pick } from 'lodash';

import type { BlockRendererSettings } from '../types';
/**
 * Set block renderer settings
 * Set block renderer settings is for defining renderer behavior for the block
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block renderer settings.
 *
 */
export const setBlockRendererSettings = (
	name: string,
	settings: BlockRendererSettings
): BlockRendererSettings | undefined => {
	settings = {
		display: () => null,
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

	if ( ! isFunction( settings.display ) ) {
		console.error( 'The "display" property must be a valid function!' );
		return;
	}

	if ( settings.mergeTag && ! isFunction( settings.mergeTag ) ) {
		console.error( 'The "mergeTag" property must be a valid function!' );
		return;
	}

	if ( settings.counterIcon && ! isFunction( settings.counterIcon ) ) {
		console.error( 'The "counterIcon" property must be a valid function!' );
		return;
	}

	if ( settings.nextBtn && ! isFunction( settings.nextBtn ) ) {
		console.error( 'The "nextBtn" property must be a valid function!' );
		return;
	}

	dispatch( 'quillForms/blocks' ).setBlockRendererSettings(
		pick( settings, [ 'display', 'mergeTag', 'nextBtn', 'counterIcon' ] ),
		name
	);

	return settings;
};
