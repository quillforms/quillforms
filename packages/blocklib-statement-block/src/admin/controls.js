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
import { __ } from '@wordpress/i18n';

const statementControls = (props) => {
	const { attributes, setAttributes } = props;
	const { buttonText, quotationMarks } = attributes;
	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Quotation marks', 'quillforms')} />
					<ToggleControl
						checked={quotationMarks}
						onChange={() =>
							setAttributes({
								quotationMarks: !quotationMarks,
							})
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="vertical">
					<ControlLabel label={__('Button text', 'quillforms')} />
					<TextControl
						placeholder={__('Button Text', 'quillforms')}
						value={buttonText}
						onChange={(val) =>
							setAttributes({ buttonText: val })
						}
					/>
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default statementControls;
