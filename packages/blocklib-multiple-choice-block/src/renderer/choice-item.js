/**
 * QuillForms Depndencies
 */
import { useTheme } from '@quillforms/renderer-core';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import { useState } from '@wordpress/element';
import tinyColor from 'tinycolor2';

const ChoiceItem = ( { order, selected, choiceLabel, clickHandler } ) => {
	const { answersColor } = useTheme();
	const [ isClicked, setIsClicked ] = useState( false );
	return (
		<div
			role="presentation"
			className={ classnames(
				'multipleChoice__optionWrapper',
				{
					selected,
					clicked: isClicked,
				},
				css`
					background: ${tinyColor( answersColor )
						.setAlpha( 0.1 )
						.toString()};

					border-color: ${answersColor};
					color: ${answersColor};

					&:hover {
						background: ${tinyColor( answersColor )
							.setAlpha( 0.2 )
							.toString()};
					}

					&.selected {
						background: ${tinyColor( answersColor )
							.setAlpha( 0.75 )
							.toString()};
						color: ${tinyColor( answersColor ).isDark()
							? '#fff'
							: tinyColor( answersColor )
									.darken( 20 )

									.toString()};

						.multipleChoice__optionKey {
							color: ${tinyColor( answersColor ).isDark()
								? '#fff'
								: tinyColor( answersColor )
										.darken( 20 )

										.toString()};

							border-color: ${tinyColor( answersColor ).isDark()
								? '#fff'
								: tinyColor( answersColor )
										.darken( 20 )

										.toString()};
						}
					}
				`
			) }
			onClick={ () => {
				clickHandler();
				if ( ! selected ) {
					setIsClicked( false );
					setTimeout( () => {
						setIsClicked( true );
					}, 0 );
				}
			} }
		>
			<span className="multipleChoice__optionLabel">{ choiceLabel }</span>
			<span
				className={ classnames(
					'multipleChoice__optionKey',
					css`
						background: ${tinyColor( answersColor )
							.setAlpha( 0.1 )
							.toString()};
						color: ${answersColor};
						border-color: ${tinyColor( answersColor )
							.setAlpha( 0.4 )
							.toString()};
					`
				) }
			>
				<span
					className={ classnames(
						'multipleChoice__optionKeyTip',
						css`
							background: ${answersColor};
							color: ${tinyColor( answersColor ).isDark()
								? '#fff'
								: tinyColor( answersColor )
										.darken( 20 )
										.toString()};
						`
					) }
				>
					KEY
				</span>
				{ order }
			</span>
		</div>
	);
};

export default ChoiceItem;
