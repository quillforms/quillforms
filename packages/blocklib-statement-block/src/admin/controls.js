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

const statementControls = ( props ) => {
	const { attributes, setAttributes } = props;
	const { buttonText, quotationMarks } = attributes;
	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Quotation marks" />
					<ToggleControl
						checked={ quotationMarks }
						onChange={ () =>
							setAttributes( {
								quotationMarks: ! quotationMarks,
							} )
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="vertical">
					<ControlLabel label="Button text" />
					<TextControl
						placeholder="Button Text"
						value={ buttonText }
						onChange={ ( val ) =>
							setAttributes( { buttonText: val } )
						}
					/>
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default statementControls;
