/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
} from '@quillforms/admin-components';
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';

const GatewaysOptions = () => {
	const { settings, general, updateGeneral } = usePaymentsContext();

	const gateways = getPaymentGatewayModules();
	const enabled = [];
	for ( const key of Object.keys( general.methods ) ) {
		const gateway = key.split( ':' )[ 0 ];
		if ( ! enabled.includes( gateway ) ) {
			enabled.push( gateway );
		}
	}

	const elements = {};
	for ( const gateway of enabled ) {
		const options = gateways[ gateway ].options ?? null;
		if ( options && options.has( settings ) ) {
			elements[ gateway ] = (
				<options.component
					settings={ settings }
					onChange={ ( value ) => {
						const options = { ...general.options };
						options.gateways[ gateway ] = value;
						updateGeneral( { options } );
					} }
				/>
			);
		}
	}

	if ( Object.keys( elements ).length === 0 ) {
		return null;
	}

	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Gateways Options" />
				<div className="payments-general-gateway-options">
					{ Object.entries( elements ).map(
						( [ gateway, element ] ) => {
							const icon = gateways[ gateway ].icon.full;
							return (
								<BaseControl key={ gateway }>
									<ControlWrapper orientation="vertical">
										<div className="gateway-option-label">
											{ typeof icon === 'string' ? (
												<img src={ icon } />
											) : (
												<IconComponent
													icon={
														icon?.src
															? icon.src
															: icon
													}
												/>
											) }
										</div>
										{ element }
									</ControlWrapper>
								</BaseControl>
							);
						}
					) }
				</div>
			</ControlWrapper>
		</BaseControl>
	);
};

export default GatewaysOptions;
