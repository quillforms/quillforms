/**
 * WordPress Dependencies
 */
import { CustomSelectControl } from '@wordpress/components';

const SelectControl: React.FC< CustomSelectControl.Props > = ( props ) => {
	return (
		<div className="admin-components-select-control">
			<CustomSelectControl { ...props } />
		</div>
	);
};

export default SelectControl;
