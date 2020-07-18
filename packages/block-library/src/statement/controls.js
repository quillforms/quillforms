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
					<div className="block-text-input-wrapper">
						<Input
							placeholder="Button Text"
							inputProps={ {
								maxLength: CHARACTER_LIMIT,
							} }
							value={ buttonText }
							onChange={ ( e ) =>
								setAttributes( { buttonText: e.target.value } )
							}
						/>
						<div className="helper-text">
							{ `${ buttonText.length }/${ CHARACTER_LIMIT }` }{ ' ' }
						</div>
					</div>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default statementControls;
