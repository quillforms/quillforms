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
	for ( const [ key, currency ] of Object.entries( Currencies ) ) {
		CurrencyOptions.push( {
			key,
			name: currency.name,
		} );
	}
	const CurrencySymbol = Currencies[ general.currency.code ].symbol;
	const CurrencySymbolPosOptions = [
		{
			key: 'left',
			name: formatMoney( 1, CurrencySymbol, 'left' ),
		},
		{
			key: 'left_space',
			name: formatMoney( 1, CurrencySymbol, 'left_space' ),
		},
		{
			key: 'right',
			name: formatMoney( 1, CurrencySymbol, 'right' ),
		},
		{
			key: 'right_space',
			name: formatMoney( 1, CurrencySymbol, 'right_space' ),
		},
	];

	return (
		<>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Currency" />
					<SelectControl
						className={ css`
							width: 225px;
							.components-custom-select-control__label {
								margin-bottom: 0;
							}
							.components-base-control__field {
								margin-bottom: 0;
							}
							.components-text-control__input {
								margin: 0;
							}
						` }
						options={ CurrencyOptions }
						value={ CurrencyOptions.find(
							( option ) => option.key === general.currency.code
						) }
						onChange={ ( { selectedItem } ) => {
							if ( selectedItem ) {
								updateGeneral(
									{
										currency: {
											code: selectedItem.key,
											symbol_pos:
												Currencies[ selectedItem.key ]
													.symbol_pos,
										},
									},
									'recursive'
								);
							}
						} }
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Currency Format" />
					<SelectControl
						className={ css`
							margin-left: 0.25rem;
							.components-custom-select-control__label {
								margin-bottom: 0;
							}
							.components-base-control__field {
								margin-bottom: 0;
							}
							.components-text-control__input {
								margin: 0;
							}
						` }
						options={ CurrencySymbolPosOptions }
						value={
							CurrencySymbolPosOptions.find(
								( option ) =>
									option.key === general.currency.symbol_pos
							) ?? CurrencySymbolPosOptions[ 0 ]
						}
						onChange={ ( { selectedItem } ) => {
							if ( selectedItem ) {
								updateGeneral(
									{
										currency: {
											symbol_pos: selectedItem.key,
										},
									},
									'recursive'
								);
							}
						} }
					/>
				</ControlWrapper>
			</BaseControl>
		</>
	);
};

export default Currency;
