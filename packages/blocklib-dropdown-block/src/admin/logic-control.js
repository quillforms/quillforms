/**
 * QuillForms Dependencies
 */
import { SelectControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DropdownLogicControl = ( {
	attributes,
	value,
	setValue,
	removeCondition,
} ) => {
	const { choices } = attributes;

	useEffect( () => {
		if ( ! value ) {
			setValue( choices[ 0 ].value );
		} else if ( ! choices.some( ( choice ) => choice.value === value ) ) {
			removeCondition();
		}
	}, [] );
	const options = choices.map( ( choice, index ) => {
		return {
			key: choice.value,
			name: choice.label ? choice.label : `Choice ${ index + 1 }`,
		};
	} );
	return (
		<SelectControl
			className={ css`
				margin-top: 10px;
				margin-bottom: 10px;
			` }
			value={ options.find( ( option ) => option.key === value ) }
			onChange={ ( selectedChoice ) => {
				setValue( selectedChoice.selectedItem.key );
			} }
			options={ options }
		/>
	);
};

export default DropdownLogicControl;
