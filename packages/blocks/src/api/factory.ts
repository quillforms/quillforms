/**
 * External Dependencies
 */
import { reduce, isEmpty, map } from 'lodash';
import type { FormBlocks } from '@quillforms/config';

/**
 * Internal dependencies
 */
import { getBlockType } from './registration';

/**
 * Returns a block object given its type and attributes.
 *
 * @param {string} name        Block name.
 * @param {Object} attributes  Block attributes.
 *
 * @throws {Error} If the block type isn't registered.
 * @return {Object?} Block object.
 */
export function createBlock(
	name: string,
	attributes: Record<string, unknown> = {}
): Record<string, unknown> | void{
	// Get the type definition associated with a registered block.
	const blockType = getBlockType(name);

	if (undefined === blockType) {
		throw new Error(`Block type '${name}' is not registered.`);
	}


	// Ensure attributes contains only values defined by block type, and merge
	// default values for missing attributes.
	const sanitizedAttributes = reduce(
		blockType.attributes,
		(accumulator, schema, key) => {
			const value = attributes[key];

			if (undefined !== value) {
				accumulator[key] = value;
			} else if (schema.hasOwnProperty('default')) {
				accumulator[key] = schema.default;
			}

			return accumulator;
		},
		{} as Record<string, unknown>
	);



	// Blocks are stored with a unique ID, the assigned type name, the block
	// attributes, and their inner blocks.
	return {
		name,
		attributes: sanitizedAttributes,
	};
}

/**
 * Transform unknown blocks to have "unknown" block name
 *
 * @param {Array} blocks The form blocks
 *
 * @return {Array} The transformed blocks
 */
export function __experimentalTransformUnkownBlocks(blocks: FormBlocks): FormBlocks {
	if (isEmpty(blocks)) {
		return [];
	}

	const transformedBlocks = map(blocks, (block) => {
		if (getBlockType(block.name)) return block;
		return {
			...block,
			name: 'unknown',
		};
	});

	return transformedBlocks;
}
