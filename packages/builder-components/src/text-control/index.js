/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

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
	useEffect( () => {} );
	return (
		<div className="builder-components-text-control">
			<div className="builder-components-text-control__input">
				<Input
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={ forceFocusOnMount }
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
