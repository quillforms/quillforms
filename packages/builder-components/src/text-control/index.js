/**
 * WordPress Dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import Input from '@material-ui/core/Input';

const TextControl = ( {
	type,
	value,
	setValue,
	maxLength = null,
	forceFocusOnMount = false,
} ) => {
	console.log( value );
	const ref = useRef();
	useEffect( () => {
		if ( forceFocusOnMount ) {
			ref.current.focus();
		}
	}, [] );
	return (
		<div className="builder-components-text-control">
			<div className="builder-components-text-control__input">
				<Input
					inputRef={ ref }
					inputProps={ {
						maxLength,
					} }
					type={ type ? type : 'text' }
					value={ value }
					onChange={ ( e ) => setValue( e.target.value ) }
				/>
				{ maxLength && (
					<div className="builder-components-text-control__input-characters-count">
						{ `${ value.length }/${ maxLength }` }
					</div>
				) }
			</div>
		</div>
	);
};

export default TextControl;
