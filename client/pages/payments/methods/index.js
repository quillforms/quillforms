/**
 * QuillForms Dependencies
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';
import {
	BaseControl,
	ToggleControl,
	ControlWrapper,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { CheckboxControl, Button } from '@wordpress/components';
import { Icon as IconComponent } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import './style.scss';

const Methods = ( { settings, onChange } ) => {
	const gateways = getPaymentGatewayModules();

	// add new methods below
	for ( const [ gateway, data ] of Object.entries( gateways ) ) {
		for ( const method of Object.keys( data.methods ) ) {
			const key = `${ gateway }:${ method }`;
			if ( ! settings.methods[ key ] ) {
				settings.methods[ key ] = { enabled: false };
			}
		}
	}

	const recurringEnabled = !! settings.recurring?.enabled;
	const methodsEntries = Object.entries( settings.methods );
	const availableMethods = methodsEntries.reduce(
		( result, [ key, value ] ) => {
			const [ gateway, method ] = key.split( ':' );
			const data = gateways[ gateway ].methods[ method ];
			if ( ! ( recurringEnabled && ! data.isRecurringSupported ) ) {
				result.push( key );
			}
			return result;
		},
		[]
	);

	// when recurring is enabled, disable the unavailable methods and move them to the end.
	useEffect( () => {
		if ( settings.recurring.enabled ) {
			// console.log( 'Recurring enabled, and should check order?' );
			const available = [];
			const unavailable = [];
			for ( const [ key, value ] of methodsEntries ) {
				if ( availableMethods.includes( key ) ) {
					available.push( [ key, value ] );
				} else {
					value.enabled = false;
					unavailable.push( [ key, value ] );
				}
			}
			const all = [ ...available, ...unavailable ];
			onChange( Object.fromEntries( all ) );
		}
	}, [ settings.recurring.enabled ] );

	const reorder = ( index, action ) => {
		const toIndex = index + ( action === 'up' ? -1 : 1 );
		const item = methodsEntries[ index ];
		methodsEntries[ index ] = methodsEntries[ toIndex ];
		methodsEntries[ toIndex ] = item;
		onChange( Object.fromEntries( methodsEntries ) );
	};

	return (
		<div>
			{ methodsEntries.map( ( [ key, value ], index ) => {
				const [ gateway, method ] = key.split( ':' );
				const active = gateways[ gateway ].active;
				const data = gateways[ gateway ].methods[ method ];

				// check if not available.
				const indexOfAvailable = availableMethods.indexOf( key );
				if ( indexOfAvailable === -1 ) {
					return null;
				}

				return (
					<BaseControl key={ key }>
						<ControlWrapper orientation="horizontal">
							<div className="quillforms-payments-page-method-label">
								{ typeof data.admin.label.icon === 'string' ? (
									<img src={ data.admin.label.icon } />
								) : (
									<IconComponent
										icon={
											data.admin.label.icon?.src
												? data.admin.label.icon.src
												: data.admin.label.icon
										}
									/>
								) }
								{ data.admin.label.text }
								{ data.admin.label.notice ? (
									<data.admin.label.notice slug={ gateway } />
								) : null }
								<Button
									onClick={ () => reorder( index, 'up' ) }
									disabled={ index === 0 }
								>
									↑
								</Button>
								<Button
									onClick={ () => reorder( index, 'down' ) }
									disabled={
										indexOfAvailable ===
										availableMethods.length - 1
									}
								>
									↓
								</Button>
							</div>
							<ToggleControl
								checked={ active && ( value.enabled ?? false ) }
								disabled={ ! active }
								onChange={ ( checked ) => {
									const methods = { ...settings.methods };
									if ( checked ) {
										methods[ key ] = {
											...methods[ key ],
											enabled: true,
										};
									} else {
										methods[ key ].enabled = false;
									}
									onChange( methods );
								} }
							/>
						</ControlWrapper>
						{ value.enabled && data.admin.options && (
							<data.admin.options
								slug={ key }
								settings={ settings }
								onOptionsChange={ ( options ) => {
									const methods = { ...settings.methods };
									methods[ key ].options = options;
									onChange( methods );
								} }
							/>
						) }
					</BaseControl>
				);
			} ) }
		</div>
	);
};

export default Methods;
