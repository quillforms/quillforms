/**
 * External Dependencies
 */
import Select from '@material-ui/core/Select';
import classnames from 'classnames';

const SelectControl = ( { children, className, ...props } ) => {
	return (
		<div
			className={ classnames(
				'builder-components-select-control',
				className
			) }
		>
			<Select { ...props }>{ children }</Select>
		</div>
	);
};

export default SelectControl;
