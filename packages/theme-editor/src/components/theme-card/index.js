/**
 * External Dependencies
 */
import classnames from 'classnames';

const ThemeCard = ( { isSelected, children } ) => {
	return (
		<div
			className={ classnames( 'theme-editor-theme-card', {
				isSelected,
			} ) }
		>
			{ children }
		</div>
	);
};

export default ThemeCard;
