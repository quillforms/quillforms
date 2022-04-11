/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import type { Options } from '.';

const useFields = ( { section } ) => {
	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	const blocks = ( ConfigApi.getInitialPayload().blocks ?? [] ).filter(
		( block ) => {
			return blockTypes[ block.name ].supports.editable === true;
		}
	);

	const fields: Options = [];
	for ( const block of blocks ) {
		const blockType = blockTypes[ block.name ];
		fields.push( {
			type: 'field',
			value: block.id,
			label: block.attributes?.label ?? '',
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

	return fields;
};

export default useFields;