/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { select, dispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction, pick } from 'lodash';

/**
 * Set block renderer settings
 * Set block renderer settings is for defining UI behavior for the block
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block renderer settings.
 *
 */
export const setBlockRendererSettings = ( name, settings ) => {
	settings = {
		name,
		output: () => null,
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

	if ( ! isFunction( settings.output ) ) {
		console.error( 'The "output" property must be a valid function!' );
		return;
	}

	if ( settings.mergeTag && ! isFunction( settings.mergeTag ) ) {
		console.error( 'The "mergeTag" property must be a valid function!' );
		return;
	}

	if ( settings.counterContent && ! isFunction( settings.counterContent ) ) {
		console.error(
			'The "counterContent" property must be a valid function!'
		);
		return;
	}

	if ( settings.nextBtn && ! isFunction( settings.nextBtn ) ) {
		console.error( 'The "nextBtn" property must be a valid function!' );
		return;
	}

	dispatch( 'quillForms/blocks' ).setBlockRendererSettings(
		pick( settings, [
			'name',
			'output',
			'mergeTag',
			'nextBtn',
			'counterContent',
		] )
	);
};
