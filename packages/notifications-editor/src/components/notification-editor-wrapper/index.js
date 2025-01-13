/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	LogicConditions,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from 'react';
import { RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { keys, zipObject } from 'lodash';
import classnames from 'classnames';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { css } from "emotion";

/**
 * Internal Dependencies
 */
import EmailSelect from '../email-select';
import NotificationMessage from '../notification-message';
import NotificationSubject from '../notification-subject';
import NotificationEditorFooter from '../notification-editor-footer';
import NotificationTitle from '../notification-title';
import NotificationTo from '../notification-to';

const NotificationEditorWrapper = ({
	goBack,
	currentNotificationProperties,
	notificationId,
	activeSlide,
	isActive,
	isAnimating,
}) => {
	const [properties, setProperties] = useState({
		...currentNotificationProperties,
	});

	const [isFormActive, setIsFormActive] = useState(false);
	const [isReviewing, setIsReviewing] = useState(false);

	const [validationFlags, setValidationFlags] = useState(
		zipObject(
			keys({ ...properties }),
			keys({ ...properties }).map(() => true)
		)
	);

	useEffect(() => {
		if (currentNotificationProperties) {
			setProperties({ ...currentNotificationProperties });
		}
		setIsReviewing(false);
		if (activeSlide === 1) {
			setIsFormActive(true);
		} else {
			setIsFormActive(false);
		}
	}, [activeSlide]);

	const {
		active,
		title,
		toType,
		recipients,
		replyToType = 'field',
		replyTo,
		subject,
		message,
		conditions,
	} = properties;

	const { emailFields } = useSelect((select) => {
		return {
			emailFields: select('quillForms/block-editor')
				.getAllBlocks()
				.filter((field) => field.name === 'email'),
		};
	});

	// we need to have a radio control for replyToType with email and field options. 
	// if email is selected, we need to show a text control to enter the email.
	// if field is selected, we need to show a select control with all email fields.
	// use RadioControl from "@wordpress/components"
	return (
		<div
			className={classnames(
				'notifications-editor-notification-editor-wrapper',
				{
					active: isActive,
					'is-animating': isAnimating,
				}
			)}
		>
			<>
				<h4 className="notifications-editor-notification-editor-wrapper__heading">
					{notificationId
						? __('Edit Notification', 'quillforms')
						: __('Create a new notification', 'quillforms')}
				</h4>
				<NotificationTitle
					value={title}
					setValue={(value) => {
						setProperties((prevProperties) => ({
							...prevProperties,
							...value,
						}));
					}}
				/>
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={__('Active', 'quillforms')} />
						<ToggleControl
							checked={active}
							onChange={() => {
								setProperties((prevProperties) => ({
									...prevProperties,
									active: !active,
								}));
							}}
						/>
					</ControlWrapper>
				</BaseControl>
				<NotificationTo
					emailFields={emailFields}
					recipients={recipients}
					toType={toType}
					isValid={{ ...validationFlags }.recipients}
					setIsValid={(value) => {
						setValidationFlags((prevFlags) => ({
							...prevFlags,
							recipients: value,
						}));
					}}
					setValue={(value) => {
						setProperties((prevProperties) => ({
							...prevProperties,
							...value,
						}));
					}}
					isReviewing={isReviewing}
				/>
				<BaseControl>
					<ControlWrapper orientation='vertical'>
						<ControlLabel label={__('Reply to', 'quillforms')} />
						<RadioControl
							selected={replyToType}
							options={[
								{
									label: __('Email', 'quillforms'),
									value: 'email',
								},
								{
									label: __('Field', 'quillforms'),
									value: 'field',
								},
							]}
							onChange={(val) => {
								setProperties((prevProperties) => ({
									...prevProperties,
									replyToType: val,
								}));
							}}
						/>
					</ControlWrapper>
					{replyToType === 'email' && (
						<div className={css`
							${replyTo && isEmail(replyTo) && `.react-multi-email input { display: none !important;}`}
					   `}>
							<ReactMultiEmail
								placeholder="Enter email"
								emails={replyTo ? [replyTo] : []}
								// max 1 email
								// please see the ts for enable
								enable={() => {
									return {
										emailCnt: 1
									}
								}}

								onChange={(val) => {
									if (val.length > 0) {
										setProperties((prevProperties) => ({
											...prevProperties,
											replyTo: val[0],
										}));
									} else {
										setProperties((prevProperties) => ({
											...prevProperties,
											replyTo: '',
										}));
									}

									// setValidationFlags((prevFlags) => ({
									// 	...prevFlags,
									// 	replyTo: val.length > 0,
									// }));
								}}
								validateEmail={(email) => {
									if (isEmail(email)) {
										return true;
									}
									return false;
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
						</div>
					)}
					{replyToType === 'field' && (
						<EmailSelect
							emailFields={emailFields}
							value={replyTo}
							setValue={(val) =>
								setProperties((prevProperties) => ({
									...prevProperties,
									replyTo: `{{field:${val}}}`,
								}))
							}
						/>
					)}
				</BaseControl>

				<NotificationSubject
					value={subject}
					setValue={(val) => {
						setProperties((prevProperties) => ({
							...prevProperties,
							subject: val,
						}));
					}}
					isValid={{ ...validationFlags }.subject}
					setIsValid={(val) => {
						setValidationFlags((prevValidationFlags) => ({
							...prevValidationFlags,
							subject: val,
						}));
					}}
					isReviewing={isReviewing}
				/>
				{isFormActive && (
					<NotificationMessage
						value={message}
						setValue={(val) => {
							setProperties((prevProperties) => ({
								...prevProperties,
								message: val,
							}));
						}}
						isValid={{ ...validationFlags }.message}
						setIsValid={(value) => {
							setValidationFlags((prevFlags) => {
								const $flags = { ...prevFlags, message: value };
								return $flags;
							});
						}}
						isReviewing={isReviewing}
					/>
				)}
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label={__('Conditional Logic', 'quillforms')} />
						<ToggleControl
							checked={!!conditions}
							onChange={() => {
								setProperties((prevProperties) => ({
									...prevProperties,
									conditions: conditions ? undefined : [],
								}));
							}}
						/>
					</ControlWrapper>
					{!!conditions && (
						<div>
							<div>
								{__('Process this notification if the following conditions are met:', 'quillforms')}
							</div>
							<LogicConditions
								value={conditions}
								onChange={(value) =>
									setProperties((prevProperties) => ({
										...prevProperties,
										conditions: value,
									}))
								}
							/>
						</div>
					)}
				</BaseControl>
				{isActive && (
					<NotificationEditorFooter
						isReviewing={isReviewing}
						setIsReviewing={setIsReviewing}
						goBack={goBack}
						notificationId={notificationId}
						properties={{ ...properties }}
						validationFlags={{ ...validationFlags }}
					/>
				)}
			</>
		</div>
	);
};

export default NotificationEditorWrapper;
