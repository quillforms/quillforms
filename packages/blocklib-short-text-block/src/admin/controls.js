/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	TextControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

const shortTextControl = ( { attributes, setAttributes } ) => {
	const { setMaxCharacters, maxCharacters } = attributes;

	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Max Characters" />
					<ToggleControl
						checked={ setMaxCharacters }
						onChange={ () => {
							setAttributes( {
								setMaxCharacters: ! setMaxCharacters,
							} );
						} }
					/>
				</ControlWrapper>
				{ setMaxCharacters && (
					<TextControl
						type="number"
						placeholder="1-1000000"
						value={ maxCharacters }
						onChange={ ( val ) =>
							setAttributes( {
								maxCharacters: val,
							} )
						}
					/>
				) }
			</BaseControl>
		</Fragment>
	);
};
export default shortTextControl;
