/**
 * WordPress Dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach, pick, map, cloneDeep } from 'lodash';
import createSelector from 'rememo';

/**
 * Get the whole form blocks.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} Form blocks
 */
export function getBlocks( state ) {
	return map( state.blocks, ( block ) => getBlockById( state, block.id ) );
}

/**
 * Get welcome screens length.
 *
 * @param {Object}   state       Global application state.
 *
 * @return {number} Welcome screens length
 */
export function getWelcomeScreensLength( state ) {
	return state.blocks.filter( ( block ) => block.type === 'welcome-screen' )
		.length;
}

/**
 * Returns a block's attributes given its id, or null if no block exists with
 * the block id.
 *
 * @param {Object} state      Editor state.
 * @param {string} blockId    Block id.
 *
 * @return {Object?} Block attributes.
 */
export function getBlockAttributes( state, blockId ) {
	const blockIndex = state.blocks.findIndex(
		( $block ) => $block.id === blockId
	);
	if ( blockIndex === -1 ) return null;
	return state.blocks[ blockIndex ].attributes;
}

/**
 * Get block by id
 *
 * @param {Object} 	state      Global application state.
 * @param {string}  id		   Block id
 *
 * @return {Object} Block object
 */
export const getBlockById = createSelector(
	( state, blockId ) => {
		const block = state.blocks.find( ( $block ) => $block.id === blockId );
		if ( ! block ) return null;
		return {
			...block,
			attributes: getBlockAttributes( state, blockId ),
		};
	},
	( state, blockId ) => [
		// Normally, we'd have both `getBlockAttributes` dependencies and
		// `getBlocks` (children) dependancies here but for performance reasons
		// we use a denormalized cache key computed in the reducer that takes both
		// the attributes and inner blocks into account. The value of the cache key
		// is being changed whenever one of these dependencies is out of date.
		state.cache[ blockId ],
	]
);

/**
 * Get block order by id
 *
 * @param {Object} 	state      Global application state.
 * @param {string}  id		   Block id
 *
 * @return {Object} Block object
 */
export const getBlockOrderById = createRegistrySelector(
	( select ) => ( state, id ) => {
		const formBlock = state.blocks.find( ( block ) => block.id === id );
		const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
			formBlock.type
		];
		const editableFields = select(
			'quillForms/block-editor'
		).getEditableFields();
		const charCode = 'a'.charCodeAt( 0 );

		// Simple algorithm to generate alphabatical idented order
		const identName = ( a ) => {
			const b = [ a ];
			let sp, out, i, div;

			sp = 0;
			while ( sp < b.length ) {
				if ( b[ sp ] > 25 ) {
					div = Math.floor( b[ sp ] / 26 );
					b[ sp + 1 ] = div - 1;
					b[ sp ] %= 26;
				}
				sp += 1;
			}

			out = '';
			for ( i = 0; i < b.length; i += 1 ) {
				out = String.fromCharCode( charCode + b[ i ] ) + out;
			}

			return out.toUpperCase();
		};

		let itemOrder = null;
		if ( blockType.supports.editable === true ) {
			const fieldIndex = editableFields.findIndex(
				( field ) => field.id === id
			);
			itemOrder = fieldIndex + 1;
		} else {
			const fieldIndex = state.blocks
				.filter( ( block ) => block.type === formBlock.type )
				.findIndex( ( block ) => block.id === id );
			itemOrder = identName( fieldIndex );
		}
		return itemOrder;
	}
);

/**
 * Retruns the editable blocks -- Editable blocks are the blocks who have {editable} setting equals true
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Editable fields
 */
export const getEditableFields = createRegistrySelector( ( select ) => () => {
	const blocks = select( 'quillForms/block-editor' ).getBlocks();
	return blocks.filter( ( block ) => {
		const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
			block.type
		];
		return blockType.supports.editable === true;
	} );
} );

/**
 * @typedef {Object} QFBlocksSupportsCriteria
 *
 * @property {boolean} editable        Is block editable.
 * @property {boolean} jumpLogic 	   Does block support jump logic.
 * @property {boolean} calculator      Does block support calculator.
 */
/**
 * Get block with multiple criteria.
 *
 * @param {Object}                    state       Global application state.
 * @param {QFBlocksSupportsCriteria}  criteria    Multiple criteria according to which the blocks are filtered.
 *
 * @return {Array} Filtered blocks according to criteria given
 */
export const getBlocksByCriteria = createRegistrySelector(
	( select ) => ( state, criteria ) => {
		const blocks = select( 'quillForms/block-editor' ).getBlocks();
		const filteredCriteria = pick( criteria, [
			'jumpLogic',
			'calculator',
			'editable',
		] );

		return blocks.filter( ( block ) => {
			const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
				block.type
			];
			return Object.entries( filteredCriteria ).every( ( [ key, val ] ) =>
				typeof val === 'boolean'
					? blockType.supports[ key ] === val
					: true
			);
		} );
	}
);

/**
 * Retruns the previous editable fields
 * Editable fields are the fields which have {editable} property equals true
 *
 * @param {Object} state    Global application state.
 * @param {number} id       The block id.
 *
 * @return {Array} Previous editable fields
 */
export const getPreviousEditableFields = createRegistrySelector(
	( select ) => ( state, id ) => {
		const prevEditableFields = [];

		const blocks = select( 'quillForms/block-editor' ).getBlocks();

		const blockIndex = blocks.findIndex( ( block ) => block.id === id );
		if ( blockIndex > 0 ) {
			const prevFormBlocks = [ ...blocks ].slice( 0, blockIndex );
			forEach( prevFormBlocks, ( block ) => {
				const registeredBlock = select(
					'quillForms/blocks'
				).getBlockTypes()[ block.type ];
				if ( registeredBlock.supports.editable ) {
					prevEditableFields.push( block );
				}
			} );
		}
		return prevEditableFields;
	}
);

/**
 * Retruns the previous jump logic supported fields before specific block
 * Jump logic supported fields are the fields which have support for jump logic and have{editable} property equals true
 *
 * @param {Object} state    Global application state.
 * @param {number} id       The block id.
 *
 * @return {Array} Previous jump logic supported fields
 */
export const getPreviousJumpLogicSupportedFields = createRegistrySelector(
	( select ) => ( state, id ) => {
		const prevJumpLogicSupportedFields = [];
		const blocks = select( 'quillForms/block-editor' ).getBlocks();

		const blockIndex = blocks.findIndex( ( block ) => block.id === id );
		if ( blockIndex > 0 ) {
			const prevFormBlocks = [ ...blocks ].slice( 0, blockIndex );
			forEach( prevFormBlocks, ( block ) => {
				const registeredBlock = select(
					'quillForms/blocks'
				).getBlockTypes()[ block.type ];
				if (
					registeredBlock?.editable &&
					registeredBlock?.supports?.jumpLogic
				) {
					prevJumpLogicSupportedFields.push( block );
				}
			} );
		}
		return prevJumpLogicSupportedFields;
	}
);

/**
 * Retruns the calculator supported fields before specific block
 * calculator supported fields are the fields which have support for calculator and have{editable} property equals true
 *
 * @param {Object} state    Global application state.
 * @param {number} id       The block id.
 *
 * @return {Array} Previous jump logic supported fields
 */
export const getCalculatorSupportedFields = createRegistrySelector(
	( select ) => {
		const calculatorSupportedFields = [];
		const blocks = select( 'quillForms/block-editor' ).getBlocks();
		forEach( blocks, ( block ) => {
			const registeredBlock = select(
				'quillForms/blocks'
			).getBlockTypes()[ block.type ];
			if (
				registeredBlock?.editable &&
				registeredBlock?.supports?.calculator
			) {
				calculatorSupportedFields.push( block );
			}
		} );

		return calculatorSupportedFields;
	}
);

/**
 * Retruns the editable fields length
 *
 * @param {Object} state       Global application state.
 *
 * @return {number} Editable fields length
 */
export function getEditableFieldsLength( state ) {
	return getEditableFields( state ).length;
}

/**
 * Returns the current block id
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current block id
 */
export function getCurrentBlockId( state ) {
	return state.currentBlockId;
}

/**
 * Returns the current block index
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current block index
 */
export function getCurrentBlockIndex( state ) {
	return state.blocks.findIndex(
		( item ) => item.id === state.currentBlockId
	);
}

/**
 * Returns the current form item
 *
 * @param {Object} state     Global application state.
 *
 * @return {Object} Current block item
 */
export function getCurrentFormItem( state ) {
	let currentFormItem = null;
	const currentFormItemIndex = state.blocks.findIndex(
		( item ) => item.id === state.currentBlockId
	);
	if ( currentFormItemIndex !== -1 )
		currentFormItem = state.blocks[ currentFormItemIndex ];
	return currentFormItem;
}
