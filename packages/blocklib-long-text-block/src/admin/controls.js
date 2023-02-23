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
import { Fragment } from 'react';

const LongTextControl = ( { attributes, setAttributes } ) => {
	const { setMaxCharacters, maxCharacters, minCharacters } = attributes;

	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Min Characters" isNew />
					<ToggleControl
						checked={ minCharacters !== false }
						onChange={ () => {
							setAttributes( {
								minCharacters:
									minCharacters !== false ? false : 0,
							} );
						} }
					/>
				</ControlWrapper>
				{ minCharacters !== false && (
					<TextControl
						type="number"
						onChange={ ( val ) => {
							setAttributes( {
								minCharacters: val,
							} );
						} }
					/>
				) }
			</BaseControl>
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
export default LongTextControl;
