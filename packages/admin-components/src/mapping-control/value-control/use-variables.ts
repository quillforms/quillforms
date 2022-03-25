/**
 * QuillForms Dependencies
 */
import type { FormLogicVariables } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

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

	return fields;
};

export default useVariables;
