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
 * Internal Dependencies
 */
import './style.scss';
import CustomButton from '../../components/custom-button';

const License = () => {
	const license = configApi.getLicense();

	const [count, setCount] = useState(0);
	const [licenseKey, setLicenseKey] = useState('');
	const { createErrorNotice, createSuccessNotice } = useDispatch('core/notices');

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
			<h1>{__('License', 'quillforms')}</h1>
			<div className="quillforms-license-page__body">
				<div className="quillforms-license-card">
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
							<div className="license-actions-buttons">
								<CustomButton
									variant="primary"
									text={__('Update', 'quillforms')}
									onClick={update}
								/>
								<CustomButton
									variant="danger"
									text={__('Deactivate', 'quillforms')}
									onClick={deactivate}
								/>
							</div>
							{!!Object.values(license.upgrades).length && (
								<div>
									<h3>{__('Upgrades:', 'quillforms')}</h3>
									<ul>
										{Object.values(license.upgrades).map((upgrade, index) => (
											<li>
												<a key={index} href={upgrade.url} target="_blank">
													{__('Upgrade to', 'quillforms')} {upgrade.plan_label}{' '}
													{__('plan', 'quillforms')}
												</a>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					) : (
						<div>
							<div className="license-input-wrapper">
								<TextControl
									label={__('License key', 'quillforms')}
									onChange={(value) => setLicenseKey(value)}
									placeholder={__('License key', 'quillforms')}
									style={{ borderRadius: '16px', padding: '16px !important' }}
								/>
							</div>
						</div>
					)}
				</div>
				{!license && (
					<div className="license-button-wrapper">
						<CustomButton
							variant="primary"
							text={__('Activate', 'quillforms')}
							onClick={activate}
							disabled={!licenseKey || licenseKey.trim() === ''}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default License;
