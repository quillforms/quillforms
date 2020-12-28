/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
	TextControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

const statementControls = ( props ) => {
	const CHARACTER_LIMIT = 22;
	const { attributes, setAttributes } = props;
	const { buttonText, quotationMarks } = attributes;
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Quotation marks" />
					<ToggleControl
						checked={ quotationMarks }
						onChange={ () =>
							setAttributes( {
								quotationMarks: ! quotationMarks,
							} )
						}
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="vertical">
					<__experimentalControlLabel label="Button text" />
					<TextControl
						placeholder="Button Text"
						maxLength={ CHARACTER_LIMIT }
						value={ buttonText }
						setValue={ ( val ) =>
							setAttributes( { buttonText: val } )
						}
					/>
					<div className="helper-text">
						{ `${ buttonText.length }/${ CHARACTER_LIMIT }` }{ ' ' }
					</div>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default statementControls;
