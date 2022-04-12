/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import HiddenFieldIcon from './hidden-field-icon';

/**
 * External Dependencies
 */
import { size } from 'lodash';

/**
 * Internal Dependencies
 */
import type { Options } from '.';

const useHiddenFields = ( { section } ) => {
	const { hiddenFields } = useSelect( ( select ) => {
		return {
			hiddenFields:
				select(
					'quillForms/hidden-fields-editor'
				)?.getHiddenFields() ?? {},
		};
	} );

	const fields: Options = [];
	if ( size( hiddenFields ) > 0 ) {
		for ( const hiddenField of hiddenFields ) {
			fields.push( {
				type: 'hidden_field',
				value: hiddenField.name,
				label: hiddenField.name,
				iconBox: {
					color: '#aaa',
					icon: HiddenFieldIcon,
				},
				section,
				isMergeTag: true,
			} );
		}
	}

	return fields;
};

export default useHiddenFields;
