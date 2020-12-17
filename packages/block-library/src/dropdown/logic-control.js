/**
 * External Dependencies
 */
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const DropdownLogicControl = ( { attributes, value, setValue } ) => {
	const { choices } = attributes;
	return (
		<div className="select-control-wrapper">
			<Select
				value={ value }
				onChange={ ( e ) => {
					console.log( e.target.value );
					setValue( e.target.value );
				} }
			>
				{ choices.map( ( choice ) => {
					return (
						<MenuItem
							key={ `choice-${ choice.ref }` }
							value={ choice.ref }
						>
							{ choice.label }
						</MenuItem>
					);
				} ) }
			</Select>
		</div>
	);
};

export default DropdownLogicControl;
