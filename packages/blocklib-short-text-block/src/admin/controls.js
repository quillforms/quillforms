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

const shortTextControl = ({ attributes, setAttributes }) => {
	const { setMaxCharacters, maxCharacters, minCharacters } = attributes;
	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Min Characters', 'quillforms')} />
					<ToggleControl
						checked={minCharacters !== false}
						onChange={() => {
							setAttributes({
								minCharacters:
									minCharacters !== false ? false : 0,
							});
						}}
					/>
				</ControlWrapper>
				{minCharacters !== false && (
					<TextControl
						type="number"
						value={minCharacters}
						onChange={(val) => {
							setAttributes({
								minCharacters: val,
							});
						}}
					/>
				)}
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Max Characters', 'quillforms')} />
					<ToggleControl
						checked={setMaxCharacters}
						onChange={() => {
							setAttributes({
								setMaxCharacters: !setMaxCharacters,
							});
						}}
					/>
				</ControlWrapper>
				{setMaxCharacters && (
					<TextControl
						type="number"
						value={maxCharacters}
						onChange={(val) =>
							setAttributes({
								maxCharacters: val,
							})
						}
					/>
				)}
			</BaseControl>
		</Fragment>
	);
};
export default shortTextControl;
