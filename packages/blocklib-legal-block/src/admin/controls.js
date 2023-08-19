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

const multipleChoiceControls = (props) => {
	const {
		attributes: { yesLabel, noLabel },
		setAttributes,
	} = props;
	return (
		<Fragment>
			<BaseControl>
				<ControlLabel label="Yes Label" />
				<TextControl
					value={yesLabel}
					onChange={(value) => setAttributes({ yesLabel: value })}
				/>
			</BaseControl>
			<BaseControl>
				<ControlLabel label="No Label" />
				<TextControl
					value={noLabel}
					onChange={(value) => setAttributes({ noLabel: value })}
				/>
			</BaseControl>
		</Fragment>
	);
};
export default multipleChoiceControls;
