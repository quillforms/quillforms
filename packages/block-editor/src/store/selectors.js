/**
 * QuillForms Dependencies
 */
import { getBlockType } from '@quillforms/blocks';
/**
 * WordPress Dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach, pick, map, findIndex, slice } from 'lodash';
import createSelector from 'rememo';

/**
 * Returns all block objects.
 *
 * Note: it's important to memoize this selector to avoid return a new instance on each call. We use the block cache state
 * for each top-level block of the given block id. This way, the selector only refreshes
 * on changes to blocks associated with the given entity
 *
 * @param {Object}  state        Editor state.
 *
 * @return {Object[]} Form blocks.
 */
export const getBlocks = createSelector(
	( state ) => {
		return map( state.blocks, ( block ) =>
			getBlockById( state, block.id )
		);
	},
	( state ) => map( state.blocks, ( block ) => state.cache[ block.id ] )
);

/**
 * Get welcome screens length.
 *
 * @param {Object}   state       Global application state.
 *
 * @return {number} Welcome screens length
 */
export function getWelcomeScreensLength( state ) {
	return state.blocks.filter( ( block ) => block.name === 'welcome-screen' )
		.length;
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
		return block;
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
			formBlock.name
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
				.filter( ( block ) => block.name === formBlock.name )
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
			block.name
		];
		return blockType.supports.editable === true;
	} );
} );

/**
 * @typedef {Object} QFBlocksSupportsCriteria
 *
 * @property {boolean} editable        Is block editable.
 * @property {boolean} logic 	       Does block support jump logic.
 * @property {boolean} required        Does block support required flag.
 * @property {boolean} attachment      Does block support attachment.
 * @property {boolean} description     Does block support description.
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
			'logic',
			'required',
			'attachment',
			'description',
			'editable',
		] );

		return blocks.filter( ( block ) => {
			const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
				block.name
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
export const getPreviousEditableFields = createSelector(
	( state, id ) => {
		const prevEditableFields = [];

		const blocks = getBlocks( state );

		const blockIndex = findIndex( blocks, ( block ) => block.id === id );
		if ( blockIndex > 0 ) {
			const prevFormBlocks = slice( blocks, 0, blockIndex );
			forEach( prevFormBlocks, ( block ) => {
				const blockType = getBlockType( block.name );
				if ( blockType.supports.editable ) {
					prevEditableFields.push( {
						...block,
						order: getBlockOrderById( state, block.id ),
					} );
				}
			} );
		}
		return prevEditableFields;
	},
	( state, id ) => map( state.blocks, ( block ) => state.cache[ block.id ] )
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
				).getBlockTypes()[ block.name ];
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
			).getBlockTypes()[ block.name ];
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
