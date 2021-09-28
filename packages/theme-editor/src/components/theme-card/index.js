/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const ThemeCard = ( { isSelected, index, children } ) => {
	const [ isMounted, setIsMounted ] = useState( false );

	useEffect( () => {
		setTimeout( () => {
			setIsMounted( true );
		}, 50 );
	} );
	return (
		<div
			className={ classnames(
				'theme-editor-theme-card',
				css`
					opacity: 0;
					transform: scale( 0.6 );
					transition: all 0.3s ease;
					transition-delay: ${ index * 0.05 }s;

					&.mounted {
						opacity: 1;
						transform: scale( 1 );
					}
				`,
				{
					mounted: isMounted,
					isSelected,
				}
			) }
		>
			{ children }
		</div>
	);
};

export default ThemeCard;
