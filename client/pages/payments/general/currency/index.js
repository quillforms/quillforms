/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';
import { formatMoney } from '@quillforms/utils';
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	SelectControl,
} from '@quillforms/admin-components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../state/context';

const Currency = () => {
	const { general, updateGeneral } = usePaymentsContext();

	const Currencies = ConfigApi.getCurrencies();
	const CurrencyOptions = [];
	for (const [key, currency] of Object.entries(Currencies)) {
		CurrencyOptions.push({
			key,
			name: currency.name,
		});
	}
	const CurrencySymbol = Currencies[general.currency.code].symbol;
	const CurrencySymbolPosOptions = [
		{
			key: 'left',
			name: formatMoney(1, CurrencySymbol, 'left'),
		},
		{
			key: 'left_space',
			name: formatMoney(1, CurrencySymbol, 'left_space'),
		},
		{
			key: 'right',
			name: formatMoney(1, CurrencySymbol, 'right'),
		},
		{
			key: 'right_space',
			name: formatMoney(1, CurrencySymbol, 'right_space'),
		},
	];

	return (
		<div className=" grid grid-cols-1 md:grid-cols-2 gap-4 ">
			<BaseControl>
				<ControlWrapper orientation="vertical">
					<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7'>{__('Currency', 'quillforms')}</span>} />
					<SelectControl
						className={css`
							width: 100%;
							.components-custom-select-control__label {
								margin-bottom: 0 !important;
							}
							.components-base-control__field {
								margin-bottom: 0 !important;
							}
							/* Style the visible select input */
							.components-custom-select-control__button {
								margin: 0 !important;
								padding: 20px 16px !important;
								border-radius: 12px !important;
								border: 1px solid #d9d9d9 !important;
								font-size: 16px !important;
								color: #334155 !important;
								line-height: 28px !important;
								background-color: #fff;
							}
						` }
						options={CurrencyOptions}
						value={CurrencyOptions.find(
							(option) => option.key === general.currency.code
						)}
						onChange={({ selectedItem }) => {
							if (selectedItem) {
								updateGeneral(
									{
										currency: {
											code: selectedItem.key,
											symbol_pos:
												Currencies[selectedItem.key]
													.symbol_pos,
										},
									},
									'recursive'
								);
							}
						}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="vertical">
					<ControlLabel label={<span className='!m-0 !text-[#334155] !text-xl leading-7'>{__('Currency Format', 'quillforms')}</span>} />
					<SelectControl
						className={css`
							width: 100%;
							.components-custom-select-control__label {
								margin-bottom: 0 !important;
							}
							.components-base-control__field {
								margin-bottom: 0 !important;
							}
							/* Style the visible select input */
							/* Style the visible select input */
							.components-custom-select-control__button {
								margin: 0 !important;
								padding: 20px 16px !important;
								border-radius: 12px !important;
								border: 1px solid #d9d9d9 !important;
								font-size: 16px !important;
								color: #334155 !important;
								line-height: 28px !important;
								background-color: #fff;
							}
						` }
						options={CurrencySymbolPosOptions}
						value={
							CurrencySymbolPosOptions.find(
								(option) =>
									option.key === general.currency.symbol_pos
							) ?? CurrencySymbolPosOptions[0]
						}
						onChange={({ selectedItem }) => {
							if (selectedItem) {
								updateGeneral(
									{
										currency: {
											symbol_pos: selectedItem.key,
										},
									},
									'recursive'
								);
							}
						}}
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};

export default Currency;
