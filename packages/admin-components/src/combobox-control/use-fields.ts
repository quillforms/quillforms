/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { size } from 'lodash';

/**
 * Internal Dependencies
 */
import type { Options } from '.';
import { getPlainExcerpt } from '../rich-text';
import { useComboboxControlContext } from './context';

const useFields = ( { section } ) => {
	const { blockTypes, formBlocks } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
			formBlocks: select( 'quillForms/block-editor' ).getBlocks(),
		};
	} );
	const blocks = ( formBlocks ?? [] ).filter( ( block ) => {
		return blockTypes[ block.name ].supports.editable === true;
	} );

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
