/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import Input from '@material-ui/core/Input';

const shortTextControl = ( { attributes, setAttributes } ) => {
	const { setMaxCharacters, maxCharacters } = attributes;

	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Max Characters" />
					<ToggleControl
						checked={ setMaxCharacters }
						onChange={ () => {
							setAttributes( {
								setMaxCharacters: ! setMaxCharacters,
							} );
						} }
					/>
				</__experimentalControlWrapper>
				{ setMaxCharacters && (
					<div className="block-text-input-wrapper">
						<Input
							type="number"
							inputProps={ { min: '1', max: '1000000' } }
							placeholder="1-1000000"
							value={ maxCharacters }
							onChange={ ( e ) =>
								setAttributes( {
									maxCharacters: e.target.value,
								} )
							}
						/>
					</div>
				) }
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default shortTextControl;
