/**
 * QuillForms Dependencies
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import { RadioControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */

interface Props {
	data: any;
}

const PaymentModal: React.FC< Props > = ( { data } ) => {
	const { setPaymentData, completeForm } = useDispatch(
		'quillForms/renderer-core'
	);

	const gateways = getPaymentGatewayModules();
	const methodsKeys = Object.keys( data.methods );

	const options = methodsKeys.map( ( key ) => {
		const [ gateway, method ] = key.split( ':' );
		return {
			label: gateways[ gateway ].methods[ method ].name,
			value: key,
		};
	} );

	const [ selected, setSelected ] = useState( methodsKeys[ 0 ] );
	const [ gateway, method ] = selected.split( ':' );

	const CientRender = gateways[ gateway ].methods[ method ].clientRender;

	return (
		<div className="renderer-core-payment-modal">
			<RadioControl
				label="Select payment method"
				selected={ selected }
				options={ options }
				onChange={ setSelected }
			/>
			<CientRender
				slug={ selected }
				data={ data }
				onComplete={ () => {
					setPaymentData( null );
					completeForm();
				} }
			/>
		</div>
	);
};

export default PaymentModal;
