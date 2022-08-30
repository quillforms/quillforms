/**
 * QuillForms Dependencies
 */
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import RadioControl from './radio-control';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';
import useGeneralTheme from '../../../hooks/use-general-theme';

/**
 * External Dependencies
 */
import { css } from 'emotion';
interface Props {
	data: any;
}

const Methods: React.FC< Props > = ( { data } ) => {
	const { setPaymentData, completeForm } = useDispatch(
		'quillForms/renderer-core'
	);
	const generalTheme = useGeneralTheme();

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
		<div className="renderer-core-payment-modal-methods">
			<p
				className={ css`
					color: ${ generalTheme.questionsColor };
					font-size: 20px;
				` }
			>
				Select a payment method
			</p>
			<div className="renderer-components-radio-control__options-group">
				<RadioControl
					id="payment-methods"
					selected={ selected }
					options={ options }
					onChange={ setSelected }
				/>
			</div>
			<CustomerRender
				slug={ selected }
				data={ data }
				onComplete={ () => {
					completeForm();
					setPaymentData( null );
				} }
			/>
		</div>
	);
};

export default Methods;
