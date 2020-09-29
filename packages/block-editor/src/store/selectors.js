/**
 * WordPress Dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach } from 'lodash';

/**
 * Get the whole form blocks.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} Form blocks
 */
export function getBlocks( state ) {
	return state.blocks;
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
 * Get block by id
 *
 * @param {Object} 	state      Global application state.
 * @param {string}  id		   Block id
 * @return {Object} Block object
 */
export function getBlockById( state, id ) {
	return state.blocks.find( ( block ) => block.id === id );
}

/**
 * Retruns the editable blocks -- Editable blocks are the blocks who have {displayOnly} property equals false
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Editable fields
 */
export const getEditableFields = createRegistrySelector(
	( select ) => ( state ) => {
		return getBlocks( state ).filter( ( block ) => {
			const registeredBlock = select(
				'quillForms/blocks'
			).getBlockTypes()[ block.type ];
			return registeredBlock.supports.displayOnly === false;
		} );
	}
);

/**
 * Retruns the previous editable fields -- Editable fields are the fields who have {displayOnly} property equals false
 *
 * @param {Object} state    Global application state.
 * @param {number} id       The block id.
 * @param {string} category The block category.
 *
 * @return {Array} Previous Editable fields
 */
export const getPreviousEditableFields = createRegistrySelector(
	( select ) => ( state, id ) => {
		const prevEditableFields = [];

		const blockIndex = state.blocks.findIndex(
			( block ) => block.id === id
		);
		if ( blockIndex > 0 ) {
			const prevFormBlocks = [ ...state.blocks ].slice( 0, blockIndex );
			forEach( prevFormBlocks, ( block ) => {
				const registeredBlock = select(
					'quillForms/blocks'
				).getBlockTypes()[ block.type ];
				if ( ! registeredBlock.supports.displayOnly ) {
					prevEditableFields.push( block );
				}
			} );
		}
		return prevEditableFields;
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
