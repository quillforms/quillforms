/**
 * QuillForms Dependencies.
 */
import configApi from '@quillforms/config';
import { Button, TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';

const License = () => {
	const license = configApi.getLicense();

	const [count, setCount] = useState(0); // counter used for force update.
	const [licenseKey, setLicenseKey] = useState('');
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	const activate = () => {
		const data = new FormData();
		data.append('action', 'quillforms_license_activate');
		data.append('_nonce', window['qfAdmin'].license_nonce);
		data.append('license_key', licenseKey?.trim());

		fetch(`${window['qfAdmin'].adminUrl}admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					configApi.setLicense(res.data);
					setCount(count + 1);
					createSuccessNotice(__('✅ License activated successfully', 'quillforms'), {
						type: 'snackbar',
						isDismissible: true,
					});
				} else {
					createErrorNotice(`⛔ ${res.data ?? __('Error', 'quillforms')}`, {
						type: 'snackbar',
						isDismissible: true,
					});
				}
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? __('Error', 'quillforms')}`, {
					type: 'snackbar',
					isDismissible: true,
				});
			});
	};

	const update = () => {
		const data = new FormData();
		data.append('action', 'quillforms_license_update');
		data.append('_nonce', window['qfAdmin'].license_nonce);

		fetch(`${window['qfAdmin'].adminUrl}admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					configApi.setLicense(res.data);
					setCount(count + 1);
					createSuccessNotice(__('✅ License updated', 'quillforms'), {
						type: 'snackbar',
						isDismissible: true,
					});
				} else {
					createErrorNotice(`⛔ ${res.data ?? __('Error', 'quillforms')}`, {
						type: 'snackbar',
						isDismissible: true,
					});
				}
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? __('Error', 'quillforms')}`, {
					type: 'snackbar',
					isDismissible: true,
				});
			});
	};

	const deactivate = () => {
		const data = new FormData();
		data.append('action', 'quillforms_license_deactivate');
		data.append('_nonce', window['qfAdmin'].license_nonce);

		fetch(`${window['qfAdmin'].adminUrl}admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					configApi.setLicense(false);
					setCount(count + 1);
					createSuccessNotice(__('✅ License deactivated', 'quillforms'), {
						type: 'snackbar',
						isDismissible: true,
					});
				} else {
					createErrorNotice(`⛔ ${res.data ?? __('Error', 'quillforms')}`, {
						type: 'snackbar',
						isDismissible: true,
					});
				}
			})
			.catch((err) => {
				createErrorNotice(`⛔ ${err ?? __('Error', 'quillforms')}`, {
					type: 'snackbar',
					isDismissible: true,
				});
			});
	};

	return (
		<div className="quillforms-license-page">
			<h1 className="quillforms-license-page__heading">{__('License', 'quillforms')}</h1>
			<div className="quillforms-license-page__body">
				{license ? (
					<div>
						<table>
							<tbody>
								<tr>
									<td>{__('Status', 'quillforms')}</td>
									<td>
										<span
											className={
												license.status === 'valid'
													? 'quillforms-license-valid'
													: 'quillforms-license-invalid'
											}
										>
											{license.status_label}
										</span>
									</td>
								</tr>
								<tr>
									<td>{__('Plan', 'quillforms')}</td>
									<td>{license.plan_label}</td>
								</tr>
								<tr>
									<td>{__('Expires', 'quillforms')}</td>
									<td>{license.expires}</td>
								</tr>
								<tr>
									<td>{__('Last update', 'quillforms')}</td>
									<td>{license.last_update}</td>
								</tr>
								<tr>
									<td>{__('Last check', 'quillforms')}</td>
									<td>{license.last_check}</td>
								</tr>
							</tbody>
						</table>
						<Button isPrimary onClick={update}>
							{__('Update', 'quillforms')}
						</Button>
						<Button isDanger onClick={deactivate}>
							{__('Deactivate', 'quillforms')}
						</Button>
						{!!Object.values(license.upgrades).length && (
							<div>
								<h3>{__('Upgrades:', 'quillforms')}</h3>
								<ul>
									{Object.values(license.upgrades).map(
										(upgrade, index) => {
											return (
												<li>
													<a
														key={index}
														href={upgrade.url}
														target="_blank"
													>
														{__('Upgrade to', 'quillforms')} {upgrade.plan_label} {__('plan', 'quillforms')}
													</a>
												</li>
											);
										}
									)}
								</ul>
							</div>
						)}
					</div>
				) : (
					<div>
						<TextControl
							label={__('License key', 'quillforms')}
							className={css``}
							onChange={(value) => setLicenseKey(value)}
						/>
						<Button isPrimary onClick={activate}>
							{__('Activate', 'quillforms')}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default License;
