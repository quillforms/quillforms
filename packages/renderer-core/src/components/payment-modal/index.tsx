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
	const methodsKeys = Object.keys( data.payments.methods );

	const options = methodsKeys.map( ( key ) => {
		const [ gateway, method ] = key.split( ':' );
		return {
			label: gateways[ gateway ].methods[ method ].customer.label.text,
			value: key,
		};
	} );

	const urlParams = new URLSearchParams( window.location.search );
	let defaultMethod = methodsKeys[ 0 ];
	if (
		urlParams.get( 'step' ) === 'payment' &&
		methodsKeys.includes( urlParams.get( 'method' ) ?? '' )
	) {
		defaultMethod = urlParams.get( 'method' ) ?? '';
	}

	const [ selected, setSelected ] = useState( defaultMethod );
	const [ gateway, method ] = selected.split( ':' );

	const CustomerRender =
		gateways[ gateway ].methods[ method ].customer.render;

	return (
		<div className="renderer-core-payment-modal">
			<div>
				{ data.payments.products.items.map( ( item, index ) => {
					return (
						<div key={ index }>
							{ item.name }: { item.value }
						</div>
					);
				} ) }
				<div>Total: { data.payments.products.total }</div>
				<div>
					{ data.payments.recurring
						? `Paid every ${ data.payments.recurring.interval_count } ${ data.payments.recurring.interval_unit }/s`
						: 'Paid one-time' }
				</div>
			</div>
			<hr />
			<RadioControl
				label="Select payment method"
				selected={ selected }
				options={ options }
				onChange={ setSelected }
			/>
			<CustomerRender
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
