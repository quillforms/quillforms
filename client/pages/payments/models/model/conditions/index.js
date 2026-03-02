/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	LogicConditions,
} from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';
import { __ } from '@wordpress/i18n';

const Conditions = ( { id } ) => {
	const { models, updateModel } = usePaymentsContext();
	const model = models[ id ];

	return (
		<BaseControl>
			<ControlWrapper orientation="horizontal">
				<span style={{ fontSize: '18px', fontWeight: '500', color: '#334155', lineHeight: '28px' }}>
					{__('Conditional Logic', 'quillforms')}
				</span>
				<ToggleControl
					checked={ !! model.conditions }
					onChange={ () =>
						updateModel( id, {
							// when set to [], it will be updated instantly on LogicConditions mount.
							conditions: model.conditions ? false : [],
						} )
					}
				/>
			</ControlWrapper>
			{ !! model.conditions && (
				<div className="payment-model-conditions">
					<div className="payment-model-conditions-instructions">
						Use this payment model if the following conditions are
						met:
					</div>
					<LogicConditions
						value={ model.conditions }
						onChange={ ( conditions ) =>
							updateModel( id, { conditions } )
						}
						combobox={ {
							excerptLength: 15,
						} }
					/>
				</div>
			) }
		</BaseControl>
	);
};

export default Conditions;
