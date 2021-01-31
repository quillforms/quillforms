/**
 * WordPress Dependencies
 */
import { forwardRef } from '@wordpress/element';

const Button = forwardRef( ( { active, ...props }, ref ) => (
	<span
		{ ...props }
		ref={ ref }
		style={ { cursor: 'pointer', color: active ? '#09a966' : '#ccc' } }
	/>
) );

export default Button;
