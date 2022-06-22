/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	TextControl,
	SelectControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const Recurring = ( { id } ) => {
	const { models, updateModel } = usePaymentsContext();
	const model = models[ id ];

	const RecurringIntervalUnitOptions = [
		{
			name: __( 'Day/s', 'quillforms' ),
			key: 'day',
		},
		{
			name: __( 'Week/s', 'quillforms' ),
			key: 'week',
		},
		{
			name: __( 'Month/s', 'quillforms' ),
			key: 'month',
		},
		{
			name: __( 'Year/s', 'quillforms' ),
			key: 'year',
		},
	];
	const RecurringIntervalCountMax = {
		day: 365,
		week: 52,
		month: 12,
		year: 10,
	};

	return (
		<BaseControl>
			<ControlWrapper orientation="horizontal">
				<ControlLabel label="Recurring Payment" />
				<ToggleControl
					checked={ model.recurring }
					onChange={ () =>
						updateModel( id, {
							recurring: model.recurring
								? false
								: {
										interval_count: 1,
										interval_unit: 'month',
								  },
						} )
					}
				/>
			</ControlWrapper>
			{ model.recurring && (
				<div className="payment-model-recurring">
					<span
						className={ css`
							margin-right: 10px;
						` }
					>
						Every
					</span>
					<TextControl
						type="number"
						value={ model.recurring.interval_count }
						onChange={ ( interval_count ) =>
							updateModel(
								id,
								{
									recurring: { interval_count },
								},
								'recursive'
							)
						}
						step={ 1 }
						min={ 1 }
						max={
							RecurringIntervalCountMax[
								model.recurring.interval_unit
							]
						}
						className={ css`
							width: 100px;
							margin-right: 10px;
						` }
					/>
					<SelectControl
						options={ RecurringIntervalUnitOptions }
						value={ RecurringIntervalUnitOptions.find(
							( option ) =>
								option.key === model.recurring.interval_unit
						) }
						onChange={ ( { selectedItem } ) => {
							if ( selectedItem ) {
								let interval_unit = selectedItem.key;
								let interval_count = Math.min(
									model.recurring.interval_count,
									RecurringIntervalCountMax[ interval_unit ]
								);
								updateModel(
									id,
									{
										recurring: {
											interval_unit,
											interval_count,
										},
									},
									'recursive'
								);
							}
						} }
					/>
				</div>
			) }
		</BaseControl>
	);
};

export default Recurring;
