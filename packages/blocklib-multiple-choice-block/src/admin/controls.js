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
		attributes: { multiple, verticalAlign, choices, min, max, other, otherText },
		setAttributes,
	} = props;
	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__("Multiple", "quillforms")} />
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
							<ControlLabel label={__("Minimum limit for choices", "quillforms")} />
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
							<ControlLabel label={__("Maximum limit for choices", "quillforms")} />
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
					<ControlLabel label={__("Vertical Align", "quillforms")} />
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
					<ControlLabel label={__("Other Option", "quillforms")} isNew />
					<ToggleControl
						checked={other}
						onChange={() =>
							setAttributes({ other: !other })
						}
					/>
				</ControlWrapper>
			</BaseControl>
			{other && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label={__("Other Text", "quillforms")} />
						<TextControl
							value={otherText}
							onChange={(val) => {
								setAttributes({ otherText: val });
							}}
						/>
					</ControlWrapper>
				</BaseControl>
			)}
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
