/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	ChoicesBulkBtn,
	ChoicesInserter,
	TextControl
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from 'react';
import { __ } from '@wordpress/i18n';

const multipleChoiceControls = (props) => {
	const {
		attributes: { yesLabel, noLabel },
		setAttributes,
	} = props;
	return (
		<Fragment>
			<BaseControl>
				<ControlLabel label={__("Yes Label", "quillforms")} />
				<TextControl
					value={yesLabel}
					onChange={(value) => setAttributes({ yesLabel: value })}
				/>
			</BaseControl>
			<BaseControl>
				<ControlLabel label={__("No Label", "quillforms")} />
				<TextControl
					value={noLabel}
					onChange={(value) => setAttributes({ noLabel: value })}
				/>
			</BaseControl>
		</Fragment>
	);
};
export default multipleChoiceControls;
