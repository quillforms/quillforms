/**
 * QuillForms Dependencies
 */
import { useBlockTheme } from '@quillforms/renderer-core';
/**
 * WordPress Dependencies
 */
import { memo } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';

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
const ChoicesWrapper = memo(
	( { id, attributes, val, setVal, setChoiceClicked } ) => {
		const { verticalAlign, multiple, choices, themeId } = attributes;

		const theme = useBlockTheme( themeId );
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

		const $verticalAlign = verticalAlign;
		const $choices = cloneDeep( choices ).map( ( $choice, index ) => {
			if ( ! $choice.label ) $choice.label = 'Choice ' + ( index + 1 );
			// if ( ! verticalAlign && $choice.label.length > 26 )
			// 	$verticalAlign = true;
			$choice.selected =
				val && val.length > 0 && val.includes( $choice.value )
					? true
					: false;

			return $choice;
		} );

		const clickHandler = ( newValue, selected ) => {
			let $val;
			if ( val?.length > 0 ) {
				$val = cloneDeep( val );
			} else {
				$val = [];
			}
			if ( selected ) {
				$val.splice(
					$val.findIndex( ( item ) => item === newValue ),
					1
				);
				setVal( $val );
			} else {
				if ( multiple ) {
					$val.push( newValue );
				} else {
					$val = [ newValue ];
				}
				setVal( $val );
				setChoiceClicked( false );
				setTimeout( () => {
					setChoiceClicked( true );
				}, 0 );
			}
		};
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
									theme={ theme }
									key={ `block-multiple-choice-${ id }-choice-${ choice.value }` }
									choiceLabel={ choice.label }
									choiceValue={ choice.value }
									order={ identName( index ).toUpperCase() }
									selected={ choice.selected }
									multiple={ multiple }
									clickHandler={ () =>
										clickHandler(
											choice.value,
											choice.selected
										)
									}
								/>
							);
						} ) }
				</div>
			</div>
		);
	},
	areEqual
);
export default ChoicesWrapper;
