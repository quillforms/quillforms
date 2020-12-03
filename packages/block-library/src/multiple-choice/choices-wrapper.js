/**
 * WordPress Dependencies
 */
import { memo } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ChoiceItem from './choice-item';

const areEqual = ( prevProps, nextProps ) => {
	if (
		JSON.stringify( prevProps.attributes ) ===
			JSON.stringify( nextProps.attributes ) &&
		prevProps.val === nextProps.val
	) {
		return true;
	}
	return false;
};
const ChoicesWrapper = memo( ( { id, attributes, val, setVal, next } ) => {
	const { verticalAlign, multiple, choices } = attributes;

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

	let $verticalAlign = verticalAlign;
	const $choices = [ ...choices ].map( ( choice, index ) => {
		const $choice = { ...choice };
		if ( ! $choice.label ) $choice.label = 'Choice ' + ( index + 1 );
		if ( ! verticalAlign && $choice.label.length > 26 )
			$verticalAlign = true;
		$choice.selected =
			val &&
			val.length > 0 &&
			val.some( ( item ) => item.ref === choice.ref )
				? true
				: false;

		return $choice;
	} );

	return (
		<div className="qf-multiple-choice-block">
			<div
				className={ classnames( 'multiplechoice__options', {
					valigned: $verticalAlign,
				} ) }
			>
				{ $choices &&
					$choices.length > 0 &&
					$choices.map( ( choice, index ) => {
						return (
							<ChoiceItem
								key={ `block-multiple-choice-${ id }-choice-${ choice.ref }` }
								choiceLabel={ choice.label }
								choiceRef={ choice.ref }
								order={ identName( index ).toUpperCase() }
								selected={ choice.selected }
								setVal={ setVal }
								multiple={ multiple }
								next={ next }
							/>
						);
					} ) }
			</div>
		</div>
	);
}, areEqual );
export default ChoicesWrapper;
