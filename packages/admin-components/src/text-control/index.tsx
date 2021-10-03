/**
 * WordPress Dependencies
 */
import { TextControl } from '@wordpress/components';

const CustomTextControl: React.FC< TextControl.Props > = ( props ) => {
	if ( props.autoComplete === undefined ) {
		props = {
			...props,
			autoComplete: 'off',
		};
	}
	return (
		<div className={ 'admin-components-text-control' }>
			<TextControl { ...props } />
		</div>
	);
};

export default CustomTextControl;
