/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlLabel,
	ControlWrapper,
	TextControl,
} from '@quillforms/admin-components';
import { useEffect } from 'react';
import AlertMessageWrapper from '../alert-message-wrapper';
import { __ } from '@wordpress/i18n';

const EmailSubject = ({
	value,
	setValue,
	isValid,
	setIsValid,
	isReviewing,
}) => {
	useEffect(() => {
		if (value && value.length > 0) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [value]);
	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label={__('Subject', 'quillforms')} showAsterisk={true} />
				<TextControl
					value={value}
					onChange={(newVal) => setValue(newVal)}
					withMergeTags={true}
				/>
				{!isValid && isReviewing && (
					<AlertMessageWrapper type="error">
						{__('This field is required!', 'quillforms')}
					</AlertMessageWrapper>
				)}
			</ControlWrapper>
		</BaseControl>
	);
};
export default EmailSubject;
