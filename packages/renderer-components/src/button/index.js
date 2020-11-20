/**
 * External dependencies
 */
import classnames from 'classnames';

const Button = ( { className, onClick, children } ) => {
	return (
		<div
			className={ classnames( 'renderer-components-button', className ) }
			role="presentation"
			onClick={ onClick }
		>
			{ children }
		</div>
	);
};

export default Button;
