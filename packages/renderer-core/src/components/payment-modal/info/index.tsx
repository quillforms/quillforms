/**
 * QuillForms Dependencies
 */
import { formatMoney } from '@quillforms/utils';
import useGeneralTheme from '../../../hooks/use-general-theme';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import tinycolor from 'tinycolor2';
import Button from '../../button';
/**
 * Internal Dependencies
 */
interface Props {
	data: any;
}

const Info: React.FC< Props > = ( { data } ) => {
	const generalTheme = useGeneralTheme();
	const questionsColor = tinycolor( generalTheme.questionsColor );
	const cs = data.payments.currency.symbol;
	const csp = data.payments.currency.symbol_pos;

	return (
		<div className="renderer-core-payment-modal-info">
			<div
				className={ classnames(
					'renderer-core-payment-modal-info__heading',
					css`
						font-size: 22px;
						text-transform: uppercase;
						background: ${ generalTheme.buttonsBgColor };
						padding: 15px;
						color: ${ generalTheme.buttonsFontColor };
						border-top-right-radius: 8px;
						border-top-left-radius: 8px;
					`
				) }
			>
				{ data.payments.labels?.order_details_heading ?? 'Your Order' }
			</div>
			{ data.payments.products.items.map( ( item, index ) => {
				return (
					<div
						key={ index }
						className={ classnames(
							'renderer-core-payment-order__item-row',
							css`
								color: ${ generalTheme.questionsColor };
								border-bottom: 1px solid;
								border-color: ${ questionsColor
									.setAlpha( 0.3 )
									.toString() };
							`
						) }
					>
						<div className="renderer-core-payment-order__item-name">
							{ item.name }
						</div>
						<div className="renderer-core-payment-order__item-price">
							{ formatMoney( item.price, cs, csp ) }{ ' ' }
						</div>
					</div>
				);
			} ) }
			<div
				className={ classnames(
					'renderer-core-payment-modal-info_footer',
					css`
						color: ${ generalTheme.questionsColor };
						font-weight: bold;
					`
				) }
			>
				<div>{ data.payments.labels?.order_total ?? 'Total' } </div>
				<div>
					{ formatMoney( data.payments.products.total, cs, csp ) }{ ' ' }
					{ data.payments.recurring &&
						` /${ data.payments.recurring.interval_count } ${ data.payments.recurring.interval_unit }/s` }
				</div>
			</div>
		</div>
	);
};

export default Info;
