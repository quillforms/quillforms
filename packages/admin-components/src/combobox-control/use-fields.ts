/**
 * Quill Forms Dependencies
 */

import { identAlphabetically } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach, size } from 'lodash';

/**
 * Internal Dependencies
 */
import type { Options } from '.';
import { getPlainExcerpt } from '../rich-text';
import { FormBlocks } from '@quillforms/types/src';

const useFields = ( { section } ) => {
	const { blockTypes, formBlocks } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
			// @ts-expect-error
			formBlocks: select( 'quillForms/block-editor' ).getBlocks(),
		};
	} );
	const blocks: FormBlocks = [];

	if ( size( formBlocks ) > 0 ) {
		forEach( formBlocks, ( block, index ) => {
			if ( blockTypes[ block.name ]?.supports?.editable ) {
				blocks.push( { ...block, order: index } );
			}
			if ( blockTypes[ block.name ]?.supports?.innerBlocks ) {
				if ( size( block?.innerBlocks ) > 0 ) {
					forEach( block.innerBlocks, ( childBlock, childIndex ) => {
						blocks.push( {
							...childBlock,
							order:
								index +
								identAlphabetically( parseInt( childIndex ) ),
						} );
					} );
				}
			}
		} );
	}
	const fields: Options = [];
	if ( size( blocks ) > 0 ) {
		for ( const block of blocks ) {
			const blockType = blockTypes[ block.name ];
			fields.push( {
				type: 'field',
				value: block.id,
				label: block.attributes?.label
					? getPlainExcerpt( block.attributes.label )
					: '',
				iconBox: {
					icon: blockType?.icon,
					color: blockType?.color,
				},
				section,
				isMergeTag: true,
				other: {
					name: block.name,
				},
			} );
		}
	}

	return fields;
};

export default useFields;
