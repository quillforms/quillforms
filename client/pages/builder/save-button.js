/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getRestFields } from '@quillforms/rest-fields';
import { getHistory, NavigationPrompt } from '@quillforms/navigation';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import { createPortal, useState, useEffect } from '@wordpress/element';
import { Modal } from '@wordpress/components';

/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import PlaceholderButton from './placeholder-button';
import ConfirmNavigationModal from './confirm-navigation-modal';
import { size } from 'lodash';
import { css } from "emotion";

const SaveButton = ({ formId, isResolving }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [shouldBeSaved, setShouldBeSaved] = useState(false);
	const [displayNotificationsHint, setDisplayNotificationsHint] = useState(false);
	const license = ConfigAPI.getLicense();
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);
	const { restFields } = useSelect((_select) => {
		let restFields = {};
		Object.keys(getRestFields()).forEach((restFieldKey) => {
			restFields[restFieldKey] = getRestFields()[
				restFieldKey
			].selectValue();
		});
		return { restFields };
	});

	const { hasThemesFinishedResolution } = useSelect((select) => {
		const { hasFinishedResolution } = select('quillForms/theme-editor');

		return {
			hasThemesFinishedResolution: hasFinishedResolution(
				'getThemesList'
			),
		};
	});

	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');

	useEffect(() => {
		if (shouldBeSaved) {
			window.onbeforeunload = () => true;
		} else {
			window.onbeforeunload = undefined;
		}

		return () => (window.onbeforeunload = undefined);
	}, [shouldBeSaved]);

	useEffect(() => {
		if (!isResolving && hasThemesFinishedResolution) {
			setShouldBeSaved(true);
		}
	}, [JSON.stringify(restFields)]);

	return (
		<>
			{createPortal(
				<>
					{!isResolving && hasThemesFinishedResolution ? (
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
								isLarge
								className={classnames(
									'qf-builder-save-button',
									{
										disabled: !shouldBeSaved,
									}
								)}
								onClick={() => {
									if (isSaving || !shouldBeSaved) return;
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
											if (license?.status !== 'valid' &&
												size(restFields.notifications) <= 0 &&
												!localStorage.getItem(`qf-display-notifications-hint-${formId}`
												)
											) {
												setDisplayNotificationsHint(true);

											}
											createSuccessNotice(
												'🚀 Saved successfully!',
												{
													type: 'snackbar',
													isDismissible: true,
												}
											);

											setIsSaving(false);
											setShouldBeSaved(false);
										})
										.catch(() => {
											createErrorNotice(
												'⛔ Error while saving!',
												{
													type: 'snackbar',
													isDismissible: true,
												}
											);
											setIsSaving(false);
										});
								}}
							>
								{isSaving ? 'Saving' : 'Publish'}
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
									title="Warning!"
									onRequestClose={() => {
										setDisplayNotificationsHint(false);
									}}
								>
									<div>
										<div>
											You have not added any notifications to this form to receive results.
										</div>
										<br />
									</div>
									<div
										className={css`
										display: flex;
										margin-top: 10px;
										justify-content: center;
									` }
									>

										<Button
											isLarge
											className={css`
											width: auto;
											display: flex;
											justify-content: center;
											align-items: center;
											margin: 0 10px !important;
										` }
											onClick={() => {
												setDisplayNotificationsHint(false);
												setCurrentPanel('notifications');
											}}
											isPrimary
										>
											Let me know how!
										</Button>
										<Button
											isLarge
											className={css`
											width: auto;
											display: flex;
											justify-content: center;
											align-items: center;
										` }
											onClick={() => {
												setDisplayNotificationsHint(false);
												localStorage.setItem(
													`qf-display-notifications-hint-${formId}`,
													'1'
												);
											}}
											isButton
											isSecondary
										>
											Don't show me this message again.
										</Button>
									</div>
								</Modal>
							)}
						</>
					) : (
						<PlaceholderButton />
					)}
				</>,
				document.body
			)}
		</>
	);
};

export default SaveButton;
