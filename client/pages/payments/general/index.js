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
import { __ } from '@wordpress/i18n';
const General = () => {
	const { general, updateGeneral } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__general">
			<h3> General Settings </h3>
			<div className="quillforms-payments-page-settings__general-content">
				<BaseControl>
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Enable Payments', 'quillforms')}

						></ControlLabel>
						<ToggleControl
							checked={general.enabled}
							onChange={() =>
								updateGeneral({ enabled: !general.enabled })
							}
						/>
					</ControlWrapper>
				</BaseControl>
				<Currency />
			</div>
		</div>
	);
};

export default General;
