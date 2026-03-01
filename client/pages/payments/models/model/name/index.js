/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const Name = ({ id, index }) => {
	const { models, updateModel } = usePaymentsContext();
	const model = models[id];

	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Model Name" />
				<div className="payment-model-name">
					<TextControl
						value={model.name}
						placeholder={__(`Payment Model #${index}`, 'quillforms')}
						onChange={(name) => {
							updateModel(id, {
								name,
							});
						}}
					/>
				</div>
			</ControlWrapper>
		</BaseControl>
	);
};

export default Name;
