/**
 * QuillForms Dependencies
 */
import { useTheme } from '@quillforms/renderer-components';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import tinyColor from 'tinycolor2';

const ChoiceItem = ( {
	order,
	selected,
	val,
	setVal,
	choiceLabel,
	choiceRef,
	multiple,
	next,
} ) => {
	const { answersColor } = useTheme();

	const clickHandler = () => {
		let $val = val;
		if ( ! $val ) $val = [];
		if ( selected ) {
			$val.splice(
				$val.findIndex( ( item ) => item.ref === choiceRef ),
				1
			);
			setVal( $val );
		} else {
			if ( multiple )
				$val.push( {
					ref: choiceRef,
					label: choiceLabel,
				} );
			else
				$val = [
					{
						ref: choiceRef,
						label: choiceLabel,
					},
				];
			setVal( $val );
			if ( ! multiple ) {
				setTimeout( () => {
					next();
				}, 700 );
			}
		}
	};

	return (
		<div
			role="presentation"
			className={ classnames(
				'multipleChoice__optionWrapper',
				{
					selected,
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
			onClick={ clickHandler }
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
