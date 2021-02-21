/**
 * WordPress Dependencies
 */
import { forwardRef } from '@wordpress/element';

import { css } from 'emotion';
const Button = forwardRef( ( { active, ...props }, ref ) => (
	<span
		{ ...props }
		ref={ ref }
		className={ css`
			cursor: pointer;

			svg {
				fill: ${active ? '#09a966' : '#ccc'};
			}
		` }
	/>
) );

export default Button;
