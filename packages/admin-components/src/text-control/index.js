/**
 * WordPress Dependencies
 */
import { TextControl } from '@wordpress/components';

const CustomTextControl = ( props ) => {
	return (
		<div className={ 'admin-components-text-control' }>
			<TextControl { ...props } />
		</div>
	);
};

export default CustomTextControl;
