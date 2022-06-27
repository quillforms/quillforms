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
 * Internal Dependencies
 */
import { usePaymentsContext } from '../../../state/context';

const Name = ( { id } ) => {
	const { models, updateModel } = usePaymentsContext();
	const model = models[ id ];

	return (
		<BaseControl>
			<ControlWrapper orientation="horizontal">
				<ControlLabel label="Model Name" />
				<div className="payment-model-name">
					<TextControl
						value={ model.name }
						onChange={ ( name ) => {
							updateModel( id, {
								name,
							} );
						} }
					/>
				</div>
			</ControlWrapper>
		</BaseControl>
	);
};

export default Name;
