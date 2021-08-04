/**
 * External dependencies
 */
import { get, sortBy, keys, reduce } from 'lodash';

/**
 * Internal Dependencies
 */
import type {
	BlockTypeSettings,
	BlocksState,
	BlockSupportedFeatures,
	BlockTypeInterface,
} from '../types';
/**
 * Given a block name or block type object, returns the corresponding
 * normalized block type object.
 *
 * @param {Object}          state      Blocks state.
 * @param {(string|Object)} nameOrType Block name or type object
 *
 * @return {Object} Block type object.
 */
const getNormalizedBlockType = (
	state: BlocksState,
	nameOrType: string | BlockTypeInterface
) =>
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
export const getBlockTypes = ( state: BlocksState ): BlocksState => {
	return reduce(
		sortBy( keys( state ), ( blockName ) => state[ blockName ].order ),
		( acc, key ) => {
			if ( key !== 'unknown' ) {
				acc[ key ] = state[ key ];
			}
			return acc;
		},
		{}
	);
};

/**
 * Returns a block type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name Block type name.
 *
 * @return {Object?} Block Type.
 */
export function getBlockType(
	state: BlocksState,
	name: string
): BlockTypeSettings | undefined {
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
	state: BlocksState,
	nameOrType: string | BlockTypeInterface,
	feature: keyof BlockSupportedFeatures
): boolean | undefined => {
	const blockType = getNormalizedBlockType( state, nameOrType );
	return get( blockType, [ 'supports', feature ] );
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
export function hasBlockSupport(
	state: BlocksState,
	nameOrType: string,
	feature: keyof BlockSupportedFeatures
): boolean {
	return !! getBlockSupport( state, nameOrType, feature );
}
