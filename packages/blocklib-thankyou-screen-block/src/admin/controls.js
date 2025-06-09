/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	TextControl,
	SelectControl,
	ComboboxControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { RangeControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const thnakyouScreenControls = (props) => {
	const { id, attributes, setAttributes } = props;
	const {
		showButton,
		buttonText,
		buttonMode,
		redirectUrl,
		autoRedirect,
		autoRedirectUrl,
		autoRedirectLag,
		redirectOnSameWindow,
	} = attributes;
	const buttonModeOptions = [
		{
			key: 'reload',
			name: 'Reload',
		},

		{
			key: 'redirect',
			name: 'Redirect',
		},
	];
	return (
		<>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Auto redirect" />
					<ToggleControl
						checked={autoRedirect}
						onChange={() =>
							setAttributes({ autoRedirect: !autoRedirect })
						}
					/>
				</ControlWrapper>
			</BaseControl>
			{autoRedirect && (
				<BaseControl>
					<ControlWrapper orientation="vertical">
						<ControlLabel label="Auto redirect url" />

						<ComboboxControl
							id={id}
							value={{ type: 'text', value: autoRedirectUrl }}
							onChange={(value) =>
								setAttributes({
									autoRedirectUrl: value.value,
								})
							}
							isToggleEnabled={false}
							placeholder="https://"
						/>
					</ControlWrapper>
					<RangeControl
						label="Auto redirect after (sec)"
						value={autoRedirectLag}
						onChange={(value) =>
							setAttributes({
								autoRedirectLag: value,
							})
						}
						min={0}
						max={5}
						step={0.1}
					/>
				</BaseControl>
			)}
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Button" />
					<ToggleControl
						checked={showButton}
						onChange={() =>
							setAttributes({ showButton: !showButton })
						}
					/>
				</ControlWrapper>
				{showButton && (
					<TextControl
						placeholder="Button Text"
						value={buttonText}
						onChange={(val) =>
							setAttributes({ buttonText: val })
						}
					/>
				)}
			</BaseControl>
			{showButton && (
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label="Button Mode" />
						<SelectControl
							value={buttonModeOptions.find(
								(option) => option.key === buttonMode
							)}
							onChange={({ selectedItem }) =>
								setAttributes({
									buttonMode: selectedItem.key,
								})
							}
							options={buttonModeOptions}
						/>
					</ControlWrapper>
					{buttonMode === 'redirect' && (
						<>
							<ComboboxControl
								id={id}
								value={{ type: 'text', value: redirectUrl }}
								onChange={(value) =>
									setAttributes({
										redirectUrl: value.value,
									})
								}
								isToggleEnabled={false}
								placeholder="https://"
							/>
							<ControlWrapper orientation="horizontal">
								<ControlLabel label="Redirect on same window" />
								<ToggleControl
									checked={redirectOnSameWindow}
									onChange={() =>
										setAttributes({
											redirectOnSameWindow: !redirectOnSameWindow,
										})
									}
								/>
							</ControlWrapper>
						</>
					)}
				</BaseControl>
			)}
		</>
	);
};
export default thnakyouScreenControls;
