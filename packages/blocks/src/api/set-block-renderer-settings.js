/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { select, dispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction } from 'lodash';

/**
 * Set block renderer settings
 * Set block renderer settings is for defining UI behavior for the block
 *
 * @param {string} type     Block unique type.
 * @param {Object} settings Block renderer settings.
 *
 */
export const setBlockRendererSettings = ( type, settings ) => {
	settings = {
		type,
		output: () => null,
		mergeTag: () => null,
		counterContent: () => null,
		nextBtn: () => null,
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

	if ( ! isFunction( settings.output ) ) {
		console.error( 'The "output" property must be a valid function!' );
		return;
	}

	if ( ! isFunction( settings.mergeTag ) ) {
		console.error( 'The "mergeTag" property must be a valid function!' );
		return;
	}

	if ( ! isFunction( settings.counterContent ) ) {
		console.error(
			'The "counterContent" property must be a valid function!'
		);
		return;
	}

	if ( ! isFunction( settings.nextBtn ) ) {
		console.error( 'The "nextBtn" property must be a valid function!' );
		return;
	}

	dispatch( 'quillForms/blocks' ).setBlockRendererSettings( settings );
};
