/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Given a block name or block type object, returns the corresponding
 * normalized block type object.
 *
 * @param {Object}          state      Blocks state.
 * @param {(string|Object)} nameOrType Block name or type object
 *
 * @return {Object} Block type object.
 */
const getNormalizedBlockType = ( state, nameOrType ) =>
	'string' === typeof nameOrType
		? getBlockType( state, nameOrType )
		: nameOrType;

/**
 * Get all blocks registered.
 *
 * @param {Object} state       Global application state.
 *
 * @return {Array} Registered blocks
 */
export function getBlockTypes( state ) {
	return state;
}

/**
 * Returns a block type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name Block type name.
 *
 * @return {Object?} Block Type.
 */
export function getBlockType( state, name ) {
	return state[ name ];
}

/**
 * Returns the block support value for a feature, if defined.
 *
 * @param  {Object}          state           Data state.
 * @param  {(string|Object)} nameOrType      Block name or type object
 * @param  {string}          feature         Feature to retrieve
 * @param  {*}               defaultSupports Default value to return if not
 *                                           explicitly defined
 *
 * @return {?*} Block support value
 */
export const getBlockSupport = (
	state,
	nameOrType,
	feature,
	defaultSupports
) => {
	const blockType = getNormalizedBlockType( state, nameOrType );

	return get(
		blockType,
		[ 'supports', ...feature.split( '.' ) ],
		defaultSupports
	);
};

/**
 * Returns true if the block defines support for a feature, or false otherwise.
 *
 * @param  {Object}         state           Data state.
 * @param {(string|Object)} nameOrType      Block name or type object.
 * @param {string}          feature         Feature to test.
 * @param {boolean}         defaultSupports Whether feature is supported by
 *                                          default if not explicitly defined.
 *
 * @return {boolean} Whether block supports feature.
 */
export function hasBlockSupport( state, nameOrType, feature, defaultSupports ) {
	return !! getBlockSupport( state, nameOrType, feature, defaultSupports );
}
