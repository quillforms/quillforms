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

const General = () => {
	const { enabled, setEnabled } = usePaymentsContext();

	return (
		<div className="quillforms-payments-page-settings__general">
			<h3> General Settings </h3>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Enable Payments"></ControlLabel>
					<ToggleControl
						checked={ enabled }
						onChange={ () => setEnabled( ! enabled ) }
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};

export default General;
