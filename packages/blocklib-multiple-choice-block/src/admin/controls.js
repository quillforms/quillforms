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
		attributes: { multiple, verticalAlign, choices, min, max },
		setAttributes,
	} = props;
	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Multiple" />
					<ToggleControl
						checked={multiple}
						onChange={() =>
							setAttributes({ multiple: !multiple })
						}
					/>
				</ControlWrapper>
			</BaseControl>
			{multiple && (
				<>
					<BaseControl>
						<ControlWrapper orientation='horizontal'>
							<ControlLabel label="Minimum limit for choices" />
							<ToggleControl checked={min} onChange={() => {
								setAttributes({ min: min === false ? 1 : false });
							}} />
						</ControlWrapper>
						{min !== false &&
							<TextControl
								type="number"
								value={min}
								onChange={(val) => {
									setAttributes({ min: val });
								}
								}
							/>
						}
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation='horizontal'>
							<ControlLabel label="Maximum limit for choices" />
							<ToggleControl checked={max} onChange={() => {
								setAttributes({ max: max === false ? 5 : false });
							}} />
						</ControlWrapper>
						{max !== false &&
							<TextControl
								type="number"
								value={max}
								onChange={(val) => {
									setAttributes({ max: val });
								}
								}
							/>
						}
					</BaseControl>
				</>
			)}
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Vertical Align" />
					<ToggleControl
						checked={verticalAlign}
						onChange={() =>
							setAttributes({ verticalAlign: !verticalAlign })
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Choices" />
					<ChoicesBulkBtn
						choices={choices}
						setChoices={(val) => {
							setAttributes({ choices: val });
						}}
					/>
				</ControlWrapper>
				<ControlWrapper orientation="vertical">
					<ChoicesInserter
						choices={choices}
						setChoices={(val) => {
							setAttributes({ choices: val });
						}}
					/>
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default multipleChoiceControls;
