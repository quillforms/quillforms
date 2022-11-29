/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import classnames from 'classnames';
import { css } from 'emotion';
import tinyColor from 'tinycolor2';

import useGeneralTheme from '../../../hooks/use-general-theme';

const RadioControl = ( {
	options,
	id,
	selected,
	onChange,
	...additionalProps
} ) => {
	const generalTheme = useGeneralTheme();
	const onChangeValue = ( optionValue ) => onChange( optionValue );

	if ( ! options?.length ) {
		return null;
	}
	const answersColor = tinyColor( generalTheme.answersColor );

	return (
		<>
			{ options.map( ( option, index ) => (
				<div
					key={ option.value }
					className={ classnames(
						'renderer-components-radio-control__option',
						{
							selected: option.value === selected,
						},
						css`
							border-color: ${ generalTheme.answersColor };
							color: ${ generalTheme.answersColor };
							.check {
								border-color: ${ generalTheme.answersColor };
							}
							&:hover {
								background: ${ answersColor
									.setAlpha( 0.2 )
									.toString() };
							}

							&.selected {
								background: ${ tinyColor(
									generalTheme.answersColor
								)
									.setAlpha( 0.75 )
									.toString() };
								color: ${ tinyColor(
									generalTheme.answersColor
								).isDark()
									? '#fff'
									: '#333' };
								input[type='radio'] ~ .check {
									border: 5px solid
										${ tinyColor(
											generalTheme.answersColor
										).isDark()
											? '#fff'
											: '#333' };
								}

								input[type='radio'] ~ .check::before {
									background: ${ generalTheme.answersColor };
								}
							}
						`
					) }
					onClick={ () => onChangeValue( option.value ) }
				>
					<input
						id={ `${ id }-${ index }` }
						className="renderer-components-radio-control__input"
						type="radio"
						name={ id }
						value={ option.value }
						checked={ option.value === selected }
						{ ...additionalProps }
					/>
					<label htmlFor={ `${ id }-${ index }` }>
						{ option.label }
					</label>
					<div className="check">
						<div className="inside"></div>
					</div>
				</div>
			) ) }
		</>
	);
};
export default RadioControl;
