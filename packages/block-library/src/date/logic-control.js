/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import DatePicker from 'react-datepicker';
import { isValid } from 'date-fns';

const DateLogicControl = ( {
	attributes,
	value,
	setValue,
	removeCondition,
} ) => {
	const [ startDate, setStartDate ] = useState( new Date() );

	useEffect( () => {
		if ( isValid( value ) ) {
			setStartDate( value );
		}
	}, [ value ] );

	return (
		<DatePicker
			selected={ startDate }
			onChange={ ( date ) => setValue( date ) }
		/>
	);
};

export default DateLogicControl;
