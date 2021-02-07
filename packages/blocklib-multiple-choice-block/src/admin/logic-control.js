/**
 * QuillForms Dependencies
 */
import { CustomSelectControl } from '@wordpress/components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const MultipleChoice = ( { attributes, value, setValue, removeCondition } ) => {
	const { choices } = attributes;

	useEffect( () => {
		if ( ! value ) {
			setValue( choices[ 0 ].ref );
		} else if ( ! choices.some( ( choice ) => choice.ref === value ) ) {
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
		<CustomSelectControl
			className={ css`
				margin-top: 10px;
				margin-bottom: 10px;
				width: 200px;
			` }
			value={ value }
			onChange={ ( selectedChoice ) => {
				setValue( selectedChoice );
			} }
			options={ options }
		/>
	);
};

export default MultipleChoice;
