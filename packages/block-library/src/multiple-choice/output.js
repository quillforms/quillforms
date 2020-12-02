/**
 * WordPress Dependencies
 */
import { useMetaField, useTheme } from '@quillforms/renderer-components';
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import tinyColor from 'tinycolor2';

const MultipleChoiceOutput = ( props ) => {
	const {
		id,
		attributes,
		required,
		setIsValid,
		setIsAnswered,
		showSubmitBtn,
		setValidationErr,
		val,
		setVal,
		next,
	} = props;
	let { choices, multiple, verticalAlign } = attributes;
	const messages = useMetaField( 'messages' );
	const charCode = 'a'.charCodeAt( 0 );
	const theme = useTheme();
	const answersColor = tinyColor( theme.answersColor );

	// Simple algorithm to generate alphabatical idented order
	const identName = ( a ) => {
		const b = [ a ];
		let sp, out, i, div;

		sp = 0;
		while ( sp < b.length ) {
			if ( b[ sp ] > 25 ) {
				div = Math.floor( b[ sp ] / 26 );
				b[ sp + 1 ] = div - 1;
				b[ sp ] %= 26;
			}
			sp += 1;
		}

		out = '';
		for ( i = 0; i < b.length; i += 1 ) {
			out = String.fromCharCode( charCode + b[ i ] ) + out;
		}

		return out;
	};

	choices = choices.map( ( choice, index ) => {
		if ( ! choice.label ) choice.label = 'Choice ' + ( index + 1 );
		if ( ! verticalAlign && choice.label.length > 26 ) verticalAlign = true;
		choice.selected =
			val &&
			val.length > 0 &&
			val.some( ( item ) => item.ref === choice.ref )
				? true
				: false;

		return choice;
	} );

	const checkfieldValidation = () => {
		if ( required === true && ( ! val || val.length === 0 ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		checkfieldValidation( val );
	}, [ attributes ] );

	useEffect( () => {
		if ( multiple ) {
			if ( val?.length > 0 ) {
				showSubmitBtn( true );
			} else {
				showSubmitBtn( false );
			}
		}
	}, [ val ] );
	return (
		<div className="question__wrapper">
			<div
				className={
					'multiplechoice__options' +
					( verticalAlign ? ' valigned' : '' )
				}
			>
				{ choices &&
					choices.length > 0 &&
					choices.map( ( choice, index ) => {
						return (
							<div
								role="presentation"
								key={ `block-multiple-choice-${ id }-choice-${ choice.ref }` }
								className={ classnames(
									'multipleChoice__optionWrapper',
									{
										selected: choice.selected,
									},
									css`
										background: ${tinyColor(
											theme.answersColor
										)
											.setAlpha( 0.1 )
											.toString()};

										border-color: ${theme.answersColor};
										color: ${theme.answersColor};

										&:hover {
											background: ${tinyColor(
												theme.answersColor
											)
												.setAlpha( 0.2 )
												.toString()};
										}

										&.selected {
											background: ${tinyColor(
												theme.answersColor
											)
												.setAlpha( 0.75 )
												.toString()};
											color: ${tinyColor(
												theme.answersColor
											).isDark()
												? '#fff'
												: tinyColor(
														theme.answersColor
												  )
														.darken( 20 )

														.toString()};

											.multipleChoice__optionKey {
												color: ${tinyColor(
													theme.answersColor
												).isDark()
													? '#fff'
													: tinyColor(
															theme.answersColor
													  )
															.darken( 20 )

															.toString()};

												border-color: ${tinyColor(
													theme.answersColor
												).isDark()
													? '#fff'
													: tinyColor(
															theme.answersColor
													  )
															.darken( 20 )

															.toString()};
											}
										}
									`
								) }
								onClick={ () => {
									let $val = [ ...val ];
									if ( ! $val ) $val = [];
									if ( choice.selected ) {
										$val.splice(
											$val.findIndex(
												( item ) =>
													item.ref === choice.ref
											),
											1
										);
										setVal( $val );
									} else {
										if ( multiple )
											$val.push( {
												ref: choice.ref,
												label: choice.label,
											} );
										else
											$val = [
												{
													ref: choice.ref,
													label: choice.label,
												},
											];
										setVal( $val );
										if ( multiple ) {
											showSubmitBtn( true );
										} else {
											setTimeout( () => {
												next();
											}, 700 );
										}
									}

									if ( $val.length > 0 )
										setIsAnswered( true );
									else setIsAnswered( false );
								} }
							>
								<span className="multipleChoice__optionLabel">
									{ choice.label }
								</span>
								<span
									className={ classnames(
										'multipleChoice__optionKey',
										css`
											background: ${tinyColor(
												theme.answersColor
											)
												.setAlpha( 0.1 )
												.toString()};
											color: ${theme.answersColor};
											border-color: ${tinyColor(
												theme.answersColor
											)
												.setAlpha( 0.4 )
												.toString()};
										`
									) }
								>
									<span
										className={ classnames(
											'multipleChoice__optionKeyTip',
											css`
												background: ${theme.answersColor};
												color: ${tinyColor(
													theme.answersColor
												).isDark()
													? '#fff'
													: tinyColor(
															theme.answersColor
													  )
															.darken( 20 )
															.toString()};
											`
										) }
									>
										KEY
									</span>
									{ identName( index ).toUpperCase() }
								</span>
							</div>
						);
					} ) }
			</div>
		</div>
	);
};
export default MultipleChoiceOutput;
