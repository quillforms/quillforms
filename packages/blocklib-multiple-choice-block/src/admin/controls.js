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

const isLimitEnabled = (value) => {
	if (value === false || value === undefined || value === null) {
		return false;
	}
	if (typeof value === 'number') {
		return !Number.isNaN(value);
	}
	if (typeof value === 'string' && value !== '') {
		return Number.isFinite(Number(value));
	}
	return false;
};

const multipleChoiceControls = (props) => {
	const {
		attributes: { multiple, verticalAlign, choices, min, max, other, otherText, otherPlaceholder, deselectAllWhenOtherSelected },
		setAttributes,
	} = props;

	const minLimitActive = isLimitEnabled(min);
	const maxLimitActive = isLimitEnabled(max);

	return (
		<Fragment>
			<BaseControl>
				<div className="block-editor-multiple-choice__feature">
					<div className="block-editor-multiple-choice__feature-header">
						<ControlWrapper orientation="horizontal">
							<ControlLabel label={__("Multiple", "quillforms")} />
							<ToggleControl
								checked={!!multiple}
								onChange={() =>
									setAttributes({ multiple: !multiple })
								}
							/>
						</ControlWrapper>
					</div>
					{multiple && (
						<div className="block-editor-multiple-choice__feature-panel">
							<div className="block-editor-multiple-choice__subcard">
								<ControlWrapper orientation='horizontal'>
									<ControlLabel label={__("Minimum limit for choices", "quillforms")} />
									<ToggleControl
										checked={minLimitActive}
										onChange={() => {
											setAttributes({ min: minLimitActive ? false : 1 });
										}}
									/>
								</ControlWrapper>
								{minLimitActive && (
									<TextControl
										type="number"
										value={min}
										onChange={(val) => {
											const n = parseInt(val, 10);
											setAttributes({ min: Number.isFinite(n) ? n : 1 });
										}}
									/>
								)}
							</div>
							<div className="block-editor-multiple-choice__subcard">
								<ControlWrapper orientation='horizontal'>
									<ControlLabel label={__("Maximum limit for choices", "quillforms")} />
									<ToggleControl
										checked={maxLimitActive}
										onChange={() => {
											setAttributes({ max: maxLimitActive ? false : 5 });
										}}
									/>
								</ControlWrapper>
								{maxLimitActive && (
									<TextControl
										type="number"
										value={max}
										onChange={(val) => {
											const n = parseInt(val, 10);
											setAttributes({ max: Number.isFinite(n) ? n : 5 });
										}}
									/>
								)}
							</div>
						</div>
					)}
				</div>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__("Vertical Align", "quillforms")} />
					<ToggleControl
						checked={!!verticalAlign}
						onChange={() =>
							setAttributes({ verticalAlign: !verticalAlign })
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<div className="block-editor-multiple-choice__feature">
					<div className="block-editor-multiple-choice__feature-header">
						<ControlWrapper orientation="horizontal">
							<ControlLabel label={__("Other Option", "quillforms")} isNew />
							<ToggleControl
								checked={!!other}
								onChange={() =>
									setAttributes({ other: !other })
								}
							/>
						</ControlWrapper>
					</div>
					{other && (
						<div className="block-editor-multiple-choice__feature-panel">
							<div className="block-editor-multiple-choice__subcard">
								<ControlWrapper orientation="vertical">
									<ControlLabel label={__("Other Text", "quillforms")} />
									<TextControl
										value={otherText}
										onChange={(val) => {
											setAttributes({ otherText: val });
										}}
									/>
								</ControlWrapper>
							</div>
							<div className="block-editor-multiple-choice__subcard">
								<ControlWrapper orientation="vertical">
									<ControlLabel label={__("Other Placeholder", "quillforms")} />
									<TextControl
										value={otherPlaceholder}
										onChange={(val) => {
											setAttributes({ otherPlaceholder: val });
										}}
									/>
								</ControlWrapper>
							</div>
							{multiple && (
								<div className="block-editor-multiple-choice__subcard">
									<ControlWrapper orientation="horizontal">
										<ControlLabel label={__("Deselect All When Other Selected", "quillforms")} />
										<ToggleControl
											checked={!!deselectAllWhenOtherSelected}
											onChange={() => setAttributes({ deselectAllWhenOtherSelected: !deselectAllWhenOtherSelected })}
										/>
									</ControlWrapper>
								</div>
							)}
						</div>
					)}
				</div>
			</BaseControl>
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
					<div className="block-editor-multiple-choice__choices-inserter-shell">
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
export default multipleChoiceControls;
