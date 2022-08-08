/**
 * WordPress Dependencies
 */
import { useState, useEffect } from 'react';
/**
 * External Dependencies
 */
import classnames from 'classnames';

const ThemeCard = ( { isSelected, index, children } ) => {
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
