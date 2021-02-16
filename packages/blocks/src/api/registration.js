/* eslint-disable no-console */
/**
 * WordPress Dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { pick } from 'lodash';
/**
 * Internal Dependencies
 */
import { setBlockAdminSettings } from './set-block-admin-settings';
import { setBlockRendererSettings } from './set-block-renderer-settings';

export const getDefaultBlockSupports = () => {
	return {
		editable: true,
		required: true,
		attachment: true,
		description: true,
		logic: true,
	};
};

/**
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made available as an option to any
 * editor interface where blocks are implemented.
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 *
 * @return {Object} The block, if it has been successfully registered;
 * otherwise `undefined`.
 */
export const registerBlockType = ( name, settings ) => {
	settings = {
		name,
		attributes: {},
		supports: {},
		logicalOperators: [ 'is', 'is_not' ],
		...settings,
	};

	if ( typeof name !== 'string' ) {
		console.error( 'Block names must be strings.' );
		return;
	}

	if ( select( 'quillForms/blocks' ).getBlockType( name ) ) {
		console.error( 'Block "' + name + '" is already registered.' );
		return;
	}

	settings.supports = {
		...getDefaultBlockSupports(),
		...settings.supports,
	};

	const { attributes, supports } = settings;

	if ( supports.required ) {
		attributes.required = {
			type: 'boolean',
			default: false,
		};
	}

	if ( supports.attachment ) {
		attributes.attachment = {
			type: 'object',
			properties: {
				url: {
					type: 'string',
				},
			},
		};
	}

	if ( supports.description ) {
		attributes.description = {
			type: 'string',
			default: '',
		};
	}

	attributes.label = {
		type: 'string',
		default: '',
	};

	settings.attributes = attributes;

	dispatch( 'quillForms/blocks' ).addBlockTypes(
		pick( settings, [
			'name',
			'attributes',
			'supports',
			'logicalOperators',
		] )
	);
	setBlockRendererSettings( name, settings );
	setBlockAdminSettings( name, settings );
	return settings;
};

/**
 * Returns a registered block type.
 *
 * @param {string} name Block name.
 *
 * @return {?Object} Block type.
 */
export function getBlockType( name ) {
	return select( 'quillForms/blocks' ).getBlockType( name );
}
