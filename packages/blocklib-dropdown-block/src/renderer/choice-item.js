/**
 * QuillForms Dependencies
 */
import { useTheme } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import tinyColor from 'tinycolor2';
import { css } from 'emotion';

let selectionTimer;

const ChoiceItem = ( { choice, val, clickHandler, showDropdown } ) => {
	const [ isBeingSelected, setIsBeingSelected ] = useState( false );

	useEffect( () => {
		if ( ! showDropdown ) setIsBeingSelected( false );
	}, [ showDropdown ] );
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );
	const isSelected = !! val && val === choice.value;
	return (
		<div
			className={ classnames(
				'dropdown__choiceWrapper',
				{
					selected: isSelected,
					isBeingSelected,
				},
				css`
					background: ${ answersColor.setAlpha( 0.1 ).toString() };

					border-color: ${ theme.answersColor };
					color: ${ theme.answersColor };

					&:hover {
						background: ${ answersColor
							.setAlpha( 0.2 )
							.toString() };
					}

					&.selected {
						background: ${ tinyColor( theme.answersColor )
							.setAlpha( 0.75 )
							.toString() };
						color: ${ tinyColor( theme.answersColor ).isDark()
							? '#fff'
							: tinyColor( theme.answersColor )
									.darken( 20 )
									.toString() };
					}
				`
			) }
			role="presentation"
			onClick={ () => {
				if ( isSelected ) {
					clearTimeout( selectionTimer );
				}
				if ( ! isSelected ) setIsBeingSelected( true );
				clickHandler();
				selectionTimer = setTimeout( () => {
					if ( isBeingSelected ) setIsBeingSelected( false );
				}, 400 );
			} }
		>
			{ choice.label }
		</div>
	);
};

export default ChoiceItem;
