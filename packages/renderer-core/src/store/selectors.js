/**
 * WordPress Dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * External Dependencies
 */
import createSelector from 'rememo';

/**
 * Get swiper state.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Object} The swiper state
 */
export function getSwiperState( state ) {
	return state;
}

/**
 * Get walk path.
 *
 * @param {Object} state      Global application state.
 *
 * @return {Array} Walk path
 */
export function getWalkPath( state ) {
	return state.walkPath;
}

/**
 * Get current block id.
 *
 * @param {Object} state      Global application state.
 *
 * @return {string}  Current block id
 */
export function getCurrentBlockId( state ) {
	return state.currentBlockId;
}

/**
 * Is thankyou screen active.
 *
 * @param {Object} state       Global application state.
 *
 * @return {boolean} Is thankyou screen active
 */
export function isThankyouScreenActive( state ) {
	return state.isThankyouScreenActive;
}

/**
 * Is welcome screen active.
 *
 * @param {Object} state       Global application state.
 *
 * @return {boolean} Is welcome screen active
 */
export function isWelcomeScreenActive( state ) {
	return state.isWelcomeScreenActive;
}

/**
 * Is reviewing
 *
 * @param {Object} state     Global application state.
 *
 * @return {boolean} Is reviewing
 */
export function isReviewing( state ) {
	return state.isReviewing;
}

/**
 * Get current path editable fields
 *
 * @param {Object} state	  Global application state.
 *
 * @return {Array} The editable fields in current path
 */
export const getEditableFieldsInCurrentPath = createRegistrySelector(
	( select ) => {
		return createSelector(
			( state ) => {
				return state.walkPath.filter( ( block ) => {
					return select( 'quillForms/blocks' ).hasBlockSupport(
						block.type,
						'editable'
					);
				} );
			},
			( state ) => [ state.walkPath ]
		);
	}
);
