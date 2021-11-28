/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { ToggleControl, Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
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
	const [ settings, setSettings ] = useState( {
		...defaultSettings,
		...ConfigApi.getInitialPayload().payments,
	} );

	const setSetting = ( key, value ) => {
		console.log( key, value );
		setSettings( {
			...settings,
			[ key ]: value,
		} );
	};

	const methods = {
		check: {
			label: 'Direct Bank Deposit',
		},
		stripe: {
			label: 'Stripe',
		},
		paypal: {
			label: 'PayPal',
		},
	};

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
						{ Object.entries( methods ).map( ( [ key, data ] ) => {
							return (
								<CheckboxControl
									label={ methods[ key ].label }
									checked={ !! settings.methods[ key ] }
									onChange={ ( checked ) => {
										const methods = { ...settings.methods };
										if ( checked ) {
											methods[ key ] = {};
										} else {
											delete methods[ key ];
										}
										setSetting( 'methods', methods );
									} }
								/>
							);
						} ) }
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
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PaymentsPage;
