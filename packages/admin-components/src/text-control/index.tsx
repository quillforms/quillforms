/**
 * WordPress Dependencies
 */
import { TextControl } from '@wordpress/components';

interface Props {
	type?: string;
	value?: string;
	autoComplete?: string;
	onChange: (val:string) => void;
	placeholder?: string;
	className?: string;
}
// @ts-ignore
const CustomTextControl: React.FC<Props> = ( props ) => {
	if ( props.autoComplete === undefined ) {
		props = {
			...props,
			autoComplete: 'off',
		};
	}
	return (
		<div className={ 'admin-components-text-control' }>
			{ /* @ts-expect-error */ }
			<TextControl { ...props } />
		</div>
	);
};

export default CustomTextControl;
