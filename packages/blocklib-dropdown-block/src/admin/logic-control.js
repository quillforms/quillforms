/**
 * QuillForms Dependencies
 */
import {
	SelectControl as Select,
	MenuItem,
} from '@quillforms/builder-components';

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
			setValue( choices[ 0 ].ref );
		} else if ( ! choices.some( ( choice ) => choice.ref === value ) ) {
			removeCondition();
		}
	}, [] );
	return (
		<Select
			className={ css`
				margin-top: 10px;
				margin-bottom: 10px;
				width: 200px;
			` }
			value={ value }
			onChange={ ( e ) => {
				setValue( e.target.value );
			} }
		>
			{ choices.map( ( choice, index ) => {
				return (
					<MenuItem
						key={ `choice-${ choice.ref }` }
						value={ choice.ref }
					>
						{ choice.label
							? choice.label
							: `Choice ${ index + 1 }` }
					</MenuItem>
				);
			} ) }
		</Select>
	);
};

export default DropdownLogicControl;
