/**
 * WordPress Dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach } from 'lodash';

/**
 * Get the whole form structure
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} Form structure
 */
export function getFormStructure( state ) {
	return state;
}

/**
 * Returns form fields.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Fields
 */
export function getFields( state ) {
	return [ ...state.fields ];
}

/**
 * Get block by id
 *
 * @param {Object} 	state      Global application state.
 * @param {string}  id		   Block id
 * @return {Object} Block object
 */
export function getBlockById( state, id ) {
	return state.fields
		.concat( state.welcomeScreens )
		.concat( state.thankyouScreens )
		.find( ( block ) => block.id === id );
}

/**
 * Retruns the editable fields -- Editable fields are the fields who have {displayOnly} property equals false
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Editable fields
 */
export const getEditableFields = createRegistrySelector(
	( select ) => ( state ) => {
		return [ ...state.fields ].filter( ( field ) => {
			const registeredBlock = select( 'quillForms/blocks' ).getBlocks()[
				field.type
			];
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
	( select ) => ( state, id, category ) => {
		const prevEditableFields = [];
		switch ( category ) {
			case 'welcomeScreens':
				return [];
			case 'thankyouScreens':
				return getEditableFields( state );
			case 'fields': {
				const fieldIndex = [ ...state.fields ].findIndex(
					( field ) => field.id === id
				);
				if ( fieldIndex > 0 ) {
					const prevFormFields = [ ...state.fields ].slice(
						0,
						fieldIndex
					);
					forEach( prevFormFields, ( field ) => {
						const registeredBlock = select(
							'quillForms/blocks'
						).getBlocks()[ field.type ];
						if ( ! registeredBlock.supports.displayOnly ) {
							prevEditableFields.push( field );
						}
					} );
				}
			}
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
 * Returns form fields length.
 *
 * @param {Object} state       Global application state.
 *
 * @return {number} Fields length
 */
export function getFieldsLength( state ) {
	return [ ...state.fields ].length;
}

/**
 * Returns form welcome screens.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Welcome screens
 */
export function getWelcomeScreens( state ) {
	return [ ...state.welcomeScreens ];
}

/**
 * Returns form welcome screens length.
 *
 * @param {Object} state       Global application state.
 *
 * @return {number} Welcome screens length
 */
export function getWelcomeScreensLength( state ) {
	return state.welcomeScreens.length;
}

/**
 * Returns form thank you screens.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Thank you screens
 */
export function getThankyouScreens( state ) {
	return [ ...state.thankyouScreens ];
}

/**
 * Returns form thank you screens length.
 *
 * @param {Object} state       Global application state.
 *
 * @return {number} Thank you screens length
 */
export function getThankyouScreensLength( state ) {
	return state.thankyouScreens.length;
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
 * Returns the current block category
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current block category
 */
export function getCurrentBlockCat( state ) {
	return state.currentBlockCat;
}

/**
 * Returns the current block index
 *
 * @param {Object} state       Global application state.
 *
 * @return {string} Current block index
 */
export function getCurrentBlockIndex( state ) {
	return state[ state.currentBlockCat ].findIndex(
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
	return state[ getCurrentBlockCat( state ) ][
		getCurrentBlockIndex( state )
	];
}
