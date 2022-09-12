/**
 * QuillForms Dependencies
 */
import type { FormLogicVariables } from '@quillforms/types';

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

const useVariables = ( { section } ) => {
	const { variables } = useSelect( ( select ) => {
		return {
			variables:
				( select(
					'quillForms/logic-editor'
				)?.getLogicVariables() as FormLogicVariables ) ?? {},
		};
	} );

	const fields: Options = [];
	if ( size( variables ) > 0 ) {
		for ( const [ id, variable ] of Object.entries( variables ) ) {
			fields.push( {
				type: 'variable',
				value: id,
				label: variable.label,
				iconBox: {},
				section,
				isMergeTag: true,
			} );
		}
	}

	return fields;
};

export default useVariables;
