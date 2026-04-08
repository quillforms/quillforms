/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ChoicesBulkBtn,
	ChoicesInserter,
} from '@quillforms/admin-components';

/**
 * WordPress Dependecies
 */
import { Fragment } from 'react';
import { __ } from '@wordpress/i18n';

const DropdownControls = (props) => {
	const {
		attributes: { choices },
		setAttributes,
	} = props;

	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__("Choices", "quillforms")} />
					<ChoicesBulkBtn
						choices={choices}
						setChoices={(val) => {
							setAttributes({ choices: val });
						}}
					/>
				</ControlWrapper>
				<ControlWrapper orientation="vertical">
					<div className="block-editor-dropdown__choices-inserter-shell">
						<ChoicesInserter
							choices={choices}
							setChoices={(val) => {
								setAttributes({ choices: val });
							}}
							withAttachment={false}
							rowItemSize={60}
						/>
					</div>
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default DropdownControls;
