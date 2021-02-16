/**
 * WordPress Dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import Input from '@material-ui/core/Input';
import classnames from 'classnames';

const TextControl = ( {
	className,
	type,
	value,
	setValue,
	maxLength = null,
	forceFocusOnMount = false,
	...props
} ) => {
	const ref = useRef();
	useEffect( () => {
		if ( forceFocusOnMount ) {
			ref.current.focus();
		}
	}, [] );
	return (
		<div
			className={ classnames(
				'builder-components-text-control',
				className
			) }
		>
			<div className="builder-components-text-control__input">
				<Input
					inputRef={ ref }
					inputProps={ {
						maxLength,
					} }
					type={ type ? type : 'text' }
					value={ value }
					onChange={ ( e ) => setValue( e.target.value ) }
					{ ...props }
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
