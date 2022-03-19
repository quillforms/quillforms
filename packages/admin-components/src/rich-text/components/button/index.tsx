/**
 * WordPress Dependencies
 */
import { forwardRef } from '@wordpress/element';

import { css } from 'emotion';

interface Props {
	children: React.ReactNode;
	active: boolean;
	onMouseDown: React.MouseEventHandler< HTMLSpanElement > | undefined;
}
const Button = forwardRef< HTMLSpanElement, React.PropsWithChildren< Props > >(
	( { active, onMouseDown, children }, ref ) => (
		<span
			onMouseDown={ onMouseDown }
			ref={ ref }
			className={ css`
				cursor: pointer;

				svg {
					fill: ${ active ? '#09a966' : '#ccc' };
				}
			` }
		>
			{ children }
		</span>
	)
);

export default Button;
