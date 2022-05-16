/**
 * QuillForms Dependencies
 */
import { getBlockType } from '@quillforms/blocks';
import type { FormBlocks, FormBlock } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach, map, findIndex, slice, pick } from 'lodash';
import createSelector from 'rememo';

/**
 * Internal Dependencies
 */
import type { FormBlockWithOrder, BlockOrder } from './types';
import type { State } from './reducer';
/**
 * Returns all block objects.
 *
 * Note: it's important to memoize this selector to avoid return a new instance on each call. We use the block cache state
 * for each top-level block of the given block id. This way, the selector only refreshes
 * on changes to blocks associated with the given entity
 *
 * @param {State}  state        Editor state.
 *
 * @return {FormBlocks} Form blocks.
 */
export const getBlocks = createSelector(
	( state: State ): FormBlocks => {
		return state.blocks;
	},
	( state: State ) =>
		map( state.blocks, ( block ) => state?.cache?.[ block.id ] )
);

/**
 * Get welcome screens length.
 *
 * @param {State}   state       Global application state.
 *
 * @return {number} Welcome screens length
 */
export function getWelcomeScreensLength( state: State ): number {
	return state.blocks.filter( ( block ) => block.name === 'welcome-screen' )
		.length;
}

/**
 * Get block by id
 *
 * @param {State} 	state      Global application state.
 * @param {string}  id		   Block id
 *
 * @return {FormBlock} Block object
 */
export const getBlockById = createSelector(
	( state: State, blockId: string ): FormBlock | undefined => {
		const block = state.blocks.find( ( $block ) => $block.id === blockId );
		if ( ! block ) return undefined;
		return block;
	},
	( state: State, blockId: string ) => [
		// Normally, we'd have both `getBlockAttributes` dependencies and
		// `getBlocks` (children) dependancies here but for performance reasons
		// we use a denormalized cache key computed in the reducer that takes both
		// the attributes and inner blocks into account. The value of the cache key
		// is being changed whenever one of these dependencies is out of date.
		state?.cache?.[ blockId ],
	]
);

/**
 * Get block order by id
 *
 * @param {State} 	state      Global application state.
 * @param {string}  id		   Block id
 *
 * @return {BlockOrder} Block order
 */
export const getBlockOrderById = ( state: State, id: string ): BlockOrder => {
	const formBlock = getBlockById( state, id );
	if ( ! formBlock ) return undefined;
	const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
		formBlock.name
	];
	const editableFields = select(
		'quillForms/block-editor'
	).getEditableFields();
	const charCode = 'a'.charCodeAt( 0 );

	// Simple algorithm to generate alphabatical idented order
	const identName = ( a: number ): string => {
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

	let itemOrder: BlockOrder;
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
};

/**
 * Retruns the editable blocks -- Editable blocks are the blocks who have {editable} setting equals true
 *
 * @param {State} state       Global application state.
 *
 * @return {FormBlock[]} Editable fields
 */
export function getEditableFields( state: State ): FormBlock[] {
	const blocks = getBlocks( state );
	return blocks.filter( ( block ) => {
		const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
			block.name
		];
		return blockType.supports.editable === true;
	} );
}

/**
 * Get block with multiple criteria.
 *
 * @param {Object}                    state       Global application state.
 * @param {QFBlocksSupportsCriteria}  criteria    Multiple criteria according to which the blocks are filtered.
 *
 * @return {Array} Filtered blocks according to criteria given
 */
export const getBlocksByCriteria = ( state: State, criteria ) => {
	const blocks = getBlocks( state );
	const filteredCriteria = pick( criteria, [
		'logic',
		'required',
		'attachment',
		'description',
		'editable',
		'numeric',
	] );

	return blocks.filter( ( block ) => {
		const blockType = select( 'quillForms/blocks' ).getBlockTypes()[
			block.name
		];
		return Object.entries( filteredCriteria ).every( ( [ key, val ] ) =>
			typeof val === 'boolean' ? blockType.supports[ key ] === val : true
		);
	} );
};

/**
 * Get block with multiple criteria.
 *
 * @param {Object}                    state       Global application state.
 * @param {QFBlocksSupportsCriteria}  criteria    Multiple criteria according to which the blocks are filtered.
 *
 * @return {Array} Filtered blocks according to criteria given
 */
export const getPreviousBlocksByCriteria = (
	state: State,
	criteria,
	id: string,
	includeCurrentBlock: boolean = false
) => {
	const blocks = getBlocks( state );
	const filteredCriteria = pick( criteria, [
		'logic',
		'required',
		'attachment',
		'description',
		'editable',
		'numeric',
	] );

	const blockIndex = findIndex( blocks, ( block ) => block.id === id );
	if ( blockIndex > 0 ) {
		const prevFormBlocks = slice(
			blocks,
			0,
			includeCurrentBlock ? blockIndex + 1 : blockIndex
		);

		return prevFormBlocks.filter( ( block ) => {
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
	return [];
};

/**
 * Retruns the previous editable fields
 * Editable fields are the fields which have {editable} property equals true
 *
 * @param {State} state    Global application state.
 * @param {string} 			 id       The block id.
 *
 * @return {FormBlockWithOrder[]} Previous editable fields
 */
export const getPreviousEditableFieldsWithOrder = createSelector(
	( state: State, id: string ): FormBlockWithOrder[] => {
		const prevEditableFields: FormBlockWithOrder[] = [];

		const blocks = getBlocks( state );

		const blockIndex = findIndex( blocks, ( block ) => block.id === id );
		if ( blockIndex > 0 ) {
			const prevFormBlocks = slice( blocks, 0, blockIndex );
			forEach( prevFormBlocks, ( block ) => {
				const blockType = getBlockType( block.name );
				if ( blockType?.supports?.editable ) {
					prevEditableFields.push( {
						...block,
						order: getBlockOrderById( state, block.id ),
					} );
				}
			} );
		}
		return prevEditableFields;
	},
	( state: State ) =>
		map( state.blocks, ( block ) => state?.cache?.[ block.id ] )
);

/**
 * Retruns the editable fields length
 *
 * @param {State} state       Global application state.
 *
 * @return {number} Editable fields length
 */
export function getEditableFieldsLength( state: State ): number {
	return getEditableFields( state ).length;
}

/**
 * Returns the current block id
 *
 * @param {State} state       Global application state.
 *
 * @return {?string} Current block id
 */
export function getCurrentBlockId( state: State ): string | undefined {
	return state.currentBlockId;
}

/**
 * Returns the current block index
 *
 * @param {State} state       Global application state.
 *
 * @return {number} Current block index
 */
export function getCurrentBlockIndex( state: State ): number {
	return state.blocks.findIndex(
		( item ) => item.id === state.currentBlockId
	);
}

/**
 * Returns the current form item
 *
 * @param {State} state     Global application state.
 *
 * @return {FormBlock} Current block item
 */
export function getCurrentBlock( state: State ): FormBlock | undefined {
	let currentBlock;
	const currentBlockIndex = state.blocks.findIndex(
		( item ) => item.id === state.currentBlockId
	);
	if ( currentBlockIndex !== -1 )
		currentBlock = state.blocks[ currentBlockIndex ];
	return currentBlock;
}
