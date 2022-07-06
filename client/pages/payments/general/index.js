/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
} from '@quillforms/admin-components';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../state/context';
import Currency from './currency';

const General = () => {
	const { general, updateGeneral } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__general">
			<h3> General Settings </h3>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Enable Payments"></ControlLabel>
					<ToggleControl
						checked={ general.enabled }
						onChange={ () =>
							updateGeneral( { enabled: ! general.enabled } )
						}
					/>
				</ControlWrapper>
			</BaseControl>

			<Currency />
		</div>
	);
};

export default General;
