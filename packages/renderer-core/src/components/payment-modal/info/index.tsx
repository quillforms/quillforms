/**
 * QuillForms Dependencies
 */
import { formatMoney } from '@quillforms/utils';

interface Props {
	data: any;
}

const Info: React.FC< Props > = ( { data } ) => {
	const cs = data.payments.currency.symbol;
	const csp = data.payments.currency.symbol_pos;

	return (
		<div className="renderer-core-payment-modal-info">
			{ data.payments.products.items.map( ( item, index ) => {
				return (
					<div key={ index }>
						{ item.name }: { formatMoney( item.price, cs, csp ) }
					</div>
				);
			} ) }
			<div>
				Total: { formatMoney( data.payments.products.total, cs, csp ) }
			</div>
			<div>
				{ data.payments.recurring
					? `Paid every ${ data.payments.recurring.interval_count } ${ data.payments.recurring.interval_unit }/s`
					: 'Paid one-time' }
			</div>
		</div>
	);
};

export default Info;
