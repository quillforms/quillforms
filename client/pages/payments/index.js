/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { ToggleControl, Button } from '@quillforms/admin-components';
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import Product from './product';

/**
 * Internal Dependencies
 */
import './style.scss';

const defaultSettings = {
	enabled: false,
	recurring: false,
	required: false,
	methods: { check: {}, stripe: {}, paypal: {} },
	products: [ {} ],
};

const PaymentsPage = ( { params } ) => {
	const formId = params.id;

	const [ settings, setSettings ] = useState( {
		...defaultSettings,
		...ConfigApi.getInitialPayload().payments,
	} );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	const setSetting = ( key, value ) => {
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	const gateways = getPaymentGatewayModules();

	return (
		<div className="quillforms-payments-page">
			<div className="quillforms-payments-page-settings">
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Enable
					</div>
					<ToggleControl
						checked={ settings.enabled }
						onChange={ () =>
							setSetting( 'enabled', ! settings.enabled )
						}
					/>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Recurring
					</div>
					<ToggleControl
						checked={ settings.recurring }
						onChange={ () =>
							setSetting( 'recurring', ! settings.recurring )
						}
					/>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Required
					</div>
					<ToggleControl
						checked={ settings.required }
						onChange={ () =>
							setSetting( 'required', ! settings.required )
						}
					/>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Methods
					</div>
					<div
						className={ css`
							margin-top: 5px;
						` }
					>
						{ Object.entries( gateways ).map(
							( [ key, module ] ) => {
								const enabled = !! settings.methods[ key ]
									?.enabled;
								return (
									<div key={ key }>
										<CheckboxControl
											label={ module.title }
											checked={ enabled }
											onChange={ ( checked ) => {
												const methods = {
													...settings.methods,
												};
												if ( checked ) {
													methods[ key ] = {
														...methods[ key ],
														enabled: true,
													};
												} else {
													methods[
														key
													].enabled = false;
												}
												setSetting(
													'methods',
													methods
												);
											} }
										/>
										{ enabled && (
											<module.optionsRender
												slug={ key }
												options={
													settings.methods[ key ]
														?.options ?? {}
												}
												onOptionsChange={ (
													options
												) => {
													const methods = {
														...settings.methods,
													};
													methods[
														key
													].options = options;
													setSetting(
														'methods',
														methods
													);
												} }
											/>
										) }
									</div>
								);
							}
						) }
					</div>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Products
					</div>
					<div>
						{ settings.products.map( ( product, index ) => (
							<Product
								key={ index }
								data={ product }
								onAdd={ () => {
									const products = [ ...settings.products ];
									products.splice( index + 1, 0, {} );
									setSetting( 'products', products );
								} }
								onRemove={ () => {
									const products = [ ...settings.products ];
									products.splice( index, 1 );
									setSetting( 'products', products );
								} }
								onUpdate={ ( data ) => {
									const products = [ ...settings.products ];
									products[ index ] = data;
									setSetting( 'products', products );
								} }
								removeEnabled={ settings.products.length > 1 }
							/>
						) ) }
					</div>
				</div>
				<div>
					<Button
						className="quillforms-payments-page-settings-save"
						isPrimary
						onClick={ () => {
							apiFetch( {
								path:
									`/wp/v2/quill_forms/${ formId }` +
									`?context=edit&_timestamp=${ Date.now() }`,
								method: 'POST',
								data: {
									payments: settings,
								},
							} )
								.then( () => {
									createSuccessNotice(
										'🚀 Saved successfully!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								} )
								.catch( () => {
									createErrorNotice(
										'⛔ Error while saving!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								} );
						} }
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PaymentsPage;
