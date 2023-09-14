/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';
import { RadioControl } from '@wordpress/components';
/**
 * External Dependencies
 */
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { css } from 'emotion';
import { uniq } from 'lodash';
import classnames from 'classnames';
/**
 * Internal Dependencies
 */
import EmailSelect from '../email-select';
import AlertMessageWrapper from '../alert-message-wrapper';

const NotificationTo = ({
	recipients,
	toType,
	setValue,
	isValid,
	setIsValid,
	emailFields,
	isReviewing,
}) => {
	useEffect(() => {
		if (!recipients || recipients.length === 0) {
			setIsValid(false);
		} else {
			setIsValid(true);
		}
	}, [recipients]);

	const options = [
		{ key: 'email', name: 'Email' },
		{ key: 'field', name: 'Field' },
	];

	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel
					label="Send a notification to"
					showAsterisk={true}
				/>

				<RadioControl
					selected={toType}
					options={[
						{
							label: 'Email',
							value: 'email',
						},
						{
							label: 'Field',
							value: 'field',
						},
					]}
					onChange={(val) => {
						setValue({
							toType: val,
							recipients: [],
						});
					}}
				/>

			</ControlWrapper>
			{toType === 'email' && (
				<ReactMultiEmail
					placeholder="Type an email then hit a space"
					emails={
						recipients?.length > 0
							? recipients.filter((recipient) =>
								isEmail(recipient)
							)
							: []
					}
					onChange={(_emails) => {
						const emails = _emails.filter((email) =>
							isEmail(email)
						);
						setValue({ recipients: uniq(emails) });
					}}
					validateEmail={(email) => {
						return isEmail(email); // return boolean
					}}
					getLabel={(email, index, removeEmail) => {
						return (
							<div data-tag key={index}>
								{email}
								<span
									data-tag-handle
									onClick={() => removeEmail(index)}
								>
									×
								</span>
							</div>
						);
					}}
				/>
			)}
			{toType === 'field' && (
				<EmailSelect
					isRequired={true}
					emailFields={emailFields}
					value={
						recipients &&
							recipients[0] &&
							recipients[0].length > 0
							? recipients[0]
							: ''
					}
					setValue={(val) => {
						if (
							val &&
							emailFields.some((field) => field.id === val)
						) {
							setValue({
								recipients: [`{{field:${val}}}`],
							});
						} else {
							setValue({ recipients: [] });
						}
					}}
				/>
			)}
			{!isValid &&
				isReviewing &&
				(toType === 'email' ||
					(toType === 'field' && emailFields.length > 0)) && (
					<AlertMessageWrapper type="error">
						Please insert at least one correct email!
					</AlertMessageWrapper>
				)}
		</BaseControl>
	);
};

export default NotificationTo;
