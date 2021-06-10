/**
 * External Dependencies
 */
import { reduce, isEmpty, map } from 'lodash';
import type { FormBlocks } from '@quillforms/types';

/**
 * Internal Dependencies
 */
import { getBlockType } from './registration';

export function sanitizeBlockAttributes(
	blockName: string,
	attributes: Record<string, unknown>
) {
	// Get the block type
	const blockType = getBlockType(blockName);

	if (undefined === blockType) {
		throw new Error(`Block type '${blockName}' is not registered.`);
	}
	// Ensure attributes contains only values defined by block type, and merge
	// default values for missing attributes.
	return reduce(
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
}

/**
 * Sanitize blocks
 * Transform unknwon blocks and sanitize block attributes
 *
 * @param {FormBlocks} blocks The form blocks to be sanitized
 *
 * @return {FormBlocks} The sanitized blocks
 */
export const sanitizeBlocks = (blocks: FormBlocks): FormBlocks => {
	if (isEmpty(blocks)) {
		return [];
	}

	return map(blocks, (block) => {
		if (getBlockType(block.name))
			return {
				...block,
				attributes: sanitizeBlockAttributes(
					block.name,
					block.attributes ? block.attributes : {}
				),
			};
		return {
			...block,
			name: 'unknown',
			attributes: sanitizeBlockAttributes(
				'unknown',
				block.attributes ? block.attributes : {}
			),
		};
	});
};
