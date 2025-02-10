/**
 * QuillForms Dependencies.
 */
import {
	Button,
	BaseControl,
	ControlLabel,
	ControlWrapper,
} from '@quillforms/admin-components';
import { setForceReload } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { ColorPalette } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { ThreeDots as Loader } from 'react-loader-spinner';
import { isEmpty } from 'lodash';

const Emails = () => {
	const [settings, setSettings] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch('core/notices');

	const setSettingField = (key, value) => {
		setSettings((settings) => {
			return {
				...settings,
				[key]: value,
			};
		});
	};

	useEffect(() => {
		apiFetch({
			path: `/qf/v1/settings?groups=emails`,
			method: 'GET',
		})
			.then((res) => {
				setSettings(res.emails);
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
	return (
		<div className="quillforms-settings-emails-tab">
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
					<BaseControl>
						<ControlWrapper orientation="horizontal">
							<div
								className={css`
									width: 150px;
									display: flex;
									align-items: center;
								` }
							>
								<ControlLabel label="Header Image" />
								{settings.emails_header_image && (
									<img
										src={settings.emails_header_image}
										className={css`
											width: 40px;
											height: 40px;
											objec-fit: cover;
											margin-left: 10px;
										` }
									/>
								)}
							</div>
							<div>
								<MediaUpload
									onSelect={(media) =>
										setSettingField(
											'emails_header_image',
											media.url
										)
									}
									allowedTypes={['image']}
									render={({ open }) => (
										<button
											className="media-upload-btn"
											onClick={open}
										>
											{isEmpty(
												settings.emails_header_image
											)
												? 'Upload Image'
												: 'Replace Image'}
										</button>
									)}
								/>
								{!isEmpty(settings.emails_header_image) && (
									<Button
										isButton
										isDanger
										onClick={() =>
											setSettingField(
												'emails_header_image',
												''
											)
										}
									>
										Remove
									</Button>
								)}
							</div>
						</ControlWrapper>
						<p
							className={css`
								color: #8e8989;
							` }
						>
							Upload or choose a logo to be displayed at the top
							of email notifications. Recommended size is 300x100
							or smaller for best support on all devices.
						</p>
					</BaseControl>
					<BaseControl>
						<ControlWrapper orientation="vertical">
							<ControlLabel label="Background Color" />
							<ColorPalette
								colors={[]}
								value={settings.emails_background_color}
								onChange={(val) => {
									setSettingField(
										'emails_background_color',
										val
									);
								}}
							/>
						</ControlWrapper>
						<p
							className={css`
								color: #8e8989;
							` }
						>
							Customize the background color of the HTML email
							template.
						</p>
					</BaseControl>
					<div
						className={css`
							text-align: left;
							margin-top: 20px;
						` }
					>
						{isSaving ? (
							<Button isLarge isSecondary>
								Saving
							</Button>
						) : (
							<Button isLarge isPrimary onClick={save}>
								Save
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Emails;
