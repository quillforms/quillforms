/* eslint-disable no-console */
/**
 * WordPress Dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { pick, isPlainObject } from 'lodash';

/**
 * Internal Dependencies
 */
import { setBlockAdminSettings } from './set-block-admin-settings';
import { setBlockRendererSettings } from './set-block-renderer-settings';
import type { BlockTypeSettings, BlockSupportedFeatures } from '../types';

export const getDefaultBlockSupports = (): BlockSupportedFeatures => {

	return {
		editable: true,
		required: true,
		attachment: true,
		description: true,
		defaultValue: false,
		placeholder: false,
		logic: true,
		logicConditions: true,
		innerBlocks: false,
		numeric: false,
		choices: false,
		payments: false,
		points: false,
		correctAnswers: false
	};
};

/**
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made available as an option to any
 * editor interface where blocks are implemented.
 *
 * @param  name     Block name.
 * @param  settings Block settings.
 *
 * @return The block settings, if it has been successfully registered;
 * otherwise `undefined`.
 */
export const registerBlockType = (
	name: string,
	settings: BlockTypeSettings
): BlockTypeSettings | undefined => {
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

	let { attributes } = settings;
	const { supports } = settings;

	if ( ! attributes || ! isPlainObject( attributes ) ) {
		attributes = {};
	}
	if ( supports.required ) {
		attributes.required = {
			type: 'boolean',
			default: false,
		};
	}

	attributes.nextBtnLabel = {
		type: [ 'string', 'boolean' ],
		default: false,
	};

	attributes.classnames = {
		type: 'string',
		default: '',
	};

	if ( supports.placeholder ) {
		attributes.placeholder = {
			type: [ 'string', 'boolean' ],
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

	if ( supports.defaultValue ) {
		attributes.defaultValue = {
			type: 'string',
			default: '',
		};
	}

	if ( supports.description ) {
		attributes.description = {
			type: 'string',
			default: '',
		};
	}
	if ( supports.theme ) {
		attributes.themeId = {
			type: 'number',
		};
	}

	if ( name === 'dropdown' ||
		 name === 'multiple-choice' ||
		 name === 'picture-choice' 
	) {
		attributes.randomize = {
			type: 'boolean',
			default: false
		}
	}
	attributes.label = {
		type: 'string',
		default: '',
	};
	attributes.customHTML = {
		type: 'string',
		default: '',
	};
	attributes.layout = {
		type: 'string',
		default: 'stack',
	};
	attributes.attachmentFocalPoint = {
		type: 'object',
		default: {
			x: 0.5,
			y: 0.5,
		},
	};

	attributes.attachmentFancyBorderRadius = {
		type: 'boolean',
		default: false,
	};

	attributes.attachmentBorderRadius = {
		type: 'boolean',
		default: '0px',
	};

	attributes.attachmentMaxWidth = {
		type: 'string',
		default: 'none',
	};

	settings.attributes = attributes;

	dispatch( 'quillForms/blocks' ).addBlockTypes( {
		name,
		...pick( settings, [ 'attributes', 'supports', 'logicalOperators' ] ),
	} );
	setBlockRendererSettings( name, settings );
	setBlockAdminSettings( name, settings );
	return settings;
};

/**
 * Returns a registered block type.
 *
 * @param {string} name Block name.
 *
 * @return {?BlockTypeSettingss} Block type.
 */
export function getBlockType( name: string ): BlockTypeSettings | undefined {
	return select( 'quillForms/blocks' ).getBlockType( name );
}
