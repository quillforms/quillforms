/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getRestFields } from '@quillforms/rest-fields';
import { NavigationPrompt } from '@quillforms/navigation';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ConfirmNavigationModal from './confirm-navigation-modal';
import { size } from 'lodash';
import { css } from 'emotion';
 
const SaveButton = ({ formId, isResolving }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [shouldBeSaved, setShouldBeSaved] = useState(false);
	/** Serialized rest fields that match last save (or initial load) — only warn when current data differs. */
	const cleanSnapshotRef = useRef(null);
	const restFieldsRef = useRef(null);
	const [displayNotificationsHint, setDisplayNotificationsHint] =
		useState(false);
	const license = ConfigAPI.getLicense();
	const { createErrorNotice, createSuccessNotice } =
		useDispatch('core/notices');
	const { restFields } = useSelect((_select) => {
		let restFields = {};
		Object.keys(getRestFields()).forEach((restFieldKey) => {
			restFields[restFieldKey] =
				getRestFields()[restFieldKey].selectValue();
		});
		return { restFields };
	});
	restFieldsRef.current = restFields;
	const restFieldsSerialized = JSON.stringify(restFields);

	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');

	useEffect(() => {
		if (shouldBeSaved) {
			window.onbeforeunload = () => true;
		} else {
			window.onbeforeunload = undefined;
		}

		return () => (window.onbeforeunload = undefined);
	}, [shouldBeSaved]);

	// Leave-page warning only when data differs from last clean snapshot (load or successful save).
	useEffect(() => {
		if (isResolving) {
			cleanSnapshotRef.current = null;
			setShouldBeSaved(false);
			return;
		}
		if (cleanSnapshotRef.current === null) {
			cleanSnapshotRef.current = restFieldsSerialized;
			setShouldBeSaved(false);
			return;
		}
		setShouldBeSaved(restFieldsSerialized !== cleanSnapshotRef.current);
	}, [isResolving, restFieldsSerialized]);

	return (
		<>
			<NavigationPrompt when={shouldBeSaved}>
				{({ onConfirm, onCancel }) => (
					<ConfirmNavigationModal
						onCancel={onCancel}
						onConfirm={onConfirm}
					/>
				)}
			</NavigationPrompt>
			<Button
				isPrimary={true}
				className="qf-builder-save-button"
				disabled={
					isResolving || isSaving || !shouldBeSaved
				}
				onClick={() => {
					if (isResolving || isSaving || !shouldBeSaved) return;
					setIsSaving(true);

					apiFetch({
						// Timestamp arg allows caller to bypass browser caching, which is
						// expected for this specific function.
						path:
							`/wp/v2/quill_forms/${formId}` +
							`?context=edit&_timestamp=${Date.now()}`,
						method: 'POST',
						data: {
							...restFields,
							status: 'publish',
						},
					})
						.then(() => {
							if (
								license?.status !== 'valid' &&
								size(restFields.notifications) <= 0 &&
								!localStorage.getItem(
									`qf-display-notifications-hint-${formId}`
								)
							) {
								setDisplayNotificationsHint(true);
							}
							createSuccessNotice(
								__('🚀 Saved successfully!', 'quillforms'),
								{
									type: 'snackbar',
									isDismissible: true,
								}
							);

							setIsSaving(false);
							cleanSnapshotRef.current =
								JSON.stringify(restFieldsRef.current);
							setShouldBeSaved(false);
						})
						.catch(() => {
							createErrorNotice(
								__('⛔ Error while saving!', 'quillforms'),
								{
									type: 'snackbar',
									isDismissible: true,
								}
							);
							setIsSaving(false);
						});
				}}
			>
				{isSaving
					? __('Saving', 'quillforms')
					: __('Save', 'quillforms')}
			</Button>
							{displayNotificationsHint && (
								<Modal
									className={classnames(
										'saving-alert-modal',
										css`
											border: none !important;
											min-width: 420px !important;
											max-width: 470px !important;
											border-radius: 10px;
											z-index: 1111111;
										`
									)}
									// Because focus on editor is causing the click handler to be triggered
									shouldCloseOnClickOutside={false}
									title={__('Warning!', 'quillforms')}
									onRequestClose={() => {
										setDisplayNotificationsHint(false);
									}}
								>
									<div>
										<div>
											{__(
												'You have not added any notifications to this form to receive results.',
												'quillforms'
											)}
										</div>
										<br />
									</div>
									<div
										className={css`
											display: flex;
											margin-top: 10px;
											justify-content: center;
										`}
									>
										<Button
											isLarge
											className={css`
												width: auto;
												display: flex;
												justify-content: center;
												align-items: center;
												margin: 0 10px !important;
											`}
											onClick={() => {
												setDisplayNotificationsHint(
													false
												);
												setCurrentPanel(
													'notifications'
												);
											}}
											isPrimary
										>
											{__(
												'Let me know how!',
												'quillforms'
											)}
										</Button>
										<Button
											isLarge
											className={css`
												width: auto;
												display: flex;
												justify-content: center;
												align-items: center;
											`}
											onClick={() => {
												setDisplayNotificationsHint(
													false
												);
												localStorage.setItem(
													`qf-display-notifications-hint-${formId}`,
													'1'
												);
											}}
											isButton
											isSecondary
										>
											{__(
												"Don't show me this message again.",
												'quillforms'
											)}
										</Button>
									</div>
								</Modal>
							)}
		</>
	);
};

export default SaveButton;
