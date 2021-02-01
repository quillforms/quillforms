/**
 * Internal Dependencies
 */
import MessagePreview from '../message-preview';
import MessageBaseControl from '../base-control';
import MessageControlWrapper from '../control-wrapper';
import MessageControlLabel from '../control-label';
import MessageEdit from '../message-edit';

const MessageRow = ( {
	messageToEdit,
	setMessageToEdit,
	defaultValue,
	messageKey,
	value,
	format,
	label,
	mergeTags,
} ) => {
	const isSelected = messageToEdit === messageKey;
	return (
		<div
			className="message-editor-message-row"
			role="presentation"
			onClick={ () => setMessageToEdit( messageKey ) }
		>
			<MessageBaseControl>
				<MessageControlWrapper
					orientation={ isSelected ? 'vertical' : 'horizontal' }
				>
					<MessageControlLabel label={ label } />
					{ ! isSelected ? (
						<MessagePreview format={ format } value={ value } />
					) : (
						<MessageEdit
							format={ format }
							messageKey={ messageKey }
							value={ value }
							editingComplete={ () => {
								setMessageToEdit( null );
							} }
							mergeTags={ mergeTags }
							defaultValue={ defaultValue }
						/>
					) }
				</MessageControlWrapper>
			</MessageBaseControl>
		</div>
	);
};

export default MessageRow;
