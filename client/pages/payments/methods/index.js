/**
 * QuillForms Dependencies
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import { CheckboxControl } from '@wordpress/components';

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

	return (
		<div>
			{ Object.entries( settings.methods ).map( ( [ key, value ] ) => {
				const [ gateway, method ] = key.split( ':' );
				const data = gateways[ gateway ].methods[ method ];
				return (
					<div key={ key }>
						<CheckboxControl
							label={ data.name }
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
						{ value.enabled && (
							<data.optionsRender
								slug={ gateway }
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
