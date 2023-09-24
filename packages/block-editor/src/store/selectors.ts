/**
 * QuillForms Dependencies
 */
import { getBlockType } from '@quillforms/blocks';
import type { FormBlocks, FormBlock } from '@quillforms/types';
import { identAlphabetically } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach, findIndex, slice, pick, size } from 'lodash';

/**
 * Internal Dependencies
 */
import type { FormBlockWithOrder, BlockOrder } from './types';
import { State } from './reducer';
/**
 * Returns form blocks objects.
 *
 * Note: it's important to memoize this selector to avoid return a new instance on each call. We use the block cache state
 * for each top-level block of the given block id. This way, the selector only refreshes
 * on changes to blocks associated with the given entity
 *
 * @param {State} state Editor state.
 *
 * @return {FormBlocks} Form blocks.
 */
export const getBlocks = ( state: State ): FormBlocks => {
	return state.blocks;
};

/**
 * Returns all form blocks including inner blocks.
 *
 *
 * @param {State} state Editor state.
 *
 * @return {FormBlocks} Form blocks.
 */
export const getAllBlocks = ( state: State ): FormBlocks => {
	const blocks = state.blocks;
	const allBlocks: FormBlocks = [];
	if ( size( blocks ) > 0 ) {
		forEach( blocks, ( block ) => {
			allBlocks.push( block );
			if ( size( block?.innerBlocks ) > 0 ) {
				forEach( block.innerBlocks, ( innerBlock ) => {
					allBlocks.push( innerBlock );
				} );
			}
		} );
	}

	return allBlocks;
};

/**
 * Get welcome screens length.
 *
 * @param {State} state Global application state.
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
 * @param {State}  state       Global application state.
 * @param {string} id          Block id
 *
 * @param          blockId
 * @param          parentIndex
 * @return {FormBlock} Block object
 */
export const getBlockById = (
	state: State,
	blockId: string,
	parentIndex: number | undefined = undefined
): FormBlock | undefined => {
	if ( typeof parentIndex === 'undefined' ) {
		const block = state.blocks.find( ( $block ) => $block.id === blockId );
		if ( ! block ) return undefined;
		return block;
	}

	if (
		! state.blocks ||
		! state.blocks[ parentIndex ] ||
		! state.blocks[ parentIndex ].innerBlocks
	) {
		return undefined;
	}
	const block = state.blocks[ parentIndex ].innerBlocks?.find(
		( $block ) => $block.id === blockId
	);
	if ( ! block ) return undefined;
	return block;
};

/**
 * Get block order by id
 *
 * @param {State}  state       Global application state.
 * @param {string} id          Block id
 *
 * @param          parentIndex
 * @return {BlockOrder} Block order
 */
export const getBlockOrderById = (
	state: State,
	id: string,
	parentIndex: number | undefined = undefined
): BlockOrder => {
	const formBlock = getBlockById( state, id, parentIndex );
	if ( ! formBlock ) return undefined;
	const blockType =
		select( 'quillForms/blocks' ).getBlockTypes()[ formBlock.name ];
	const orderableFields = select(
		'quillForms/block-editor'
	).getBlocksByCriteria(
		{
			editable: true,
			innerBlocks: true,
		},
		'or'
	);

	let itemOrder: BlockOrder;
	if ( typeof parentIndex === 'undefined' ) {
		if (
			blockType.supports.editable === true ||
			blockType.supports.innerBlocks === true
		) {
			const fieldIndex = orderableFields.findIndex(
				( field ) => field.id === id
			);
			itemOrder = fieldIndex + 1;
		} else {
			const fieldIndex = state.blocks
				.filter( ( block ) => block.name === formBlock.name )
				.findIndex( ( block ) => block.id === id );
			itemOrder = identAlphabetically( fieldIndex );
		}
	} else {
		const fieldIndex = state.blocks?.[
			parentIndex
		]?.innerBlocks?.findIndex( ( block ) => block.id === id );
		if ( typeof fieldIndex !== 'undefined' && fieldIndex > -1 ) {
			const parentBlockId = state.blocks[ parentIndex ].id;
			const parentBlockOrder = getBlockOrderById( state, parentBlockId );
			itemOrder = parentBlockOrder + identAlphabetically( fieldIndex );
		}
	}
	return itemOrder;
};

/**
 * Retruns the editable blocks -- Editable blocks are the blocks who have {editable} setting equals true
 *
 * @param {State} state Global application state.
 *
 * @return {FormBlock[]} Editable fields
 */
export function getEditableFields( state: State ): FormBlock[] {
	const blocks = getBlocks( state );
	return blocks.filter( ( block ) => {
		const blockType =
			select( 'quillForms/blocks' ).getBlockTypes()[ block.name ];
		return blockType.supports.editable === true;
	} );
}

/**
 * Get block with multiple criteria.
 *
 * @param {Object}                   state    Global application state.
 * @param {QFBlocksSupportsCriteria} criteria Multiple criteria according to which the blocks are filtered.
 *
 * @param                            operator
 * @return {Array} Filtered blocks according to criteria given
 */
export const getBlocksByCriteria = (
	state: State,
	criteria,
	operator = 'and'
) => {
	const blocks = getBlocks( state );
	const filteredCriteria = pick( criteria, [
		'logic',
		'required',
		'attachment',
		'description',
		'editable',
		'numeric',
		'innerBlocks',
	] );

	return blocks.filter( ( block ) => {
		const blockType =
			select( 'quillForms/blocks' ).getBlockTypes()[ block.name ];
		if ( operator === 'and' )
			return Object.entries( filteredCriteria ).every( ( [ key, val ] ) =>
				typeof val === 'boolean'
					? blockType.supports[ key ] === val
					: true
			);

		return Object.entries( filteredCriteria ).some( ( [ key, val ] ) =>
			typeof val === 'boolean' ? blockType.supports[ key ] === val : true
		);
	} );
};

/**
 * Get block with multiple criteria.
 *
 * @param {Object}                   state               Global application state.
 * @param {QFBlocksSupportsCriteria} criteria            Multiple criteria according to which the blocks are filtered.
 *
 * @param                            id
 * @param                            includeCurrentBlock
 * @return {Array} Filtered blocks according to criteria given
 */
export const getPreviousBlocksByCriteria = (
	state: State,
	criteria,
	id: string,
	includeCurrentBlock: boolean = false,
	relation: 'and' | 'or' = 'and'
) => {
	const blocks = getBlocks( state );
	const filteredCriteria = pick( criteria, [
		'logic',
		'required',
		'attachment',
		'description',
		'editable',
		'innerBlocks',
		'correctAnswers',
		'points',
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
			const blockType =
				select( 'quillForms/blocks' ).getBlockTypes()[ block.name ];
			if ( relation === 'and' )
				return Object.entries( filteredCriteria ).every( ( [ key, val ] ) =>
					typeof val === 'boolean'
						? blockType.supports[ key ] === val
						: true
				);
			return Object.entries( filteredCriteria ).some( ( [ key, val ] ) =>
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
 * @param {State}  state Global application state.
 * @param {string} id    The block id.
 *
 * @return {FormBlockWithOrder[]} Previous editable fields
 */
export const getPreviousEditableFieldsWithOrder = (
	state: State,
	id: string
): FormBlockWithOrder[] => {
	const prevEditableFields: FormBlockWithOrder[] = [];

	const blocks = state.blocks;

	const blockIndex = findIndex( blocks, ( block ) => block.id === id );
	if ( blockIndex > 0 ) {
		const prevFormBlocks = slice( blocks, 0, blockIndex );
		forEach( prevFormBlocks, ( block, $prevBlockIndex ) => {
			const blockType = getBlockType( block.name );
			if ( blockType?.supports?.editable ) {
				prevEditableFields.push( {
					...block,
					order: getBlockOrderById( state, block.id ),
				} );
			}
			if(blockType?.supports?.innerBlocks) {
				forEach( block.innerBlocks, ( innerBlock ) => {
					const innerBlockType = getBlockType( innerBlock.name );
					if ( innerBlockType?.supports?.editable ) {
						prevEditableFields.push( {
							...innerBlock,
							order: getBlockOrderById( state, innerBlock.id, $prevBlockIndex ),
						} );
					}
				} );
			}
		} );
	}
	return prevEditableFields;
};

/**
 * Retruns the editable fields length
 *
 * @param {State} state Global application state.
 *
 * @return {number} Editable fields length
 */
export function getEditableFieldsLength( state: State ): number {
	return getEditableFields( state ).length;
}

/**
 * Returns the current block id
 *
 * @param {State} state  Global application state.
 *
 * @param         parent
 * @return {?string} Current block id
 */
export function getCurrentBlockId( state: State ): string | undefined {
	return state.currentBlockId;
}

/**
 * Returns the current child block id
 *
 * @param {State} state Global application state.
 *
 * @return {?string} Current child block id
 */
export function getCurrentChildBlockId( state: State ): string | undefined {
	return state.currentChildBlockId;
}

/**
 * Returns the current block index
 *
 * @param {State} state Global application state.
 *
 * @return {number} Current block index
 */
export function getCurrentBlockIndex( state: State ): number {
	return state.blocks.findIndex(
		( item ) => item.id === state.currentBlockId
	);
}

/**
 * Returns the current child block index
 *
 * @param {State} state Global application state.
 *
 * @return {number | undefined } Current block index
 */
export function getCurrentChildBlockIndex( state: State ): number | undefined {
	const parentBlockIndex = getCurrentBlockIndex( state );
	if (
		! state.blocks ||
		state.blocks.length === 0 ||
		typeof parentBlockIndex === 'undefined' ||
		! state.blocks[ parentBlockIndex ]
	) {
		return undefined;
	}
	return state.blocks[ parentBlockIndex ]?.innerBlocks?.findIndex(
		( item ) => item.id === state.currentChildBlockId
	);
}

/**
 * Returns the current form item
 *
 * @param {State} state Global application state.
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
