/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	SelectControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DateControls = (props) => {
	const {
		id,
		attributes: { format, separator },
		setAttributes,
	} = props;
	const formatOptions = [
		{
			key: 'MMDDYYYY',
			name: __('MMDDYYYY', 'quillforms'),
		},
		{
			key: 'DDMMYYYY',
			name: __('DDMMYYYY', 'quillforms'),
		},
		{
			key: 'YYYYMMDD',
			name: __('YYYYMMDD', 'quillforms'),
		},
	];
	const separatorOptions = [
		{
			key: '/',
			name: __('/', 'quillforms'),
		},
		{
			key: '-',
			name: __('-', 'quillforms'),
		},
		{
			key: '.',
			name: __('.', 'quillforms'),
		},
	];
	const {
		setFieldAnswer,
		setIsFieldAnswered,
		setIsFieldValid,
		setFieldValidationErr,
	} = useDispatch('quillForms/renderer-core');
	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label={__('Date Format', 'quillforms')} />

				<SelectControl
					className={css`
						margin-top: 5px;
					` }
					onChange={({ selectedItem }) => {
						// Formatting changes can cause errors if the field has value already.
						// The problem comes when trying to assign invalid values to month or year or day.
						// That's why we are going to reset the field value.
						// The ideal solution should be reformatting the existing value to the new format not just resetting.
						setFieldAnswer(id, '');
						setIsFieldValid(id, true);
						setIsFieldAnswered(id, false);
						setFieldValidationErr(id, null);
						setAttributes({ format: selectedItem.key });
					}}
					options={formatOptions}
					value={formatOptions.find(
						(option) => option.key === format
					)}
				/>
				<SelectControl
					className={css`
						margin-top: 10px;
					` }
					value={separatorOptions.find(
						(option) => option.key === separator
					)}
					onChange={({ selectedItem }) => {
						// Formatting changes can cause errors if the field has value already.
						// The problem comes when trying to assign invalid values to month or year or day.
						// That's why we are going to reset the field value.
						// The ideal solution should be reformatting the existing value to the new format not just resetting.
						setFieldAnswer(id, '');
						setIsFieldValid(id, true);
						setIsFieldAnswered(id, false);
						setFieldValidationErr(id, null);
						setAttributes({ separator: selectedItem.key });
					}}
					options={separatorOptions}
				/>
			</ControlWrapper>
		</BaseControl>
	);
};
export default DateControls;
