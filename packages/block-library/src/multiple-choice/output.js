/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

const DropdownOutput = ( props ) => {
	const {
		attributes,
		required,
		setIsValid,
		setIsAnswered,
		isReviewing,
		next,
		val,
		setVal,
		setErrMsgKey,
		setShowErr,
	} = props;
	let { choices, multiple, verticalAlign } = attributes;
	const charCode = 'a'.charCodeAt( 0 );

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
			setErrMsgKey( 'label.errorAlert.required' );
		} else {
			setIsValid( true );
			setErrMsgKey( null );
		}
	};

	useEffect( () => {
		setShowErr( false );
		checkfieldValidation( val );
	}, [ isReviewing, attributes ] );

	useEffect( () => {
		if ( isReviewing ) setShowErr( true );
	}, [ isReviewing ] );

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
								role="button"
								tabIndex="-1"
								key={ choice.ref }
								className={
									'multipleChoice__optionWrapper' +
									( choice.selected === true
										? ' selected'
										: '' )
								}
								onMouseDown={ () => {
									let $val = val;
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
												id: choice.ref,
												label: choice.label,
											} );
										else
											$val = [
												{
													id: choice.ref,
													label: choice.label,
												},
											];
										setVal( $val );
										if ( ! multiple )
											setTimeout( () => {
												next();
											}, 700 );
									}

									if ( $val.length > 0 )
										setIsAnswered( true );
									else setIsAnswered( false );
								} }
							>
								<span className="multipleChoice__optionLabel">
									{ choice.label }
								</span>
								<span className="multipleChoice__optionKey">
									<span className="multipleChoice__optionKeyTip">
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
export default DropdownOutput;
