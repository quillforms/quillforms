/**
 * QuillForms Dependencies
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import { CheckboxControl, Button } from '@wordpress/components';
import { Icon as IconComponent } from '@wordpress/components';

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
				const data = gateways[ gateway ].methods[ method ];

				// check recurring support.
				if ( recurringEnabled && ! data.isRecurringSupported ) {
					return null;
				}

				return (
					<div key={ key }>
						<CheckboxControl
							label={
								<div className="quillforms-payments-page-method-label">
									{ typeof data.admin.label.icon ===
									'string' ? (
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
									{ data.admin.label.notice ?? null }
									<Button
										onClick={ () => reorder( index, 'up' ) }
										disabled={ index === 0 }
									>
										↑
									</Button>
									<Button
										onClick={ () =>
											reorder( index, 'down' )
										}
										disabled={
											index === methodsEntries.length - 1
										}
									>
										↓
									</Button>
								</div>
							}
							checked={ value.enabled ?? false }
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
						{ value.enabled && data.admin.options && (
							<data.admin.options
								slug={ key }
								options={ value.options ?? {} }
								onOptionsChange={ ( options ) => {
									const methods = { ...settings.methods };
									methods[ key ].options = options;
									onChange( methods );
								} }
							/>
						) }
					</div>
				);
			} ) }
		</div>
	);
};

export default Methods;
