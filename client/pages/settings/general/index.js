/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies.
 */
import {
	SelectControl,
	BaseControl,
	ControlLabel,
	ControlWrapper,
	ToggleControl,
	TextControl,
	__experimentalFeatureAvailability,
} from '@quillforms/admin-components';
import { setForceReload } from '@quillforms/navigation';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import { ThreeDots as Loader } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import './style.scss';
import CustomButton from '../../../components/custom-button';

const General = () => {
	const [settings, setSettings] = useState(null);
	const [displayProModal, setDisplayProModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const license = ConfigAPI.getLicense();

	const { createErrorNotice, createSuccessNotice } =
		useDispatch('core/notices');

	useEffect(() => {
		apiFetch({
			path: `/qf/v1/settings?groups=general`,
			method: 'GET',
		})
			.then((res) => {
				setSettings(res.general);
			})
			.catch(() => {
				setSettings(false);
			});
	}, []);

	const save = () => {
		setIsSaving(true);
		apiFetch({
			path: `/qf/v1/settings`,
			method: 'POST',
			data: settings,
		})
			.then(() => {
				createSuccessNotice('✅ Settings saved', {
					type: 'snackbar',
					isDismissible: true,
				});
				setIsSaving(false);
				// To reinitialize google maps scripts
				setForceReload(true);
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? 'Error'}`, {
					type: 'snackbar',
					isDismissible: true,
				});
				setIsSaving(false);
			});
	};

	const setSettingField = (key, value) => {
		setSettings((settings) => {
			return {
				...settings,
				[key]: value,
			};
		});
	};

	const logLevelOptions = [
		{
			key: 'notice',
			name: 'Errors',
		},
		{
			key: 'info',
			name: 'Info & Errors',
		},
		{
			key: 'debug',
			name: 'Debug & Info & Errors',
		},
	];

	return (
		<div className="quillforms-settings-general-tab">
			{settings === null ? (
				<div
					className={css`
						display: flex;
						flex-wrap: wrap;
						width: 100%;
						height: 100px;
						justify-content: center;
						align-items: center;
					` }
				>
					<Loader color="#8640e3" height={50} width={50} />
				</div>
			) : !settings ? (
				<div className="error">Cannot load settings</div>
			) : (
				<div>
					{/* 2-column grid of setting cards */}
					<div className="quillforms-settings-general-tab__grid">

						{/* Log level */}
						<div className="quillforms-settings-general-tab__card">
							<span className="quillforms-settings-general-tab__card-label">Log level</span>
							<SelectControl
								className={css`
								.components-custom-select-control__label {
									display: none;
								}
								.components-custom-select-control__button {
									width: auto;
									min-width: 140px;
									padding: 8px 16px;
									border-radius: 16px !important;
									border: 1px solid #D9D9D9 !important;
									background: #fff !important;
									font-size: 14px !important;
									font-weight: 500 !important;
									color: #334155 !important;
									box-shadow: none !important;
									cursor: pointer;
									display: flex;
									align-items: center;
									justify-content: space-between;
									gap: 8px;

									&:focus {
										border-color: #B2328C !important;
										box-shadow: none !important;
									}
								}
							` }
								value={logLevelOptions.find(
									(option) =>
										option.key === settings.log_level
								)}
								onChange={(selectedChoice) => {
									setSettingField(
										'log_level',
										selectedChoice.selectedItem.key
									);
								}}
								options={logLevelOptions}
							/>
						</div>

						{/* Override quillforms slug */}
						<div className="quillforms-settings-general-tab__card">
							<span className="quillforms-settings-general-tab__card-label">Override 'quillforms' slug in the url</span>
							<ToggleControl
								checked={settings?.override_quillforms_slug}
								onChange={() => {
									if (license?.status !== 'valid') {
										setDisplayProModal(true);
									} else {
										setSettingField(
											'override_quillforms_slug',
											!settings?.override_quillforms_slug
										);
									}
								}}
							/>
						</div>

						{/* New slug input (only when override is on) */}
						{settings?.override_quillforms_slug && license?.status === 'valid' && (
							<div className="quillforms-settings-general-tab__card quillforms-settings-general-tab__card--full">
								<span className="quillforms-settings-general-tab__card-label">Your New Slug</span>
								<TextControl
									value={settings?.quillforms_slug}
									onChange={(val) => {
										setSettingField('quillforms_slug', val.trim());
									}}
								/>
								<p className={css`color: #8e8989; margin-top: 8px; font-size: 13px;`}>
									Please don't leave empty
								</p>
							</div>
						)}

						{/* Disable indexing */}
						<div className="quillforms-settings-general-tab__card">
							<span className="quillforms-settings-general-tab__card-label">Disable Indexing for your forms</span>
							<ToggleControl
								checked={settings?.disable_indexing}
								onChange={() => {
									setSettingField(
										'disable_indexing',
										!settings?.disable_indexing
									);
								}}
							/>
						</div>

						{/* Sync entry process */}
						<div className="quillforms-settings-general-tab__card">
							<span className="quillforms-settings-general-tab__card-label">Process form entry for integrations synchronously</span>
							<ToggleControl
								checked={settings?.providers_sync_entry_process}
								onChange={() => {
									setSettingField(
										'providers_sync_entry_process',
										!settings?.providers_sync_entry_process
									);
								}}
							/>
						</div>

						{/* Disable collecting user ip */}
						<div className="quillforms-settings-general-tab__card">
							<span className="quillforms-settings-general-tab__card-label">Disable collecting user ip</span>
							<ToggleControl
								checked={settings.disable_collecting_user_ip}
								onChange={() => {
									setSettingField(
										'disable_collecting_user_ip',
										!settings.disable_collecting_user_ip
									);
								}}
							/>
						</div>

						{/* Disable collecting user agent */}
						<div className="quillforms-settings-general-tab__card">
							<span className="quillforms-settings-general-tab__card-label">Disable collecting user agent</span>
							<ToggleControl
								checked={settings.disable_collecting_user_agent}
								onChange={() => {
									setSettingField(
										'disable_collecting_user_agent',
										!settings.disable_collecting_user_agent
									);
								}}
							/>
						</div>

					</div>

					{/* Save button */}
					<div className="quillforms-settings-general-tab__footer">
						<CustomButton
							variant="primary"
							text={isSaving ? 'Saving...' : 'Save Changes'}
							onClick={save}
							disabled={isSaving}
							className="!border-0 !border-none !py-3 !px-8"
						/>
					</div>

					{/* Pro modal */}
					{displayProModal && (
						<Modal
							className={classnames(
								css`
									border: none !important;
									border-radius: 9px;

									.components-modal__header {
										background: linear-gradient(
											42deg,
											rgb( 235 54 221 ),
											rgb( 238 142 22 )
										);
										h1 {
											color: #fff;
										}
										svg {
											fill: #fff;
										}
									}
									.components-modal__content {
										text-align: center;
									}
								`
							)}
							title="Overwrite quillforms slug is a pro feature"
							onRequestClose={() => {
								setDisplayProModal(false);
							}}
						>
							<__experimentalFeatureAvailability
								featureName="Override quillforms slug"
								planKey="basic"
								showLockIcon={true}
							/>
						</Modal>
					)}
				</div>
			)}
		</div>
	);
};

export default General;
