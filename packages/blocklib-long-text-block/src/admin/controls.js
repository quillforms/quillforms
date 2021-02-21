/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
	TextControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

const LongTextControl = ( { attributes, setAttributes } ) => {
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
					<TextControl
						type="number"
						placeholder="1-1000000"
						value={ maxCharacters }
						onChange={ ( e ) =>
							setAttributes( {
								maxCharacters: e.target.value,
							} )
						}
					/>
				) }
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default LongTextControl;
