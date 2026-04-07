/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
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
import LogicConditionIcon from '../icons/logic-condition';
import LogicCondition from '../logic-condition';

const NotificationEditorWrapper = ({
	goBack,
	onSuccess,
	currentNotificationProperties,
	notificationId,
	activeSlide,
	isActive,
	isAnimating,
}) => {
	const [properties, setProperties] = useState({
		...currentNotificationProperties,
	});

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
				<div className="notifications-editor-notification-editor-wrapper__heading-container">
					<h4 className="notifications-editor-notification-editor-wrapper__heading">
						{notificationId
							? __('Edit Notification', 'quillforms')
							: __('Create a new notification', 'quillforms')}
					</h4>
					<BaseControl>
						<ControlWrapper>
							<ToggleControl
								checked={active}
								onChange={() => {
									setProperties((prevProperties) => ({
										...prevProperties,
										active: !active,
									}));
								}}
							/>
							<p className="notifications-editor-notification-editor-wrapper__active-label"> {__(`${active ? 'Active' : 'Inactive'}`, 'quillforms')} </p>
						</ControlWrapper>
					</BaseControl>
				</div>
				<div className="notifications-editor-notification-editor-wrapper__content">
					<NotificationTitle
						value={title}
						setValue={(value) => {
							setProperties((prevProperties) => ({
								...prevProperties,
								...value,
							}));
						}}
					/>

					<div className="notifications-editor-notification-editor-wrapper__to-row">
						<div className="notifications-editor-notification-editor-wrapper__to-card">
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
						</div>
						<div className="notifications-editor-notification-editor-wrapper__to-card">
							<BaseControl>
								<ControlWrapper orientation="vertical">
									<ControlLabel label={__('Reply to', 'quillforms')} />
									<RadioControl
										className="notifications-editor-reply-to-radio"
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
									<div
										className={css`
										${replyTo &&
											isEmail(replyTo) &&
											`.react-multi-email input { display: none !important;}`}
									`}
									>
										<ReactMultiEmail
											className="notifications-editor-multi-email-control"
											placeholder="Type an email then hit a space"
											emails={replyTo ? [replyTo] : []}
											enable={() => {
												return {
													emailCnt: 1,
												};
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
						</div>
					</div>

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
					{activeSlide === 1 && (
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
				</div>
				<div className="notifications-editor-notification-editor-wrapper__logic-outside">
					<BaseControl>
						<div
							className={classnames(
								'notifications-editor-notification-editor-wrapper__logic-condition-sheet',
								{
									'is-expanded': !!conditions,
								}
							)}
						>
							<div className="notifications-editor-notification-editor-wrapper__logic-condition-row">
								<div className="notifications-editor-notification-editor-wrapper__logic-condition-start">
									<LogicConditionIcon width={24} height={24} />
									<ControlLabel
										label={__(
											'Conditional Logic',
											'quillforms'
										)}
									/>
								</div>
								<ToggleControl
									className="notifications-editor-notification-editor-wrapper__logic-condition-toggle"
									checked={!!conditions}
									onChange={() => {
										setProperties((prevProperties) => ({
											...prevProperties,
											conditions: conditions
												? undefined
												: [],
										}));
									}}
								/>
							</div>
							{!!conditions && (
								<>
									<div className="notifications-editor-notification-editor-wrapper__logic-condition-panel">
										<LogicCondition
											value={conditions}
											onChange={(value) =>
												setProperties((prevProperties) => ({
													...prevProperties,
													conditions: value,
												}))
											}
											combobox={{
												excerptLength: 30,
											}}
										/>
									</div>
								</>
							)}
						</div>
					</BaseControl>
				</div>
				{isActive && (
			<NotificationEditorFooter
					isReviewing={isReviewing}
					setIsReviewing={setIsReviewing}
					goBack={goBack}
					onSuccess={onSuccess}
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
