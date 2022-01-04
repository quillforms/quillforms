/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import {
	ToggleControl,
	TextControl,
	SelectControl,
	Button,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import Product from './product';

/**
 * Internal Dependencies
 */
import './style.scss';
import Methods from './methods';
import FieldSelect from './field-select';

const randomId = () => {
	return Math.random().toString( 36 ).substring( 2, 8 );
};

const defaultSettings = {
	enabled: false,
	recurring: { enabled: false, interval_count: 1, interval_unit: 'month' },
	currency: { code: 'USD', symbol_pos: 'left' },
	methods: {},
	customer: {
		name: { type: 'field', value: '' },
		email: { type: 'field', value: '' },
	},
	products: {
		[ randomId() ]: {},
	},
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

	const recurringIntervalUnitOptions = [
		{
			name: __( 'Day/s', 'quillforms' ),
			key: 'day',
		},
		{
			name: __( 'Week/s', 'quillforms' ),
			key: 'week',
		},
		{
			name: __( 'Month/s', 'quillforms' ),
			key: 'month',
		},
		{
			name: __( 'Year/s', 'quillforms' ),
			key: 'year',
		},
	];

	const recurringIntervalCountMax = {
		day: 365,
		week: 52,
		month: 12,
		year: 10,
	};

	const Currencies = ConfigApi.getCurrencies();

	const currencyOptions = [];
	for ( const [ key, currency ] of Object.entries( Currencies ) ) {
		currencyOptions.push( {
			key,
			name: currency.name,
		} );
	}

	const currencySymbol = Currencies[ settings.currency.code ].symbol;
	const currencySymbolPosOptions = [
		{
			key: 'left',
			name: `${ currencySymbol }10`,
		},
		{
			key: 'left_space',
			name: `${ currencySymbol } 10`,
		},
		{
			key: 'right',
			name: `10${ currencySymbol }`,
		},
		{
			key: 'right_space',
			name: `10 ${ currencySymbol }`,
		},
	];

	const productsItems = Object.entries( settings.products ).map(
		( [ id, product ], index ) => (
			<Product
				key={ id }
				data={ product }
				onAdd={ () => {
					const products = Object.entries( settings.products );
					products.splice( index + 1, 0, [ randomId(), {} ] );
					setSetting( 'products', Object.fromEntries( products ) );
				} }
				onRemove={ () => {
					const products = { ...settings.products };
					delete products[ id ];
					setSetting( 'products', products );
				} }
				onUpdate={ ( data ) => {
					const products = { ...settings.products };
					products[ id ] = data;
					setSetting( 'products', products );
				} }
				removeEnabled={ Object.entries( settings.products ).length > 1 }
			/>
		)
	);

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
					<div>
						<ToggleControl
							checked={ settings.recurring.enabled }
							onChange={ () =>
								setSetting( 'recurring', {
									...settings.recurring,
									enabled: ! settings.recurring.enabled,
								} )
							}
						/>
						{ settings.recurring.enabled && (
							<>
								<TextControl
									type="number"
									value={
										settings.recurring.interval_count ?? ''
									}
									onChange={ ( value ) =>
										setSetting( 'recurring', {
											...settings.recurring,
											interval_count: value,
										} )
									}
									step={ 1 }
									min={ 1 }
									max={
										recurringIntervalCountMax[
											settings.recurring.interval_unit
										]
									}
								/>
								<SelectControl
									options={ recurringIntervalUnitOptions }
									value={ recurringIntervalUnitOptions.find(
										( option ) =>
											option.key ===
											settings.recurring.interval_unit
									) }
									onChange={ ( { selectedItem } ) => {
										if ( selectedItem ) {
											let interval_unit =
												selectedItem.key;
											let interval_count = Math.min(
												settings.recurring
													.interval_count,
												recurringIntervalCountMax[
													interval_unit
												]
											);
											setSetting( 'recurring', {
												...settings.recurring,
												interval_unit,
												interval_count,
											} );
										}
									} }
								/>
							</>
						) }
					</div>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Currency
					</div>
					<div
						className={ css`
							display: flex;
							align-items: center;
						` }
					>
						<SelectControl
							className={ css`
								width: 225px;
								margin-right: 1rem;
								.components-custom-select-control__label {
									margin-bottom: 0;
								}
								.components-base-control__field {
									margin-bottom: 0;
								}
								.components-text-control__input {
									margin: 0;
								}
							` }
							options={ currencyOptions }
							value={ currencyOptions.find(
								( option ) =>
									option.key === settings.currency.code
							) }
							onChange={ ( { selectedItem } ) => {
								if ( selectedItem ) {
									setSetting( 'currency', {
										...settings.currency,
										code: selectedItem.key,
										symbol_pos:
											Currencies[ selectedItem.key ]
												.symbol_pos,
									} );
								}
							} }
						/>
						<div>Format:</div>
						<SelectControl
							className={ css`
								margin-left: 0.25rem;
								.components-custom-select-control__label {
									margin-bottom: 0;
								}
								.components-base-control__field {
									margin-bottom: 0;
								}
								.components-text-control__input {
									margin: 0;
								}
							` }
							options={ currencySymbolPosOptions }
							value={
								currencySymbolPosOptions.find(
									( option ) =>
										option.key ===
										settings.currency.symbol_pos
								) ?? currencySymbolPosOptions[ 0 ]
							}
							onChange={ ( { selectedItem } ) => {
								if ( selectedItem ) {
									setSetting( 'currency', {
										...settings.currency,
										symbol_pos: selectedItem.key,
									} );
								}
							} }
						/>
					</div>
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
						<Methods
							settings={ settings }
							onChange={ ( methods ) => {
								setSetting( 'methods', methods );
							} }
						/>
					</div>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Customer
					</div>
					<div>
						<FieldSelect
							label="Name"
							blockNames={ [ 'short-text', 'long-text' ] }
							value={ settings.customer?.name?.value ?? '' }
							onChange={ ( value ) => {
								setSetting( 'customer', {
									...settings.customer,
									name: { type: 'field', value },
								} );
							} }
						/>
						<FieldSelect
							label="Email"
							blockNames={ [ 'email' ] }
							value={ settings.customer?.email?.value ?? '' }
							onChange={ ( value ) => {
								setSetting( 'customer', {
									...settings.customer,
									email: { type: 'field', value },
								} );
							} }
						/>
					</div>
				</div>
				<div className="quillforms-payments-page-settings-row">
					<div className="quillforms-payments-page-settings-row-label">
						Products
					</div>
					<div>{ productsItems }</div>
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
